<template>
  <div>
    <button @click="$router.push('/display')">display</button>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts" setup>

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
