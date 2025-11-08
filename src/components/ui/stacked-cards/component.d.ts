/**
 * stacked-cards 组件类型定义
 * 堆叠卡片展开组件，仿照百度地图右下角地图类型切换功能
 * @author Sogrey
 * @date 2025-11-08
 * @version 1.0.0
 */

declare module '@/components/ui/stacked-cards/index.vue' {
    import type { DefineComponent } from 'vue'
    import type { CardItem } from './types'

    /**
     * stacked-cards 组件
     * 堆叠卡片展开组件，仿照百度地图右下角地图类型切换功能
     * @example
     * ``` html
     * <stacked-cards :cards="stackedCardsData" @card-click="handleCardClick" />
     * ```
     * ``` typescript
     * const stackedCardsData = ref([
     *  {
     *      id: 'map',
     *      name: '地图',
     *      image: 'map1.png',
     *      className: 'normal',
     *      switchConfig: {
     *          label: '显示收藏点',
     *          value: true
     *      }
     *  }
     * ])
     * 
     * const handleCardClick = (card: CardItem, index: number) => {
     *   console.log('卡片被点击:', card, index)
     * }
     * ```
     * @see 参考百度地图 mapType-wrapper 功能
     */
    const StackedCards: DefineComponent<{
        /**
         * 卡片数据数组
         * @type {CardItem[]}
         */
        cards?: CardItem[]
    }, {
        /**
         * 卡片点击事件
         * @param {CardItem} card - 被点击的卡片数据
         * @param {number} index - 卡片索引
         */
        'card-click': (card: CardItem, index: number) => void
    }>

    export default StackedCards
}