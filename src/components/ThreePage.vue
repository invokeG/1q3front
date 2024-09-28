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
                    <div class="text item" style="font-size: 12px;">单步决策成功率: 0.99</div>
                    <div class="text item" style="font-size: 12px;">单步决策时间: 9ms</div>
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
                <el-card class="box-card" v-for="(uav, index) in locationOfUAVs" :key="index">
                    <template #header>
                        <div class="card-header">
                            <span style="font-size: 12px; font-weight: bold;">无人机群{{ index + 1 }}组 实时坐标(km)</span>
                        </div>
                    </template>
                    <div class="text item" style="font-size: 12px;">[{{ uav.value.join(', ') }}]</div>
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
let model_drone: THREE.Scene;
let explosionModel: THREE.Scene;
const targetsModels: { position: THREE.Vector2; model: THREE.Object3D }[] = [];
let baseTargetModel: THREE.Object3D | null = null;
// 新增：跟踪每个无人机是否完成运动
const droneCompleted = ref<boolean[]>(Array(5).fill(false));


// let posOfUAV: THREE.Mesh;
// let sightOfUAV: THREE.Mesh;

// let locationOfUAV = ref();
let locationOfUAVs = ref(Array(5).fill(null).map(() => ({ value: [] })));
// let isDetectionDone = ref(false);
// const isHitDone = ref(false)
let g2_1 = ref<number | null | string>(null);
let g2_2 = ref<string>("N/A");
let g3_3 = ref<number | null | string>(null);
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

// 创建多个无人机组
const droneGroups: {
    group: THREE.Group,
    posOfUAV: THREE.Mesh,
    sightOfUAV: THREE.Mesh,
    label: THREE.Sprite,
    explosionShown: boolean
}[] = [];
const numDrones = 5; // 需要创建的无人机组数量

// 在加载模型时进行初始化
gltfLoader.load(
    "./models/UAV/low-poly_uav.glb",
    (gltf: { scene: any }) => {
        console.log(gltf);
        model_drone = gltf.scene;
        model_drone.scale.set(0.5, 0.5, 0.5);
        console.log("UAV加载完成");

        // 创建多个无人机组
        for (let j = 0; j < numDrones; j++) {
            const droneGroup = new THREE.Group();
            const circleGeometry = new THREE.CircleGeometry(0.1, 32);
            const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
            const posOfUAV = new THREE.Mesh(circleGeometry, circleMaterial);

            // 添加一个矩形表示UAV可见区域
            const planeGeometry = new THREE.PlaneGeometry(7, 7);
            const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xccffff, side: THREE.DoubleSide });
            const sightOfUAV = new THREE.Mesh(planeGeometry, planeMaterial);

            // 添加文本精灵
            const label = createTextSprite("20架", {
                fontSize: 32,
                fontFace: 'Arial',
                borderThickness: 2,
                borderColor: { r: 0, g: 0, b: 0, a: 0 },
                backgroundColor: { r: 255, g: 255, b: 255, a: 0 },
                textColor: { r: 0, g: 0, b: 0, a: 1.0 },
                scale: 2
            });
            label.position.set(0, 8, 0); // 调整Y轴位置，使其位于无人机群正上方

            // 添加到数组中
            droneGroups.push({
                group: droneGroup,
                posOfUAV,
                sightOfUAV,
                label,
                explosionShown: false
            });
            checkConditionsAndProceed(droneGroup, j, posOfUAV, sightOfUAV);
        }
    }
);

function checkConditionsAndProceed(droneGroup: THREE.Group, index: number, posOfUAV: THREE.Mesh, sightOfUAV: THREE.Mesh) {
    if (isStepDone && isEvnDone && model_drone) {
        console.log(`更新模型位置: droneGroup ${index}`);

        // 清空 droneGroup，确保不重复添加
        droneGroup.clear();

        // 创建三架无人机，形成 V 字形
        for (let i = 0; i < 3; i++) {
            const droneClone = model_drone.clone();
            const offsetX = i - 1; // V 字形的 X 方向偏移
            const offsetY = i === 0 ? 1 : (i === 1 ? 0.5 : 1); // 设置不同高度

            droneClone.position.set(offsetX, offsetY + 5, 0); // 整体上移1.5，设置位置

            // 添加到组中
            droneGroup.add(droneClone);
        }

        // 设置 droneGroup 的位置
        droneGroup.position.set(group3_env.start_pos[0], 1.5, group3_env.start_pos[1]); // 整体上移1.5
        scene.add(droneGroup);

        // 更新无人机的投影面和可见区域位置
        posOfUAV.position.set(droneGroup.position.x, 0, droneGroup.position.z);
        posOfUAV.rotation.x = -Math.PI / 2;

        sightOfUAV.position.copy(posOfUAV.position.clone().add(new THREE.Vector3(0, 0, 3.5)));
        sightOfUAV.rotation.x = -Math.PI / 2;

        // 将投影面和可见区域添加到 droneGroup 中
        droneGroup.add(posOfUAV);
        droneGroup.add(sightOfUAV);

        // 添加文本精灵
        const label = createTextSprite("20架", {
            fontSize: 48,
            fontFace: 'Arial',
            borderThickness: 2,
            borderColor: { r: 0, g: 0, b: 0, a: 0 },
            backgroundColor: { r: 255, g: 255, b: 255, a: 0 },
            textColor: { r: 0, g: 0, b: 0, a: 1.0 },
            scale: 1
        });
        label.position.set(0, 6, 0); // 调整Y轴位置，使其位于无人机群正上方
        droneGroup.add(label);

        // 存储 label 到 droneGroups
        droneGroups[index].label = label;

        moveModel(droneGroup, index); // 使用不同的路径
    } else {
        // 如果条件不满足，等待一段时间后再次检查
        setTimeout(() => checkConditionsAndProceed(droneGroup, index, posOfUAV, sightOfUAV), 100); // 每 100 毫秒检查一次
    }
}


function moveModel(droneGroup: THREE.Group, index: number) {
    console.log(`开始移动模型: droneGroup ${index}`);
    let stepsKey = `drone${index + 1}_steps`; // 获取路径键名
    const steps = group3_steps[stepsKey];

    if (steps) {
        let previousTween = null;

        for (let i = 0; i < steps.length; i++) {
            const coordinates = steps[i];
            const x = coordinates[0];
            const y = coordinates[1];
            const z = 0;
            let speedFactor = 10;

            if (coordinates[2] == -1) {
                speedFactor = 10;
            } else if (coordinates[2] == -2) {
                speedFactor = 15;
            } else {
                speedFactor = 7;
            }

            const targetPosition = new THREE.Vector3(x, z, y);
            const distance = droneGroup.position.distanceTo(targetPosition);

            const tween = new TWEEN.Tween(droneGroup.position)
                .to(targetPosition, distance * speedFactor) // 速度
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => {
                    droneGroup.lookAt(targetPosition);
                })
                .onUpdate(() => {
                    if (coordinates[2] == -1) {
                        // 自动导航状态
                        updateUAVLocation(index, coordinates.slice(0, 2));
                        updateLabelText(droneGroups[index].label, "自动导航中(20架)");

                        // 显示 UAV 可见区域
                        droneGroups[index].sightOfUAV.visible = true;

                        // 重置爆炸显示标记，以便下一次可以再次显示爆炸
                        droneGroups[index].explosionShown = false;
                    } else if (coordinates[2] == -2) {
                        updateUAVLocation(index, coordinates.slice(0, 2));
                        updateLabelText(droneGroups[index].label, "返航(20架)");
                    } else {
                        // 正在打击目标点
                        updateUAVLocation(index, coordinates.slice(0, 3));
                        updateLabelText(droneGroups[index].label, "打击决策中(20架)");

                        // 隐藏 UAV 可见区域
                        droneGroups[index].sightOfUAV.visible = false;

                        // 显示爆炸模型（仅在首次进入时显示一次）
                        if (!droneGroups[index].explosionShown && explosionModel && coordinates[3] == -1) {
                            const explosionInstance = explosionModel.clone();
                            explosionInstance.position.set(coordinates[0], 0, coordinates[1]); // 设置爆炸位置
                            scene.add(explosionInstance);

                            const targetPosition = new THREE.Vector2(coordinates[0], coordinates[1]);
                            const targetModelEntry = targetsModels.find((t) => t.position.distanceTo(targetPosition) < 2);

                            if (targetModelEntry) {
                                targetModelEntry.model.visible = false;
                            }

                            // 设置爆炸显示标记为 true，防止重复添加
                            droneGroups[index].explosionShown = true;

                            // 可选：在一段时间后移除爆炸模型
                            setTimeout(() => {
                                scene.remove(explosionInstance);
                            }, 5000); // 5秒后移除
                        }
                    }
                    // if (coordinates[2] == -1) {
                    //     updateUAVLocation(index, coordinates.slice(0, 2));
                    //     updateLabelText(droneGroups[index].label, "自动导航中(20架)");
                    // } else {
                    //     updateUAVLocation(index, coordinates);
                    //     updateLabelText(droneGroups[index].label, "正在打击目标点(20架)");
                    // }

                    g2_1.value = "等待打击结束";
                    g2_2.value = "等待打击结束";
                    g3_3.value = "等待整体决策中";
                    // g3_4.value = "等待整体决策中";
                })
                .onComplete(() => {
                    if (i === steps.length - 1) {
                        // 标记该无人机为完成
                        droneCompleted.value[index] = true;

                        // 触发摄像机跳转
                        focusOnNextDrone();

                        // 完成后的处理
                        g3_3.value = 0.99
                        // g3_4.value = "?"
                        setTimeout(() => {
                            g2_1.value = 0.96;
                            g2_2.value = "10ms";
                        }, 0);
                    }
                });

            if (previousTween) {
                previousTween.chain(tween);
            } else {
                tween.start();
            }
            previousTween = tween;
        }
    }
}

function focusOnNextDrone() {
    // 查找第一个未完成的无人机
    const nextDroneIndex = droneCompleted.value.findIndex(completed => !completed);

    if (nextDroneIndex !== -1) {
        const nextDroneGroup = droneGroups[nextDroneIndex].group;
        const targetPosition = new THREE.Vector3().copy(nextDroneGroup.position);

        // 计算摄像机新的位置（例如，从当前摄像机位置向目标位置移动一定距离）
        const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        const newCameraPosition = new THREE.Vector3().copy(targetPosition).add(direction.multiplyScalar(20)); // 20为距离因子，可根据需要调整

        // 使用 TWEEN 平滑过渡摄像机位置和控制器目标
        new TWEEN.Tween(camera.position)
            .to({
                x: newCameraPosition.x,
                y: newCameraPosition.y,
                z: newCameraPosition.z
            }, 2000) // 过渡时间为2秒
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

        // 创建一个临时 Vector3 来存储目标位置的变化
        const newTarget = {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z
        };

        // 更新新目标的坐标
        newTarget.x = targetPosition.x;
        newTarget.y = targetPosition.y;
        newTarget.z = targetPosition.z;

        // 使用 TWEEN 平滑过渡控制器的目标
        new TWEEN.Tween(newTarget)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, 2000) // 过渡时间与摄像机位置一致
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                controls.target.set(newTarget.x, newTarget.y, newTarget.z);
                controls.target.set(25, 10, 25);
            })
            .start();
        
        // new TWEEN.Tween(newTarget)
        //     .to({
        //         x: 25,
        //         y: 5,
        //         z: 25
        //     }, 2000) // 过渡时间与摄像机位置一致
        //     .easing(TWEEN.Easing.Cubic.InOut)
        //     .onUpdate(() => {
        //         controls.target.set(25, 5, 25);
        //     })
        //     .start();
    } else {
        console.log("所有无人机的运动已完成。");
    }
}


// 示例函数，模拟更新 UAV 坐标
function updateUAVLocation(index, coordinates) {
    locationOfUAVs.value[index].value = coordinates;
}

// 动态更新文本精灵
function updateLabelText(label: THREE.Sprite, message: string) {
    const newSprite = createTextSprite(message, {
        fontSize: 32,
        fontFace: 'Arial',
        borderThickness: 10,
        borderColor: { r: 0, g: 0, b: 0, a: 0 },
        backgroundColor: { r: 255, g: 255, b: 255, a: 0 },
        textColor: { r: 0, g: 0, b: 0, a: 1.0 },
        scale: 1,
        resolutionScale: 4,
    });
    label.material.map = newSprite.material.map;
    label.material.needsUpdate = true;
    label.scale.copy(newSprite.scale); // 更新精灵的缩放比例
}




// 创建文本纹理的函数
function createTextSprite(message: string, parameters: any = {}): THREE.Sprite {
    const fontSize = parameters.fontSize || 32;
    const fontFace = parameters.fontFace || 'Arial';
    const borderThickness = parameters.borderThickness || 2;
    const borderColor = parameters.borderColor || { r: 0, g: 0, b: 0, a: 0 };
    const backgroundColor = parameters.backgroundColor || { r: 255, g: 255, b: 255, a: 0 };
    const textColor = parameters.textColor || { r: 0, g: 0, b: 0, a: 1.0 };
    const isBold = parameters.isBold !== undefined ? parameters.isBold : true;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('无法获取Canvas上下文');
    }

    // 设置字体
    context.font = `${isBold ? 'bold ' : ''}${fontSize}px ${fontFace}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 将文本按行分割（如果您的文本可能包含换行符）
    const lines = message.split('\n');

    // 计算每一行的最大宽度
    let maxLineWidth = 0;
    lines.forEach(line => {
        const metrics = context.measureText(line);
        if (metrics.width > maxLineWidth) {
            maxLineWidth = metrics.width;
        }
    });

    // 设置 Canvas 尺寸（通过缩放因子增加分辨率）
    const scaleFactor = parameters.resolutionScale || 4; // 增加以提高分辨率
    const lineHeight = fontSize * 1.2;
    canvas.width = (maxLineWidth + borderThickness * 2) * scaleFactor;
    canvas.height = (lines.length * lineHeight + borderThickness * 2) * scaleFactor;

    // 缩放上下文以提高分辨率
    context.scale(scaleFactor, scaleFactor);

    // 重置字体设置
    context.font = `${isBold ? 'bold ' : ''}${fontSize}px ${fontFace}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 添加阴影以增强可读性
    context.shadowColor = 'rgba(0,0,0,0.5)';
    context.shadowBlur = 4;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    // 绘制背景（如果需要）
    if (backgroundColor.a > 0) {
        context.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
        context.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
    }

    // 绘制边框（如果需要）
    if (borderThickness > 0 && borderColor.a > 0) {
        context.strokeStyle = `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`;
        context.lineWidth = borderThickness;
        context.strokeRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
    }

    // 绘制文本
    context.fillStyle = `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`;
    lines.forEach((line, index) => {
        const y = (index + 0.5) * lineHeight + borderThickness;
        context.fillText(line, (canvas.width / scaleFactor) / 2, y);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);

    // 调整精灵的大小以匹配文本尺寸
    const spriteScale = parameters.scale || 1;
    sprite.scale.set(
        (canvas.width / scaleFactor) * spriteScale / 100,
        (canvas.height / scaleFactor) * spriteScale / 100,
        1
    );

    return sprite;
}

// 加载爆炸模型
gltfLoader.load(
    "./models/Explosion/explosion.glb",
    (gltf: { scene: any }) => {
        explosionModel = gltf.scene;

        explosionModel.scale.set(0.17, 0.2, 0.17);

        console.log("Explosion model loaded");
    }
);



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



//放置车船人 & 目标
async function loadAllModels() {
    if (!isEvnDone) {
        // 如果请求尚未完成，则等待0.5秒
        await new Promise((resolve) => setTimeout(resolve, 500));
        await loadAllModels(); // 递归调用，直到 isEvnDone 为 true
    } else {
        const allObstacles: number[][] = group3_env.all_obstacles;
        const targets: number[][] = group3_env.targets;

        allObstacles.map(async (obstacle) => {
            const [x, y, type] = obstacle;
            let modelPath: string;
            let scale: number[];
            let position: [number, number, number] = [x, 0, y]; // 修改为元组类型

            if (type === 0) { // Car
                modelPath = "./models/Car/truck.glb";
                scale = [0.0005, 0.0005, 0.0005];
            } else if (type === 1) { // Ship
                modelPath = "./models/Ship/low-poly_warship.glb";
                scale = [0.05, 0.05, 0.05];
                position = [x, 0.1, y]; // 确保元组长度一致
            } else if (type === 2) { // People
                modelPath = "./models/People/three_soldier.glb";
                scale = [0.001, 0.001, 0.001];
            } else {
                return; // 未知类型，跳过
            }

            try {
                loadModel(modelPath, scale, position);
            } catch (error) {
                console.error(`Failed to load obstacle model: ${modelPath}`, error);
            }
        });

        // 如果基础目标模型尚未加载，则加载一次
        if (!baseTargetModel) {
            try {
                baseTargetModel = await new Promise<THREE.Object3D>((resolve, reject) => {
                    gltfLoader.load(
                        "./models/Target/balloon_target.glb",
                        (gltf: any) => {
                            const model = gltf.scene;
                            model.scale.set(0.05, 0.05, 0.05);

                            // 遍历模型的所有子对象，调整材质属性以添加自发光
                            model.traverse((child) => {
                                if (child instanceof THREE.Mesh) {
                                    child.frustumCulled = false;
                                    child.castShadow = true;
                                    child.material.emissive = child.material.color;
                                    child.material.emissiveMap = child.material.map;
                                }
                            });

                            resolve(model);
                        },
                        undefined,
                        (error) => reject(error)
                    );
                });
                console.log("balloon_target.glb 已加载并调整亮度");
            } catch (error) {
                console.error("加载 balloon_target.glb 失败", error);
                return;
            }
        }

        // 为每个目标位置克隆基础模型
        const targetPromises = targets.map(async (target) => {
            const [x, y] = target;
            const position: [number, number, number] = [x, 0, y]; // 修改为元组类型

            const targetModel = baseTargetModel.clone();
            targetModel.position.set(...position); // 现在 position 是一个元组，TypeScript 不会报错
            scene.add(targetModel);

            targetsModels.push({
                position: new THREE.Vector2(x, y),
                model: targetModel,
            });
        });

        // 等待所有目标模型加载完成
        await Promise.all(targetPromises);
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