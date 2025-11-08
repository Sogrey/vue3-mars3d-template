/**
 * stacked-cards 组件类型定义
 * 堆叠卡片展开组件，仿照百度地图右下角地图类型切换功能
 * @author Sogrey
 * @date 2025-11-08
 * @version 1.0.0
 */

import type { CardItem } from './types'

/**
 * stacked-cards 组件属性接口
 * 定义堆叠卡片组件的属性类型
 */
export interface StackedCardsProps {
    /**
     * 卡片数据数组
     */
    cards?: CardItem[]
    /**
     * 卡片点击事件处理函数
     */
    'onCard-click'?: (card: CardItem, index: number) => void
}