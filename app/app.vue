<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import MainWindow from './core/window/MainWindow';

onMounted(() => {
  MainWindow.init();
})
</script>