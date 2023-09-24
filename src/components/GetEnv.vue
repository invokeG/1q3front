<template>
    <div>
        <h1>{{ group3_env }}</h1>
    </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue'
import axios from 'axios'

interface Env {
    all_obstacles: number[][]
    start_pos: number[]
    targets: number[][]
}

let group3_env: Env

onMounted(() => {
    axios.get("http://localhost:8080/home/group3/getEnv")
        .then(function (response) {
            group3_env = response.data
            console.log(group3_env.all_obstacles)
        })
})

</script>

<style scoped>

</style>