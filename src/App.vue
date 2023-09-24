<template>
  <div>
  <!-- <elementui></elementui> -->
  <button @click="topage('/')">threejs</button>
  <button @click="topage('/getenv')">GetEnv</button>
  <!-- <RouterLink to="/">threejs</RouterLink>
  <RouterLink to="/getenv">GetEnv</RouterLink> -->
  <RouterView></RouterView>
  </div>
  <!-- <div style="float: right">
  <threedemo></threedemo>
  </div> -->
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
// import elementui from "./components/Elementui.vue"
// import threedemo from "./components/Threedemo.vue"
const router = useRouter()
const topage = (url:string)=>{
  router.push(url)
}

</script>

<style scoped>

</style>
