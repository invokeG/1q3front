<template>
    <div id="three" style="width: 700px; height: 700px;"></div>
</template>
  
<script lang="ts" setup>

import * as THREE from 'three'
import { onMounted, watch } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import axios from 'axios';

let group3_env
let isRequestDone = false
//创建场景
const scene = new THREE.Scene()

let widthofelement: number = 700, heightofelement: number = 700

//创建渲染器
const renderer = new THREE.WebGLRenderer()
onMounted(async () => {
    widthofelement = document.getElementById("three").clientWidth
    heightofelement = document.getElementById("three").clientWidth
    renderer.setSize(widthofelement, heightofelement)
    document.getElementById("three").appendChild(renderer.domElement)
    console.log(document.getElementById("three").clientWidth + "////" + document.getElementById("three").clientHeight)
    await axios.get("http://localhost:8080/home/group3/getEnv")
        .then(function (response) {
            group3_env = response.data
            isRequestDone = true       
        })
})

//创建相机
const camera = new THREE.PerspectiveCamera(
    45, //视角
    widthofelement / heightofelement, //宽高比
    0.1, //近距离
    1000 //远距离
)

setTimeout(() => { 
    if(isRequestDone){
        console.log(group3_env)
    }else{
        console.log("请稍等，数据还在加载中…")
    }
},500)

//创建物体
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

//添加世界坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//相机位置，z轴为朝向自己的方向，y轴为垂直方向
camera.position.z = 10
camera.position.y = 2
camera.position.x = 2

const controls = new OrbitControls(camera, renderer.domElement);

watch(() => group3_env, () => { console.log(group3_env)}) // 这里可以打印出group3_env，因为watch会监听group3_env的变化 })

//渲染函数
function animate() {
    controls.update()
    //调用animate
    requestAnimationFrame(animate)
    //旋转
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    //渲染
    renderer.render(scene, camera)
}

animate()
</script>
  
<style></style>