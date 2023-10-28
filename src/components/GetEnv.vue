<template>
    <div>
        <h1>{{ group3_env }}</h1>
    </div>
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue'
import axios from 'axios';

interface Env {
  all_obstacles:number[][]
  start_pos:number[]
  targets:number[][]
}

//将group3_env改为响应式，否则由于异步操作导致参数无法再次渲染
let group3_env = ref<Env>()
let isRequestDone = false

onMounted(async () => {
  await axios.get("http://192.168.31.216:8081/home/group3/getEnv")
    .then(function (response) {
      group3_env.value = response.data
    isRequestDone = true
    })
})

setTimeout(() => { 
    if(isRequestDone){
        console.log(group3_env.value.targets)
    }else{
        console.log("请稍等，数据还在加载中…")
    }
},1000)

</script>

<style scoped></style>