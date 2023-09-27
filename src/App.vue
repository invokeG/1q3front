<template>
  <div>
    <elementui></elementui>
    <button @click="topage('/')">threejs</button>
    <button @click="topage('/getenv')">GetEnv</button>
    <!-- <RouterLink to="/">threejs</RouterLink>
  <RouterLink to="/getenv">GetEnv</RouterLink> -->
    <RouterView></RouterView>
    <!-- <GetEnv></GetEnv> -->
  </div>
</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router';
const router = useRouter()
const topage = (url: string) => {
  router.push(url)
}

</script>

<style scoped></style>
