<template>
    <div id="three" style="width: 50vw; height: 50vw;"></div>
</template>
  
<script lang="ts" setup>

import * as THREE from 'three'
import { onMounted, watch } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import axios from 'axios'

let group3_env
let group3_steps
let isEvnDone = false
let isStepDone = false
let model_drone
let model

//创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xeeeeee); //灰色0x7f7f7f

let widthofelement: number = 700, heightofelement: number = 700

//创建渲染器
const renderer = new THREE.WebGLRenderer()
onMounted(() => {
    widthofelement = document.getElementById("three").clientWidth
    heightofelement = document.getElementById("three").clientHeight
    renderer.setSize(widthofelement, heightofelement)
    document.getElementById("three").appendChild(renderer.domElement)
    console.log(document.getElementById("three").clientWidth + "////" + document.getElementById("three").clientHeight)
    axios.get("http://192.168.31.216:8081/home/group3/getEnv")
        .then(function (response) {
            group3_env = response.data
            isEvnDone = true
        })
        .catch(function (error) {
            console.log(error);
        });
    axios.get("http://192.168.31.216:8081/home/group3/getAllSteps")
        .then(function (response) {
            group3_steps = response.data
            isStepDone = true
        })
        .catch(function (error) {
            console.log(error);
        });
})

//添加世界坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//创建相机
const camera = new THREE.PerspectiveCamera(
    80, //视角
    widthofelement / heightofelement, //宽高比
    0.1, //近距离
    1000 //远距离
)

//相机位置，z轴为朝向自己的方向，y轴为垂直方向
camera.position.set(25, 20, 25)
// 设置相机朝向的位置
// camera.lookAt(100, 0, 100)

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(100, 0, 100)

setTimeout(() => {
    if (isEvnDone) {
        console.log(group3_env.start_pos)
    } else {
        console.log("请稍等，环境数据还在加载中…")
    }

    if (isStepDone) {
        console.log(group3_steps.all_steps)
    } else {
        console.log("请稍等，无人机路线数据还在加载中…")
    }
}, 500)


//添加一个网格地面
const gridHelper = new THREE.GridHelper(50, 50, 0xcccccc, 0xcccccc)
gridHelper.position.set(50 / 2, 0, 50 / 2);
scene.add(gridHelper)

//实例化加载器
const gltfLoader = new GLTFLoader()

//加载UAV
gltfLoader.load(
    //模型路径
    "./models/UAV/low-poly_uav.glb",
    (gltf: { scene: any }) => {
        console.log(gltf)
        model_drone = gltf.scene
        model_drone.scale.set(0.5, 0.5, 0.5)
        scene.add(model_drone)
        // 检查是否请求完成并更新模型位置
        if (isStepDone && isEvnDone && model_drone) {
            model_drone.position.set(group3_env.start_pos[0], 0, group3_env.start_pos[1])
            moveModel()
        }
    }
)



// //加载car
// gltfLoader.load(
//     //模型路径
//     "./models/Car/low_poly_tank.glb",
//     (gltf) => {
//         console.log(gltf)
//         model_car = gltf.scene
//         model_car.scale.set(0.0005, 0.0005, 0.0005)
//         model_car.position.set(25, 0, 25)
//         model_car.traverse(function (child) {
//             if (child.isMesh) {
//                 child.frustumCulled = false;
//                 //模型阴影
//                 child.castShadow = true;
//                 //模型自发光
//                 child.material.emissive = child.material.color;
//                 child.material.emissiveMap = child.material.map;
//             }
//         }) 
//         scene.add(model_car)
//     }
// )

// //加载ship
// gltfLoader.load(
//     //模型路径
//     "./models/Ship/ship.glb",
//     (gltf) => {
//         console.log(gltf)
//         model_ship = gltf.scene
//         model_ship.scale.set(0.05, 0.05, 0.05)
//         model_ship.position.set(25, 0.1, 24)
//         model_ship.traverse(function (child) {
//             if (child.isMesh) {
//                 child.frustumCulled = false;
//                 //模型阴影
//                 child.castShadow = true;
//                 //模型自发光
//                 child.material.emissive = child.material.color;
//                 child.material.emissiveMap = child.material.map;
//             }
//         })
//         scene.add(model_ship)
//     }
// )

// //加载people
// gltfLoader.load(
//     //模型路径
//     "./models/People/three_soldier.glb",
//     (gltf) => {
//         console.log(gltf)
//         model_people = gltf.scene
//         model_people.scale.set(0.001, 0.001, 0.001)
//         model_people.position.set(25, 0, 26)
//         model_people.lookAt(0, 0, 0)
//         model_people.traverse(function (child) {
//             if (child.isMesh) {
//                 child.frustumCulled = false;
//                 //模型阴影
//                 child.castShadow = true;
//                 //模型自发光
//                 child.material.emissive = child.material.color;
//                 child.material.emissiveMap = child.material.map;
//             }
//         })
//         scene.add(model_people)
//     }
// )

// //放置车船人
// async function loadModels() {
//     if (!isEvnDone) {
//         // 如果请求尚未完成，则等待0.5秒
//         await new Promise((resolve) => setTimeout(resolve, 500));
//         await loadModels(); // 递归调用，直到isRequestDone为true
//     } else {
//         const allObstacles = group3_env.all_obstacles;

//         allObstacles.forEach((obstacle: any[]) => {
//             const x = obstacle[0];
//             const y = obstacle[1];
//             const type = obstacle[2];

//             let model

//             if (type === 0) {
//                 model = model_car.clone();
//                 model.position.set(x, 0, y);
//                 scene.add(model);
//             } else if (type === 1) {
//                 model = model_ship.clone();
//                 model.position.set(x, 0.1, y);
//                 scene.add(model);
//             } else if (type === 2) {
//                 model = model_people.clone();
//                 model.position.set(x, 0, y);
//                 scene.add(model);
//             }
//         });
//     }
// }

// loadModels();

//模型加载
function loadModel(modelPath: any, scale: any, position: any) {
    gltfLoader.load(
        modelPath,
        (gltf: { scene: any }) => {
            console.log(gltf)
            model = gltf.scene
            model.scale.set(scale[0], scale[1], scale[2])
            model.position.set(position[0], position[1], position[2])
            model.traverse(function (child: { isMesh: any; frustumCulled: boolean; castShadow: boolean; material: { emissive: any; color: any; emissiveMap: any; map: any } }) {
                if (child.isMesh) {
                    child.frustumCulled = false;
                    //模型阴影
                    child.castShadow = true;
                    //模型自发光
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                }
            })
            scene.add(model)

        }
    )
}


//放置车船人
async function loadAllModels() {
    if (!isEvnDone) {
        // 如果请求尚未完成，则等待0.5秒
        await new Promise((resolve) => setTimeout(resolve, 500));
        await loadAllModels(); // 递归调用，直到isRequestDone为true
    } else {
        const allObstacles = group3_env.all_obstacles;

        allObstacles.forEach((obstacle: any[]) => {
            const x = obstacle[0];
            const y = obstacle[1];
            const type = obstacle[2];

            if (type === 0) { // Car
                let scale = [0.0005, 0.0005, 0.0005]
                let position = [x, 0, y]
                loadModel("./models/Car/low_poly_tank.glb", scale, position)
            } else if (type === 1) { //Ship
                let scale = [0.05, 0.05, 0.05]
                let position = [x, 0.1, y]
                loadModel("./models/Ship/ship.glb", scale, position)
            } else if (type === 2) { //People
                let scale = [0.001, 0.001, 0.001]
                let position = [x, 0, y]
                loadModel("./models/People/three_soldier.glb", scale, position)
            }
        });
    }
}

loadAllModels();



// UAV移动模型函数Tween
function moveModel() {
    console.log("开始移动模型")
    if (group3_steps) {
        // const tweenTime = 100;
        let previousTween = null

        for (let i = 0; i < group3_steps.all_steps.length; i++) {
            const coordinates = group3_steps.all_steps[i]
            const x = coordinates[0]
            const y = coordinates[1]
            const z = 5

            const targetPosition = new THREE.Vector3(x, z, y)
            let distance = model_drone.position.distanceTo(targetPosition)

            const tween = new TWEEN.Tween(model_drone.position)
                .to(targetPosition, distance * 18)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => {
                    model_drone.lookAt(targetPosition);
                    // controls.target = targetPosition
                })
                .onUpdate(() => {

                })
                .onComplete(() => {
                    
                })


            if (previousTween) {
                // tween.delay(distance * 50);
                previousTween.chain(tween);
            } else {
                tween.start()
            }
            previousTween = tween
        }
    }
}



// //纯three.js
// function moveModel() {
//     console.log("开始移动模型")
//     if (group3_steps) {
//         // 使用从服务器获取的坐标逐一移动模型
//         for (let i = 0; i < group3_steps.all_steps.length; i++) {
//             const coordinates = group3_steps.all_steps[i];
//             const x = coordinates[0];
//             const y = coordinates[1];
//             const z = 5;

//             // 这里你需要使用某种移动方式来连续到达每个坐标
//             // 例如，你可以使用Tween.js或者自己的动画函数来实现连续移动
//             // 以下是一个简单的例子，你可以根据需要修改
//             setTimeout(() => {
//                 model_drone.lookAt(x, z, y);
//                 model_drone.position.set(x, z, y);
//                 controls.target = new THREE.Vector3(x, z, y)
//             }, i * 100); // 假设每秒移动一次，你可以根据需要调整时间间隔
//         }
//     }
// }


//半球光
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
hemiLight.position.set(0, 100, 0) // 灯光位置
scene.add(hemiLight)

//添加环境光
const light = new THREE.AmbientLight(0x404040); // 柔和的白光
scene.add(light);
//平行光
const dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(-0, 40, 50) // 灯光位置
dirLight.castShadow = true // 产生阴影
dirLight.shadow.camera.top = 50
dirLight.shadow.camera.bottom = -25
dirLight.shadow.camera.left = -25
dirLight.shadow.camera.right = 25
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 200
dirLight.shadow.mapSize.set(1024, 1024)
scene.add(dirLight)





watch(() => group3_env, () => { console.log(group3_env) }) // 这里可以打印出group3_env，因为watch会监听group3_env的变化 })

//渲染函数
function animate() {
    if(model_drone){
        controls.target = model_drone.position
    }
    
    controls.update()
    //调用animate
    requestAnimationFrame(animate) //异步函数
    // TWEEN.update();
    TWEEN.update()
    // console.log('Camera Position:', camera);
    //渲染
    renderer.render(scene, camera)
}

animate()


</script>
  
<style></style>