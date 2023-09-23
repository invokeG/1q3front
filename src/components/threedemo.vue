<template>
    <div id="three" style="width: 600px; height: 600px;"></div>
</template>
  
<script lang="ts" setup>

import * as THREE from 'three';
import { onMounted } from 'vue';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 600 / 600, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
onMounted(()=>{
    renderer.setSize(document.getElementById("three").clientWidth, document.getElementById("three").clientWidth );
    document.getElementById("three").appendChild(renderer.domElement);
    console.log(document.getElementById("three").clientWidth +"////"+ document.getElementById("three").clientHeight)
})

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
</script>
  
<style>

</style>