<template>
  <mars3d-map :mapOptions="mapConfig" />
  <div class="stacked-cards">
    <stacked-cards :cards="stackedCardsData" @card-click="handleCardClick" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Mars3dMapConfig from '@/configs/Mars3dMapConfig.json'


// 导入图片资源
import map1 from '@/assets/images/stacked-cards/map-1.png';
import map2 from '@/assets/images/stacked-cards/map-2.png';
import map3 from '@/assets/images/stacked-cards/map-3.png';
import map4 from '@/assets/images/stacked-cards/map-4.png';


const mapConfig = Mars3dMapConfig

const stackedCardsData = ref([
  {
    id: 'map',
    name: '地图',
    image: map1,
    className: 'normal',
    switchConfig: {
      label: '显示收藏点',
      value: true
    }
  },
  {
    id: 'satellite',
    name: '影像',
    image: map2,
    className: 'earth',
    switchConfig: {
      label: '开启路网',
      value: true
    }
  },
  {
    id: 'panorama',
    name: '全景',
    image: map3,
    className: 'satellite'
  },
  {
    id: 'earth',
    name: '地球',
    image: map4,
    className: 'panorama'
  }
])

onMounted(() => {
  console.log('onMounted')
})

onUnmounted(() => {
  console.log('onUnmounted')
})

const handleCardClick = (card: CardItem, index: number) => {
  console.log('handleCardClick', card, index)
}

</script>

<style lang="less" scoped>
.stacked-cards {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
