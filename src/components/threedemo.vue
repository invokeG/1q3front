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
let isRequestDone = false
let model_drone
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
            isRequestDone = true
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
camera.position.set(-10, 13, -10)
// 设置相机朝向的位置
// camera.lookAt(100, 0, 100)

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(100, 0, 100)

setTimeout(() => {
    if (isRequestDone) {
        console.log(group3_env.targets)
    } else {
        console.log("请稍等，数据还在加载中…")
    }
}, 500)


//添加一个网格地面
const gridHelper = new THREE.GridHelper(50, 50, 0xcccccc, 0xcccccc)
gridHelper.position.set(50 / 2, 0, 50 / 2);
scene.add(gridHelper)

//实例化加载器
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    //模型路径
    "./models/drone3.glb",
    (gltf) => {
        console.log(gltf)
        model_drone = gltf.scene
        model_drone.scale.set(0.1, 0.1, 0.1)
        model_drone.position.set(1, 2, -1)
        scene.add(model_drone)

        // 检查是否请求完成并更新模型位置
        if (isRequestDone && model_drone) {
            moveModel()
        }
    }
)

// 移动模型函数Tween
function moveModel() {
    console.log("开始移动模型")
    if (group3_env.targets) {
        const tweenTime = 1000;
        let previousTween = null
        let lastTargetPosition = null

        for (let i = 0; i < group3_env.targets.length; i++) {
            const coordinates = group3_env.targets[i]
            const x = coordinates[0]
            const y = coordinates[1]
            const z = 5

            const targetPosition = new THREE.Vector3(x, z, y)

            const tween = new TWEEN.Tween(model_drone.position)
                .to(targetPosition, tweenTime)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    model_drone.lookAt(targetPosition);

                })
                .onComplete(() => {
                    model_drone.lookAt(lastTargetPosition);
                })

            if (previousTween) {
                tween.delay(tweenTime);
                previousTween.chain(tween);
            } else {
                tween.start()
            }
            lastTargetPosition = targetPosition;
            previousTween = tween
        }
    }

    animate()
}





// //纯three.js
// function moveModel() {
//     console.log("开始移动模型")
//     if (group3_env.targets) {
//         // 使用从服务器获取的坐标逐一移动模型
//         for (let i = 0; i < group3_env.targets.length; i++) {
//             const coordinates = group3_env.targets[i];
//             const x = coordinates[0];
//             const y = coordinates[1];
//             const z = 2;

//             // 这里你需要使用某种移动方式来连续到达每个坐标
//             // 例如，你可以使用Tween.js或者自己的动画函数来实现连续移动
//             // 以下是一个简单的例子，你可以根据需要修改
//             setTimeout(() => {
//                 model_drone.position.set(x, z, y);
//             }, i * 1000); // 假设每秒移动一次，你可以根据需要调整时间间隔
//         }
//     }
// }


//半球光
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
hemiLight.position.set(0, 100, 0) // 灯光位置
scene.add(hemiLight)

// //添加环境光
// const light = new THREE.AmbientLight( 0x404040 ); // 柔和的白光
// scene.add( light );
// //平行光
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
    controls.update()
    //调用animate
    requestAnimationFrame(animate) //异步函数
    TWEEN.update();
    // console.log('Camera Position:', camera);
    //渲染
    renderer.render(scene, camera)
}

animate()


</script>
  
<style></style>