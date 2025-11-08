/**
 * search-bar 组件类型定义
 * 搜索栏组件，提供地图搜索功能
 * @author Sogrey
 * @date 2025-11-08
 * @version 1.0.0
 */

import type { SearchResult } from './types'

/**
 * search-bar 组件属性接口
 * 定义搜索栏组件的属性类型
 */
export interface SearchBarProps {
    /**
     * 搜索事件处理函数
     * @param result - 搜索结果信息
     */
    'onSearch'?: (result: SearchResult) => void
}