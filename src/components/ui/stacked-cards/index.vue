<!--
 * index.vue
 * 堆叠卡片组件主文件
 * @author Sogrey
 * @date 2025-06-01 00:00:00
 * @lastModify 2025-12-06 00:00:00
 * @version 1.0.2
 * @see 参考百度地图 mapType-wrapper 功能
-->

<template>
  <div id="stacked-cards-wrapper" :class="{ expand: isExpanded }" role="toolbar"
    :aria-label="`地图类型切换器，当前选中：${cardList[activeCardIndex]?.name || '无'}`" @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false">
    <div id="stacked-cards"
      :style="{ width: isExpanded ? expandStyles.backgroundWidth + 'px' : CARD_CONFIG.collapsedWidth + 'px' }"
      :aria-expanded="isExpanded">
      <div v-for="(card, index) in cardList" :key="card.id" class="stacked-card"
        :class="[card.className, { active: activeCardIndex === index }]" role="button"
        :aria-pressed="activeCardIndex === index" :aria-label="card.name" :title="card.name" tabindex="0"         :style="{
          backgroundImage: `url(${card.image})`,
          left: isExpanded ? ((expandStyles.positions[index] || 0) + CARD_CONFIG.horizontalMargin) + 'px' : '20px',
          zIndex: isExpanded ? 0 : (activeCardIndex === index ? 10 : 0),
        }" @keydown.enter="handleCardClick(card, index)" @keydown.space.prevent="handleCardClick(card, index)"
        @keydown.left.prevent="handleKeyboardNavigation(-1)" @keydown.right.prevent="handleKeyboardNavigation(1)"
        @click="handleCardClick(card, index)">
        <div v-if="card.switchConfig" class="switch-box">
          <label :title="card.switchConfig.name">
            <input v-model="card.switchConfig.status" type="checkbox" class="switch" @click.stop />
            <p>{{ card.switchConfig.name }}</p>
          </label>
        </div>
        <span>{{ card.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue'

/**
 * 开关配置接口定义
 */
interface SwitchConfig {
  /** 开关标签文本 */
  name: string
  /** 开关状态值 */
  status: boolean
  /** 其他额外参数 */
  [key: string]: any
}

/**
 * 卡片项目接口定义
 */
interface CardItem {
  /** 卡片唯一标识 */
  id: string | number
  /** 卡片名称 */
  name: string
  /** 卡片背景图片URL */
  image: string
  /** 自定义CSS类名 */
  className?: string
  /** 开关配置 */
  switchConfig?: SwitchConfig
  /** 其他额外参数 */
  [key: string]: any
}

/**
 * stacked-cards 组件
 * 堆叠卡片展开组件，仿照百度地图右下角地图类型切换功能
 * @example
 * <stacked-cards :cards="stackedCardsData" @card-click="handleCardClick" />
 * @see 参考百度地图 mapType-wrapper 功能
 */
export default defineComponent({
  name: 'stacked-cards',
  props: {
    /**
     * 卡片数据数组
     * @type {CardItem[]}
     */
    cards: {
      type: Array as PropType<CardItem[]>,
      default: () => [],
    },
  },
  emits: ['card-click'],
  setup(props, { emit }) {

    const isExpanded = ref(false)
    const activeCardIndex = ref(0)

    /**
     * 使用传入的卡片数据，避免响应式问题
     * 直接使用computed计算，无需额外的ref和watch
     */
    const cardList = computed(() => [...props.cards])

    // 组件常量配置
    const CARD_CONFIG = {
      width: 86,
      spacing: 16,
      horizontalMargin: 16,
      collapsedWidth: 110,
      height: 60
    } as const

    /**
     * 计算卡片展开时的样式
     * @returns {Object} 包含背景宽度和卡片位置的对象
     */
    const expandStyles = computed(() => {
      const cards = cardList.value
      const cardCount = cards.length

      // 空数组保护：立即返回默认值
      if (cardCount === 0) return { backgroundWidth: CARD_CONFIG.collapsedWidth, positions: [] }

      // 边界检查：确保索引在有效范围内
      if (activeCardIndex.value >= cardCount) {
        activeCardIndex.value = Math.max(0, cardCount - 1)
      }

      const { width: cardWidth, spacing: cardSpacing, horizontalMargin } = CARD_CONFIG

      // 计算总宽度：左右边距 + 卡片总数 × 卡片宽度 + (卡片总数-1) × 卡片间距
      const totalWidth = horizontalMargin * 2 + cardCount * cardWidth + (cardCount - 1) * cardSpacing

      // 计算每个卡片的位置（从左到右，按照数据顺序排列）
      // 位置是相对于背景内容区域的
      const positions = []
      for (let i = 0; i < cardCount; i++) {
        // 第一个卡片（索引0）在最左边，后续卡片向右展开
        // 计算从左到右的位置：索引 × (卡片宽度+间距)
        const position = i * (cardWidth + cardSpacing)
        positions.push(position)
      }

      return {
        backgroundWidth: totalWidth,
        positions: positions
      }
    })

    /**
     * handleCardClick
     * 处理卡片点击事件
     * @param {CardItem} card - 被点击的卡片数据
     * @param {number} index - 卡片索引
     */
    const handleCardClick = (card: CardItem, index: number) => {
      activeCardIndex.value = index
      emit('card-click', card, index)
    }

    /**
     * handleKeyboardNavigation
     * 处理键盘导航
     * @param {number} direction - 导航方向：-1 向左，1 向右
     */
    const handleKeyboardNavigation = (direction: number) => {
      const cardCount = cardList.value.length
      if (cardCount === 0) return

      const newIndex = activeCardIndex.value + direction
      activeCardIndex.value = (newIndex + cardCount) % cardCount

      // 触发选中事件
      const selectedCard = cardList.value[activeCardIndex.value]
      if (selectedCard) {
        emit('card-click', { card: selectedCard, index: activeCardIndex.value })
      }
    }

    return {
      isExpanded,
      activeCardIndex,
      cardList,
      expandStyles,
      CARD_CONFIG,
      handleCardClick,
      handleKeyboardNavigation,
    }
  },
})
</script>

<style lang="less" scoped>
#stacked-cards-wrapper {
  position: absolute;
  bottom: 32px;
  right: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}

#stacked-cards {
  height: 80px;
  cursor: pointer;
  transition: width 0.4s ease-out, background-color 0.3s ease-out;
  width: v-bind('CARD_CONFIG.collapsedWidth + "px"');
  background-color: rgba(0, 0, 0, 0);
  position: relative;
}

.expand #stacked-cards {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  position: relative;
  padding: 16px;
  box-sizing: border-box;
}

.expand .stacked-card {
  border: 1px solid rgba(255, 255, 255, 0);
  overflow: hidden;
  position: absolute !important;
}

.expand .stacked-card.active {
  border: 3px solid #3385ff;
}



.stacked-card {
  height: v-bind('CARD_CONFIG.height + "px"');
  width: v-bind('CARD_CONFIG.width + "px"');
  position: absolute;
  border-radius: 5px;
  top: 10px;
  box-sizing: border-box;
  border: 1px solid rgba(153, 153, 153, 0.42);
  background-size: cover;
  background-position: center;
  transition: left 0.4s ease-out, z-index 0.4s, border-color 0.3s ease-out;
  overflow: hidden;

  span {
    position: absolute;
    bottom: 0;
    right: 0;
    display: inline-block;
    padding: 3px 3px 2px 4px;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    color: #fff;
    border-top-left-radius: 2px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &.active span,
  &:hover span {
    background-color: #3385ff;
  }

  &:hover {
    border: 3px solid #3385ff;
  }

  .switch-box p {
    margin: 0;
  }

  .switch-box input.switch {
    margin: 0;
  }

  &:hover .switch-box {
    visibility: visible;
  }
}

// 收起状态下的卡片位置
// 当前选中的卡片在收起时放在最上面
#stacked-cards-wrapper:not(.expand) .stacked-card {
  left: 20px;
}

.switch-box {
  visibility: hidden;
  position: absolute;
  width: 100%;
  height: 20px;
  line-height: 20px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  label {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 8px;
    cursor: pointer;
    margin-left: 5px;
  }

  p {
    display: inline;
    margin: 0;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60px;
  }

  input.switch {
    margin: 0;
    cursor: pointer;
    width: 12px;
    height: 12px;
  }
}

// 响应式适配
@media only screen and (-webkit-min-device-pixel-ratio: 2),
(-webkit-min-device-pixel-ratio: 2),
(min-resolution: 2dppx),
(min-resolution: 192dpi) {
  .stacked-card {
    background-size: contain;
  }
}
</style>
