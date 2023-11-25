<template>
  <div>
    <elementui></elementui>
    <button @click="router.push('/display')">threejs</button>
    <button @click="router.push('/getenv')">GetEnv</button>
    <button @click="router.push('/')">Welcome</button>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { useDark, useToggle } from '@vueuse/core';

useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})

useDark({
  onChanged(dark) { useToggle(dark) }
})



</script>

<style scoped></style>
