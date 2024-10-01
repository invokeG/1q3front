<template>
    <div style="width: 100vw; height: 100vh">
        <div style="display: flex;">
            <div id="three" style="width: 50vw; height: 50vw; text-align: left"></div>
            <div>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span style="font-size: 12px; font-weight: bold;">无人机路径决策指标</span>
                        </div>
                    </template>
                    <div class="text item" style="font-size: 12px;">平均单步决策成功率: 0.99</div>
                    <div class="text item" style="font-size: 12px;">平均单步决策时间: 9ms</div>
                    <div class="text item" style="font-size: 12px;">整体决策成功率: {{ g3_3 }}</div>
                    <template #footer>Footer content</template>
                </el-card>
            </div>
            <div>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span style="font-size: 12px; font-weight: bold;">自主和协同阶段</span>
                        </div>
                    </template>
                    <div class="text item" style="font-size: 12px;">决策准确率：{{ g2_1 }}</div>
                    <div class="text item" style="font-size: 12px;">平均单步决策时间：{{ g2_2 }}</div>
                    <template #footer>Footer content</template>
                </el-card>
            </div>
            <div>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span style="font-size: 12px; font-weight: bold;">打击任务已全部完成</span>
                        </div>
                    </template>
                    <div class="text item" style="font-size: 12px;">
                        已打击点坐标:
                        <div v-for="target in targetsModels" :key="target.position.x" style="white-space: pre-line;">
                            [{{ target.position.x }}, {{ target.position.y }}]
                        </div>
                    </div>
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
    drone1_steps: number[][];
}

let group3_env: Env;
let group3_steps: Step;
let isEvnDone: boolean = false;
let isStepDone: boolean = false;
let targetsModels = ref<{ position: THREE.Vector2 }[]>([]);
const carModels = ref<{ position: THREE.Vector2; model: THREE.Object3D }[]>([]);
const shipModels = ref<{ position: THREE.Vector2; model: THREE.Object3D }[]>([]);
const peopleModels = ref<{ position: THREE.Vector2; model: THREE.Object3D }[]>([]);

let g2_1 = ref<string>("0.96");
let g2_2 = ref<number | null | string>("10ms");
    let g3_3 = ref<number | null | string>("0.99");



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
    axios.get("http://101.43.140.164:7310/home/group3/getEnv")
        // axios.get("http://localhost:8080/home/group3/getEnv")
        .then(function (response) {
            group3_env = response.data;
            isEvnDone = true;
        })
        .catch(function (error) {
            console.log(error);
        });

    // 二组打击寻路
    axios.get("http://101.43.140.164:7310/home/group3/getAllSteps")
        // axios.get("http://localhost:8080/home/group3/getAllSteps")
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
camera.position.set(-5, 10, -5);
// 设置相机朝向的位置
// camera.lookAt(0, 0, 0)

const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(25, 0, 25);

setTimeout(() => {
    if (isEvnDone) {
        console.log(group3_env.start_pos);
    } else {
        console.log("请稍等，环境数据还在加载中…");
    }

    if (isStepDone) {
        console.log(group3_steps.drone1_steps);
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



//模型加载
function loadModel(modelPath: string, scale: number[], position: number[]): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            modelPath,
            (gltf: any) => {
                const model = gltf.scene;
                model.scale.set(scale[0], scale[1], scale[2]);
                model.position.set(position[0], position[1], position[2]);
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.frustumCulled = false;
                        child.castShadow = true;
                        child.material.emissive = child.material.color;
                        child.material.emissiveMap = child.material.map;
                    }
                });
                scene.add(model);
                resolve(model); // 返回模型对象
            },
            undefined,
            (error) => {
                console.error('An error happened', error);
                reject(error);
            }
        );
    });
}

// 专门用于加载 explosion 模型的方法
function loadExplosionModel(modelPath: string, scale: number[], position: number[]): Promise<THREE.Object3D> {
    return new Promise((resolve) => {
        gltfLoader.load(
            modelPath,
            (gltf: any) => {
                const model = gltf.scene;
                model.scale.set(scale[0], scale[1], scale[2]);
                model.position.set(position[0], position[1], position[2]);
                scene.add(model);
                resolve(model); // 返回模型对象
            },

        );
    });
}



//放置车船人 & 目标
async function loadAllModels() {
    if (!isEvnDone) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await loadAllModels();
    } else {
        const allObstacles = group3_env.all_obstacles;
        const targets: number[][] = group3_env.targets;

        allObstacles.map(async (obstacle) => {
            const [x, y, type] = obstacle;
            let modelPath: string;
            let scale: number[];
            let position: [number, number, number] = [x, 0, y];

            if (type === 0) { // Car
                modelPath = "./models/Car/truck.glb";
                scale = [0.0005, 0.0005, 0.0005];
                carModels.value.push({ position: new THREE.Vector2(x, y), model: await loadModel(modelPath, scale, position) });
            } else if (type === 1) { // Ship
                modelPath = "./models/Ship/low-poly_warship.glb";
                scale = [0.05, 0.05, 0.05];
                position = [x, 0.1, y];
                shipModels.value.push({ position: new THREE.Vector2(x, y), model: await loadModel(modelPath, scale, position) });
            } else if (type === 2) { // People
                modelPath = "./models/People/three_soldier.glb";
                scale = [0.001, 0.001, 0.001];
                peopleModels.value.push({ position: new THREE.Vector2(x, y), model: await loadModel(modelPath, scale, position) });
            }
        });

        targets.forEach((target: number[]) => {
            const x: number = target[0];
            const y: number = target[1];

            let scale: number[] = [100, 100, 100];
            let position: number[] = [x, 0, y];
            loadExplosionModel("./models/Explosion/pin.glb", scale, position);

            // 更新 targetsModels.value
            targetsModels.value.push({
                position: new THREE.Vector2(x, y),
            });
        });
    }
}

loadAllModels();

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


// watch 和 animate 函数保持不变
watch(() => group3_env, () => {
    console.log(group3_env);
});

// 渲染函数
function animate() {
    // // 更新所有无人机组的目标
    // droneGroups.forEach(({ group }) => {
    //     if (model_drone) {
    //         controls.target = group.position; // 更新控制器的目标为当前无人机组
    //     }
    // });

    controls.update();
    // 调用 animate
    requestAnimationFrame(animate); // 异步函数
    // TWEEN.update();
    TWEEN.update();

    // 渲染
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