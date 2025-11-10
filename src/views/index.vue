<!-- 
* 主页面组件 
* Vue 3 + Mars3D 地图应用主页面，集成地图组件、搜索栏和堆叠卡片组件 
* @author Sogrey 
* @date 2025-11-08 
* @lastModify 2025-11-08 
* @version 1.0.0 
* @see https://mars3d.cn 
-->
<template>
  <mars3d-scene :mapOptions="mapConfig" />
  <div class="content">
    <search-bar @search="handleSearch" @selectResult="handleSelectSearchResult" />
    <div class="stacked-cards">
      <stacked-cards :cards="stackedCardsData" @card-click="handleCardClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MarsEnging from '@/engine/mars3d/index'
import Mars3dConfig from '@/configs/mars3d-config.json'
import Mars3dMapConfig from '@/configs/Mars3dMapConfig.json'

// 导入图片资源
import map1 from '@/assets/images/stacked-cards/map-1.png'
import map2 from '@/assets/images/stacked-cards/map-2.png'
import map3 from '@/assets/images/stacked-cards/map-3.png'
import map4 from '@/assets/images/stacked-cards/map-4.png'

/**
 * 地图配置
 * Mars3D 地图初始化配置参数
 * @type {MarsMapOptions}
 */
const mapConfig = Mars3dConfig as MarsMapOptions

/**
 * 堆叠卡片数据
 * 存储堆叠卡片组件的地图类型配置数据
 * @type {Ref<CardItem[]>}
 */
const stackedCardsData = ref([
  {
    id: 'map',
    name: '地图',
    image: map1,
    className: 'normal',
    switchConfig: {
      label: '显示收藏点',
      value: true,
    },
  },
  {
    id: 'satellite',
    name: '影像',
    image: map2,
    className: 'earth',
    switchConfig: {
      label: '开启路网',
      value: true,
    },
  },
  {
    id: 'panorama',
    name: '全景',
    image: map3,
    className: 'satellite',
  },
  {
    id: 'earth',
    name: '地球',
    image: map4,
    className: 'panorama',
  },
])

/**
 * 组件挂载钩子
 * 在组件挂载到DOM后执行初始化操作
 */
onMounted(() => {
  console.log('onMounted')
})

/**
 * 组件卸载钩子
 * 在组件从DOM移除前执行清理操作
 */
onUnmounted(() => {
  console.log('onUnmounted')
})

/**
 * handleCardClick
 * 处理卡片点击事件
 * @param {CardItem} card - 被点击的卡片数据
 * @param {number} index - 卡片索引
 */
const handleCardClick = (card: CardItem, index: number) => {
  console.log('handleCardClick', card, index)

  // MarsEnging.getInstance().Layer.addLayer()
}

/**
 * handleSearch
 * 处理搜索事件
 * @param {SearchResult} search - 搜索结果数据
 */
const handleSearch = (search: SearchResult) => {
  console.log('handleSearch', search)
}

/**
 * handleSelectSearchResult
 * 处理搜索结果选择事件
 * @param {SearchResult} result - 选择的搜索结果对象
 * @returns {void}
 * @example
 * handleSelectSearchResult({
 *   type: 'fuzzy',
 *   text: '北京市',
 *   timestamp: Date.now(),
 *   location: {
 *     lng: 116.3974,
 *     lat: 39.9093
 *   }
 * })
 */
const handleSelectSearchResult = (result: SearchResult) => {
  console.log('handleSelectSearchResult', result)
}
</script>

<style lang="less" scoped>
.content {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;

  * {
    pointer-events: auto;
  }

  .stacked-cards {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
