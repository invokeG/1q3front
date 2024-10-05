<template>
    <div style="width: 100vw; height: 100vh; position: relative;">
      <div style="display: flex;">
        <!-- 3D 渲染区 -->
        <div id="three" style="width: 50vw; height: 50vw; text-align: left; border: 1px solid #00ffff;text-align: left;"></div>
  
        <!-- 信息卡片区 -->
        <div style="flex: 1; display: flex; flex-direction: column;">
          <el-card class="box-card"  style="flex: 1; margin: 0; height: 100%; width: 100%;">
            <div class="card-header">
                <span class="header-text-small">已分配的目标点</span>
            </div>
            <div v-if="assignedTargets.length > 0">
              <div v-for="(target, index) in assignedTargets" :key="index" class="text-item-small">
                目标点 {{ index + 1 }}: ({{ target[0] }}, {{ target[1] }})
              </div>
            </div>
            <div v-else class="text-item-small">没有目标点分配</div>
          </el-card>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  body {
    font-family: 'Orbitron', sans-serif;
    background-color: #0d1b2a;
    color: #ffffff;
  }
  
  .box-card {
    border: 2px solid #00ffff;
    box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2);
    border-radius: 8px;
    background-color: #1b263b;
    transition: box-shadow 0.3s ease;
  }
  
  .box-card:hover {
    box-shadow: 0 8px 16px rgba(0, 255, 255, 0.4);
  }
  
  .card-header {
    background-color: #1b263b;
    padding: 10px;
    border-bottom: 2px solid #00ffff;
    border-radius: 8px 8px 0 0;
  }
  
  .header-text-small {
    font-size: 24px;
    font-weight: bold;
    color: #00ffff;
  }
  
  .text-item-small {
    font-size: 14px;
    color: #00ffff;
    padding: 10px;
  }
  
  .box-card .el-card__body {
    padding: 20px;
  }
  
  .box-card .el-card__footer {
    background-color: #1b263b;
    padding: 10px;
    border-top: 2px solid #00ffff;
    border-radius: 0 0 8px 8px;
  }
  </style>
  

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
    go_steps: number[][];
    back_steps: number[][];
    goals: number[][];
}

let group3_env: Env;
let group3_detection_steps: Step;
let isEvnDone: boolean = false;
let isStepDone: boolean = false;
let model_drone: THREE.Scene;
let posOfUAV: THREE.Mesh;
let sightOfUAV: THREE.Mesh;
let assignedTargets = ref<number[][]>([]);

// 存储箭头模型的数组
const arrowModels: { position: THREE.Vector3; model: THREE.Group }[] = [];

// 存储其他模型的数组
const otherModels: { position: THREE.Vector3; model: THREE.Group }[] = [];

// 创建场景
const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// 创建渲染器
let widthofelement: number = 700, heightofelement: number = 700;
const renderer = new THREE.WebGLRenderer();

// 辅助函数：创建带文本的精灵
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

// 保存当前精灵的引用
let currentSprite: THREE.Sprite | null = null;

// 辅助函数：更新精灵内容
function updateSprite(message: string) {
    if (currentSprite) {
        // 从无人机组中移除旧精灵
        droneGroup.remove(currentSprite);

        // 释放旧的纹理和材质
        if ((currentSprite.material as THREE.SpriteMaterial).map) {
            (currentSprite.material as THREE.SpriteMaterial).map.dispose();
        }
        (currentSprite.material as THREE.SpriteMaterial).dispose();

        currentSprite = null;
    }

    // 创建新的精灵
    currentSprite = createTextSprite(message, { fontSize: 64, fontColor: 'rgba(0, 0, 0, 1.0)', backgroundColor: 'rgba(255, 255, 255, 0)' });
    currentSprite.position.set(0, 6, 0); // 根据需要调整Y轴高度
    droneGroup.add(currentSprite);
}

// 初始化渲染器和加载数据
onMounted(() => {
    const threeElement = document.getElementById("three");
    if (!threeElement) {
        console.error("Three.js 容器元素未找到！");
        return;
    }
    widthofelement = threeElement.clientWidth;
    heightofelement = threeElement.clientHeight;
    renderer.setSize(widthofelement, heightofelement);
    threeElement.appendChild(renderer.domElement);
    console.log(`${threeElement.clientWidth} //// ${threeElement.clientHeight}`);

    // 获取战场环境数据
    // axios.get("http://101.43.140.164:7310/home/group3/getEnv")
        axios.get("http://localhost:8080/home/group3/getEnv")
        .then(function (response) {
            group3_env = response.data;
            isEvnDone = true;
            loadAllModels(); // 环境数据加载完成后加载所有模型
        })
        .catch(function (error) {
            console.log(error);
        });

    // 获取侦查路径和返航路径数据
    // axios.get("http://101.43.140.164:7310/home/group3/getDetection")
        axios.get("http://localhost:8080/home/group3/getDetection")
        .then(function (response) {
            group3_detection_steps = response.data;
            isStepDone = true;
            loadAllModels(); // 路径数据加载完成后加载所有模型
        })
        .catch(function (error) {
            console.log(error);
        });
})

// 添加世界坐标轴
const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建相机
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    80, // 视角
    widthofelement / heightofelement, // 宽高比
    0.1, // 近距离
    1000 // 远距离
);

// 设置相机位置
camera.position.set(25, 20, 25);

// 创建控制器
const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(100, 0, 100);

// 测试输出
setTimeout(() => {
    if (isEvnDone) {
        console.log("起始位置:", group3_env.start_pos);
    } else {
        console.log("请稍等，环境数据还在加载中…");
    }

    if (isStepDone) {
        console.log("侦查路径:", group3_detection_steps.go_steps);
        console.log("返航路径:", group3_detection_steps.back_steps);
    } else {
        console.log("请稍等，无人机路线数据还在加载中…");
    }
}, 500);

// 添加一个网格地面
const gridHelper: THREE.GridHelper = new THREE.GridHelper(50, 50, 0xcccccc, 0xcccccc);
gridHelper.position.set(25, 0, 25);
scene.add(gridHelper);

// 实例化加载器
const gltfLoader: GLTFLoader = new GLTFLoader();

// 加载UAV模型
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

        // 创建“任务分配中”精灵并添加到无人机上方
        updateSprite("任务分配中");

        // 等待5秒后更改精灵内容并开始移动
        setTimeout(() => {
            arrowModels.forEach((arrowObj) => {
                arrowObj.model.visible = true;
            });

            arrowModels.forEach((arrowObj) => {
                const x = arrowObj.position.x;
                const z = arrowObj.position.z;

                // 检查是否该坐标已经存在
                const exists = assignedTargets.value.some(
                    (target) => target[0] === x && target[1] === z
                );

                // 如果坐标不存在，则添加到 assignedTargets
                if (!exists) {
                    assignedTargets.value.push([x, z]);
                }
            });

            updateSprite("目标点已分配完毕");

            // 开始移动模型
            // moveModel();
        }, 3000); // 5000毫秒 = 5秒
    } else {
        // 如果条件不满足，等待一段时间后再次检查
        setTimeout(checkConditionsAndProceed, 100); // 每 100 毫秒检查一次
    }
}

gltfLoader.load(
    // UAV模型路径
    "./models/UAV/low-poly_uav.glb",
    (gltf: { scene: any }) => {
        console.log(gltf);
        model_drone = gltf.scene;
        model_drone.scale.set(0.5, 0.5, 0.5);
        console.log("UAV加载完成");
        // 创建投影面
        const circleGeometry: THREE.CircleGeometry = new THREE.CircleGeometry(0.1, 32);
        const circleMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        posOfUAV = new THREE.Mesh(circleGeometry, circleMaterial);

        // 添加一个矩形表示UAV可见区域
        const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(7, 7);
        const planeMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xccffff, side: THREE.DoubleSide });
        sightOfUAV = new THREE.Mesh(planeGeometry, planeMaterial);
        // scene.add(sightOfUAV); // 可选：如果想要可见区域的可视化

        model_drone.position.set(group3_env.start_pos[0], 1, group3_env.start_pos[1]);

        // 开始检查条件并执行后续操作
        checkConditionsAndProceed();
    }
);

// 加载其他模型（车船人 & 目标）
function loadModel(modelPath: string, scale: number[], position: number[]) {
    gltfLoader.load(
        modelPath,
        (gltf: any) => {
            const loadedModel = gltf.scene;
            loadedModel.scale.set(scale[0], scale[1], scale[2]);
            loadedModel.position.set(position[0], position[1], position[2]);
            loadedModel.traverse((child: any) => {
                if (child instanceof THREE.Mesh) {
                    child.frustumCulled = false;
                    // 模型阴影
                    child.castShadow = true;
                    // 模型自发光
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                }
            });
            loadedModel.visible = false; // 初始时隐藏
            scene.add(loadedModel);
            otherModels.push({ position: loadedModel.position.clone(), model: loadedModel });
        }
    );
}

// 加载箭头模型的函数
function loadArrowModel(modelPath: string, position: THREE.Vector3) {
    gltfLoader.load(
        modelPath,
        (gltf: any) => {
            const arrow = gltf.scene;
            arrow.position.copy(position);
            arrow.scale.set(5, 5, 5); // 根据需要调整缩放比例
            arrow.visible = false; // 确保箭头初始时可见
            scene.add(arrow);
            arrowModels.push({ position: arrow.position.clone(), model: arrow });
        },
        undefined,
        (error: any) => {
            console.error(`Failed to load arrow model from ${modelPath}:`, error);
        }
    );
}

// 加载所有模型
async function loadAllModels() {
    if (!isEvnDone || !isStepDone) {
        // 如果请求尚未完成，则等待0.5秒
        await new Promise((resolve) => setTimeout(resolve, 500));
        await loadAllModels(); // 递归调用，直到isEvnDone和isStepDone为true
    } else {
        const allObstacles: number[][] = group3_env.all_obstacles;
        const targets: number[][] = group3_env.targets;
        const goals: number[][] = group3_detection_steps.goals;

        // 加载障碍物模型
        allObstacles.forEach((obstacle: any[]) => {
            const x: number = obstacle[0];
            const y: number = obstacle[1];
            const type: number = obstacle[2];

            if (type === 0) { // Car
                let scale: number[] = [0.0005, 0.0005, 0.0005];
                let position: number[] = [x, 0, y];
                loadModel("./models/Car/truck.glb", scale, position);
            } else if (type === 1) { // Ship
                let scale: number[] = [0.05, 0.05, 0.05];
                let position: number[] = [x, 0.1, y];
                loadModel("./models/Ship/low-poly_warship.glb", scale, position);
            } else if (type === 2) { // People
                let scale: number[] = [0.001, 0.001, 0.001];
                let position: number[] = [x, 0, y];
                loadModel("./models/People/three_soldier.glb", scale, position);
            }
        });

        // 加载目标点模型
        targets.forEach((target: any[]) => {
            const x: number = target[0];
            const y: number = target[1];

            let scale: number[] = [0.05, 0.05, 0.05];
            let position: number[] = [x, 0, y];
            loadModel("./models/Target/balloon_target.glb", scale, position);
        });

        // 加载箭头模型
        goals.forEach((goal: any[]) => {
            const x: number = goal[0];
            const y: number = goal[1];

            const position = new THREE.Vector3(x, 0, y);
            loadArrowModel("./models/Arrow/map_pin.glb", position);
        });
    }
}

loadAllModels();


// 更新可见性函数
function updateVisibility() {
    const uavPosition = droneGroup.position;

    // 获取无人机的逆旋转四元数
    const inverseQuaternion = droneGroup.quaternion.clone().invert();

    // 定义可视区域参数
    const halfWidth = 3.5; // 宽度的一半
    const length = 7;      // 长度

    arrowModels.forEach((arrowObj) => {
        if (arrowObj.model.visible) { // 仅处理当前可见的箭头
            // 计算相对位置
            const relativePosition = arrowObj.position.clone().sub(uavPosition);

            // 将相对位置转换到无人机的本地坐标系
            relativePosition.applyQuaternion(inverseQuaternion);

            // 检查箭头是否在可视区域内
            if (relativePosition.z >= 0 && relativePosition.z <= length &&
                relativePosition.x >= -halfWidth && relativePosition.x <= halfWidth) {
                arrowObj.model.visible = false; // 隐藏箭头模型
            }
        }
    });

    // 显示可视区域内的其他模型
    otherModels.forEach((modelObj) => {
        if (!modelObj.model.visible) { // 仅处理当前不可见的模型
            const modelRelativePosition = modelObj.position.clone().sub(uavPosition);
            modelRelativePosition.applyQuaternion(inverseQuaternion);

            // 检查模型是否在可视区域内
            if (modelRelativePosition.z >= 0 && modelRelativePosition.z <= length &&
                modelRelativePosition.x >= -halfWidth && modelRelativePosition.x <= halfWidth) {
                modelObj.model.visible = true;
            }
        }
    });
}



// 半球光
const hemiLight: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 100, 0); // 灯光位置
scene.add(hemiLight);

// 添加环境光
const light: THREE.AmbientLight = new THREE.AmbientLight(0x404040); // 柔和的白光
scene.add(light);

// 平行光
const dirLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 40, 50); // 灯光位置
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
});

// 渲染函数
function animate() {
    if (model_drone) {
        controls.target = droneGroup.position;
    }

    controls.update();
    requestAnimationFrame(animate);
    TWEEN.update();
    updateVisibility(); // 更新可见性
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
