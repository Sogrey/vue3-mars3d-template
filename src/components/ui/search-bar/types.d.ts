
/**
 * 搜索栏组件类型定义文件
 * 定义搜索栏组件相关的全局类型声明
 * @author Sogrey
 * @date 2025-11-08 00:00:00
 * @lastModify 2025-11-08 00:00:00
 * @version 1.0.0
 */

// 全局类型声明 - 无需导入即可使用

/**
 * SearchResult
 * 搜索结果接口，包含搜索类型、搜索文本和时间戳
 * @property {string} type - 搜索类型：'fuzzy' 模糊查询 | 'coordinate' 坐标反查
 * @property {string} text - 搜索文本内容
 * @property {number} timestamp - 搜索时间戳
 * @example
 * const result: SearchResult = {
 *   type: 'fuzzy',
 *   text: '北京市',
 *   timestamp: Date.now()
 * }
 */
declare interface SearchResult {
    type: string;
    text: string;
    timestamp: number;
}