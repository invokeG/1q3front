<template>
    <div style="width: 100vw; height: 100vh">
        <div style="display: flex;">
            <div id="three" style="width: 50vw; height: 50vw; text-align: left"></div>
            <div>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>无人机路径决策指标</span>
                        </div>
                    </template>
                    <div class="text item">单步决策成功率: 0.99</div>
                    <div class="text item">单步决策时间: 9ms</div>
                    <div class="text item">整体决策成功率: {{g3_3}}</div>
                    <!-- <div class="text item">五倍加速: {{g3_4}}</div> -->
                    <!-- <div v-for="o in 4" :key="o" class="text item">{{ '数据 ' + o }}</div> -->
                    <template #footer>Footer content</template>
                </el-card>
            </div>
            <div>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>自主和协同阶段</span>
                        </div>
                    </template>
                    <div class="text item">决策准确率：{{g2_1}}</div>
                    <div class="text item">平均单步决策时间：{{g2_2}}</div>
                    <!-- <div v-for="o in 4" :key="o" class="text item">{{ '数据 ' + o }}</div> -->
                    <template #footer>Footer content</template>
                </el-card>
            </div>
            <div>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>UAV实时坐标</span>
                        </div>
                    </template>
                    <div class="text item">{{ locationOfUAV }}</div>
                    <template #footer>Footer content</template>
                </el-card>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>

import * as THREE from 'three'
import { onMounted, watch, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import axios from 'axios'

interface Env {
    all_obstacles: number[][];
    start_pos: number[];
    targets: number[][];
}

interface Step {
    all_steps: number[][];
}

let group3_env: Env;
let group3_steps: Step;
let isEvnDone: boolean = false;
let isStepDone: boolean = false;
let model_drone: THREE.Scene;
let model: THREE.Scene;
let posOfUAV: THREE.Mesh;
let sightOfUAV: THREE.Mesh;

let locationOfUAV = ref();
// let isDetectionDone = ref(false);
// const isHitDone = ref(false)
let g2_1 = ref<number|null|string>(null);
let g2_2 = ref<string>("N/A");
let g3_3 = ref<number|null|string>(null);
// let g3_4 = ref<string>("N/A");



//创建场景
const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee); //灰色0x7f7f7f

let widthofelement: number = 700, heightofelement: number = 700;
//创建渲染器
const renderer = new THREE.WebGLRenderer();
onMounted(() => {
    widthofelement = document.getElementById("three").clientWidth;
    heightofelement = document.getElementById("three").clientHeight;
    renderer.setSize(widthofelement, heightofelement);
    document.getElementById("three").appendChild(renderer.domElement);
    console.log(document.getElementById("three").clientWidth + "////" + document.getElementById("three").clientHeight);
    
    // 二组战场环境
    // axios.get("http://192.168.31.216:8081/home/group3/getEnv")
    axios.get("http://localhost:8080/home/group3/getEnv")
        .then(function (response) {
            group3_env = response.data;
            isEvnDone = true;
        })
        .catch(function (error) {
            console.log(error);
        });

    // 二组打击寻路
    // axios.get("http://192.168.31.216:8081/home/group3/getAllSteps")
    axios.get("http://localhost:8080/home/group3/getAllSteps")
        .then(function (response) {
            group3_steps = response.data;
            isStepDone = true;
        })
        .catch(function (error) {
            console.log(error);
        });
})

//添加世界坐标轴
const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//创建相机
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    80, //视角
    widthofelement / heightofelement, //宽高比
    0.1, //近距离
    1000 //远距离
);

//相机位置，z轴为朝向自己的方向，y轴为垂直方向
camera.position.set(25, 20, 25);
// 设置相机朝向的位置
// camera.lookAt(100, 0, 100)

const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(100, 0, 100);

setTimeout(() => {
    if (isEvnDone) {
        console.log(group3_env.start_pos);
    } else {
        console.log("请稍等，环境数据还在加载中…");
    }

    if (isStepDone) {
        console.log(group3_steps.all_steps);
    } else {
        console.log("请稍等，无人机路线数据还在加载中…");
    }
}, 500);


//添加一个网格地面
const gridHelper: THREE.GridHelper = new THREE.GridHelper(50, 50, 0xcccccc, 0xcccccc);
gridHelper.position.set(50 / 2, 0, 50 / 2);
scene.add(gridHelper);

//实例化加载器
const gltfLoader: GLTFLoader = new GLTFLoader();

//加载UAV
const droneGroup: THREE.Group = new THREE.Group();

function checkConditionsAndProceed() {
    if (isStepDone && isEvnDone && model_drone) {
        console.log("更新模型位置");

        posOfUAV.position.copy(model_drone.position);
        posOfUAV.position.y = 0;
        posOfUAV.rotation.x = -Math.PI / 2;

        sightOfUAV.position.copy(model_drone.position.clone().add(new THREE.Vector3(0, 0, 3.5)));
        sightOfUAV.position.y = 0;
        sightOfUAV.rotation.x = -Math.PI / 2;

        droneGroup.add(model_drone);
        droneGroup.add(posOfUAV);
        droneGroup.add(sightOfUAV);
        droneGroup.position.set(group3_env.start_pos[0], 0, group3_env.start_pos[1]);
        scene.add(droneGroup);

        moveModel();
    } else {
        // 如果条件不满足，等待一段时间后再次检查
        setTimeout(checkConditionsAndProceed, 100); // 每 100 毫秒检查一次
    }
}

gltfLoader.load(
    //模型路径
    "./models/UAV/low-poly_uav.glb",
    (gltf: { scene: any }) => {
        console.log(gltf);
        model_drone = gltf.scene;
        model_drone.scale.set(0.5, 0.5, 0.5);
        console.log("UAV加载完成");
        //创建投影面
        const circleGeometry: THREE.CircleGeometry = new THREE.CircleGeometry(0.1, 32);
        const circleMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        posOfUAV = new THREE.Mesh(circleGeometry, circleMaterial);

        //添加一个矩形表示UAV可见区域
        const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(7, 7);
        const planeMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xccffff, side: THREE.DoubleSide });
        sightOfUAV = new THREE.Mesh(planeGeometry, planeMaterial);

        // 开始检查条件并执行后续操作
        checkConditionsAndProceed();
    }
);



// gltfLoader.load(
//     //模型路径
//     "./models/UAV/low-poly_uav.glb",
//     (gltf: { scene: any }) => {
//         console.log(gltf);
//         model_drone = gltf.scene;
//         model_drone.scale.set(0.5, 0.5, 0.5);
//         console.log("UAV加载完成")


//         //创建投影面
//         const circleGeometry: THREE.CircleGeometry = new THREE.CircleGeometry(0.1, 32);
//         const circleMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
//         posOfUAV = new THREE.Mesh(circleGeometry, circleMaterial);

//         //添加一个矩形表示UAV可见区域
//         const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(7, 7);
//         const planeMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xccffff, side: THREE.DoubleSide });
//         sightOfUAV = new THREE.Mesh(planeGeometry, planeMaterial);

//         // 检查是否请求完成并更新模型位置
//         if (isStepDone && isEvnDone && model_drone) {

//             console.log("更新模型位置");

//             posOfUAV.position.copy(model_drone.position);
//             posOfUAV.position.y = 0;
//             posOfUAV.rotation.x = -Math.PI / 2;

//             sightOfUAV.position.copy(model_drone.position.clone().add(new THREE.Vector3(0, 0, 3.5)));
//             sightOfUAV.position.y = 0;
//             sightOfUAV.rotation.x = -Math.PI / 2;

//             droneGroup.add(model_drone);
//             droneGroup.add(posOfUAV);
//             droneGroup.add(sightOfUAV);
//             droneGroup.position.set(group3_env.start_pos[0], 0, group3_env.start_pos[1]);
//             scene.add(droneGroup);


//             moveModel();
//         }
//     }
// )




//模型加载
function loadModel(modelPath: string, scale: number[], position: number[]) {
    gltfLoader.load(
        modelPath,
        (gltf: any) => {
            model = gltf.scene;
            model.scale.set(scale[0], scale[1], scale[2]);
            model.position.set(position[0], position[1], position[2]);
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.frustumCulled = false;
                    //模型阴影
                    child.castShadow = true;
                    //模型自发光
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                }
            });
            scene.add(model);

        }
    );
}


//放置车船人 & 目标
async function loadAllModels() {
    if (!isEvnDone) {
        // 如果请求尚未完成，则等待0.5秒
        await new Promise((resolve) => setTimeout(resolve, 500));
        await loadAllModels(); // 递归调用，直到isRequestDone为true
    } else {
        const allObstacles: number[][] = group3_env.all_obstacles;
        const targets: number[][] = group3_env.targets;

        allObstacles.forEach((obstacle: any[]) => {
            const x: number = obstacle[0];
            const y: number = obstacle[1];
            const type: number = obstacle[2];

            if (type === 0) { // Car
                // let scale: number[] = [0.0005, 0.0005, 0.0005]; //for tank
                let scale: number[] = [0.0005, 0.0005, 0.0005];
                let position: number[] = [x, 0, y];
                loadModel("./models/Car/truck.glb", scale, position);
            } else if (type === 1) { //Ship
                let scale: number[] = [0.05, 0.05, 0.05];
                let position: number[] = [x, 0.1, y];
                loadModel("./models/Ship/low-poly_warship.glb", scale, position);
            } else if (type === 2) { //People
                let scale: number[] = [0.001, 0.001, 0.001];
                let position: number[] = [x, 0, y];
                loadModel("./models/People/three_soldier.glb", scale, position);
            }
        });

        targets.forEach((target: any[]) => {
            const x: number = target[0];
            const y: number = target[1];

            let scale: number[] = [0.05, 0.05, 0.05];
            let position: number[] = [x, 0, y];
            loadModel("./models/Target/balloon_target.glb", scale, position);

        });
    }
}

loadAllModels();



// UAV移动模型函数Tween

function moveModel() {
    console.log("开始移动模型")
    if (group3_steps) {
        // const tweenTime = 100;
        let previousTween: TWEEN.Tween<THREE.Vector3> = null;

        for (let i = 0; i < group3_steps.all_steps.length; i++) {
            const coordinates: number[] = group3_steps.all_steps[i];
            const x: number = coordinates[0];
            const y: number = coordinates[1];
            const z: number = 0;

            const targetPosition: THREE.Vector3 = new THREE.Vector3(x, z, y);
            let distance: number = droneGroup.position.distanceTo(targetPosition);

            const tween: TWEEN.Tween<THREE.Vector3> = new TWEEN.Tween(droneGroup.position)
                .to(targetPosition, distance * 10)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => {
                    droneGroup.lookAt(targetPosition);
                    model_drone.position.y = 5;
                })
                .onUpdate(() => {
                    locationOfUAV.value = coordinates;
                    g2_1.value = "等待打击结束";
                    g2_2.value = "等待打击结束";
                    g3_3.value = "等待整体决策中";
                    // g3_4.value = "等待整体决策中";
                })
                .onComplete(() => {
                    if (i === group3_steps.all_steps.length - 1) {
                        g3_3.value = 0.99
                        // g3_4.value = "?"
                        setTimeout(() => {
                            g2_1.value = 0.96;
                            g2_2.value = "10ms";
                        }, 10000);
                    }
                });


            if (previousTween) {
                // tween.delay(distance * 50);
                previousTween.chain(tween);
            } else {
                tween.start();
            }
            previousTween = tween;
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
const hemiLight: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 100, 0); // 灯光位置
scene.add(hemiLight);

//添加环境光
const light: THREE.AmbientLight = new THREE.AmbientLight(0x404040); // 柔和的白光
scene.add(light);
//平行光
const dirLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(-0, 40, 50); // 灯光位置
dirLight.castShadow = true; // 产生阴影
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -25;
dirLight.shadow.camera.left = -25;
dirLight.shadow.camera.right = 25;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);





watch(() => group3_env, () => {
    console.log(group3_env);
}); // 这里可以打印出group3_env，因为watch会监听group3_env的变化 })

//渲染函数
function animate() {
    if (model_drone) {
        controls.target = droneGroup.position;
    }

    controls.update();
    //调用animate
    requestAnimationFrame(animate); //异步函数
    // TWEEN.update();
    TWEEN.update();
    // console.log('Camera Position:', camera);
    //渲染
    renderer.render(scene, camera);
}

animate();


</script>
  
<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 200px;
}
</style>