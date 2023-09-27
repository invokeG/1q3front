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

let group3_env = ref<Env>()
let isRequestDone = false

onMounted(async () => {
  await axios.get("http://localhost:8080/home/group3/getEnv")
    .then(function (response) {
      group3_env.value = response.data
    isRequestDone = true
    })
})

setTimeout(() => { 
    if(isRequestDone){
        console.log(group3_env)
    }else{
        console.log("请稍等，数据还在加载中…")
    }
},1000)

</script>

<style scoped></style>