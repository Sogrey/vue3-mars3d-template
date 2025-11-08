<template>
  <mars3d-map :mapOptions="mapConfig" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Mars3dMapConfig from '../configs/Mars3dMapConfig.json'

const mapConfig = Mars3dMapConfig

onMounted(() => {
  console.log('onMounted')
})

onUnmounted(() => {
  console.log('onUnmounted')
})
</script>

<style lang="less" scoped></style>
