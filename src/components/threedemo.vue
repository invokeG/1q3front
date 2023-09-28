<template>
    <div id="three" style="width: 700px; height: 700px;"></div>
</template>
  
<script lang="ts" setup>

import * as THREE from 'three'
import { onMounted, watch } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

let group3_env
let isRequestDone = false
//创建场景
const scene = new THREE.Scene()

let widthofelement: number = 700, heightofelement: number = 700

//创建渲染器
const renderer = new THREE.WebGLRenderer()
onMounted(() => {
    widthofelement = document.getElementById("three").clientWidth
    heightofelement = document.getElementById("three").clientWidth
    renderer.setSize(widthofelement, heightofelement)
    document.getElementById("three").appendChild(renderer.domElement)
    console.log(document.getElementById("three").clientWidth + "////" + document.getElementById("three").clientHeight)
})

//创建相机
const camera = new THREE.PerspectiveCamera(
    45, //视角
    widthofelement / heightofelement, //宽高比
    0.1, //近距离
    1000 //远距离
)

setTimeout(() => {
    if (isRequestDone) {
        console.log(group3_env)
    } else {
        console.log("请稍等，数据还在加载中…")
    }
}, 500)

//创建物体
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(geometry, material)
//添加父元素
const parentCube = new THREE.Mesh(geometry, parentMaterial)

parentCube.position.set(-3, 1, 1)
cube.position.set(3, 0, 0)
cube.scale.set(0.5, 0.5, 0.5)
parentCube.add(cube)
// cube.position.x = 2
scene.add(parentCube)

//添加世界坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//相机位置，z轴为朝向自己的方向，y轴为垂直方向
camera.position.z = 10
camera.position.y = 2
camera.position.x = 2

const controls = new OrbitControls(camera, renderer.domElement);

watch(() => group3_env, () => { console.log(group3_env) }) // 这里可以打印出group3_env，因为watch会监听group3_env的变化 })

//渲染函数
function animate() {
    controls.update()
    //调用animate
    requestAnimationFrame(animate) //异步函数
    //旋转
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    //渲染
    renderer.render(scene, camera)
}

animate()

// //创建按钮，点击事件
// const fullbtn = document.createElement("button")
// fullbtn.innerHTML = "点击全屏"
// fullbtn.style.position = "absolute"
// fullbtn.style.top = "10px"
// fullbtn.style.right = "10px"

// fullbtn.onclick = () => {
//     renderer.domElement.requestFullscreen()
//     console.log("全屏")   
// }
// document.body.appendChild(fullbtn)

const eventObj = {
    Fullscreen: () => {
        renderer.domElement.requestFullscreen()
    },
    Exitscreen: () => {
        document.exitFullscreen()
    }
}

const gui = new GUI()
gui.add(eventObj, "Fullscreen").name("全屏")
gui.add(eventObj, "Exitscreen").name("退出全屏")

const folder = gui.addFolder("小立方体")
folder.add(cube.position, "x", -10, 10).name("立方体x轴位置").onChange((val) => {
    console.log(val);
})
folder.add(material, "wireframe").name("线框模式")

//颜色
let colorParam = {
    cubecolor: "#00ff00"
}

folder.addColor(colorParam, "cubecolor").name("更改颜色").onChange((val) => {
    cube.material.color.set(val)
})

</script>
  
<style></style>