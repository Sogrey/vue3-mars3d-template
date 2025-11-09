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
 * 搜索结果接口，包含搜索类型、搜索文本、时间戳和地理位置信息
 * @property {string} [type] - 搜索类型：'fuzzy' 模糊查询 | 'coordinate' 坐标反查, 检索时不为空，检索结果中为空
 * @property {string} text - 搜索文本内容
 * @property {number} [timestamp] - 搜索时间戳
 * @property {string} [address] - 地址信息
 * @property {Object} [location] - 地理位置信息
 * @property {number} location.lng - 经度坐标
 * @property {number} location.lat - 纬度坐标
 * @example
 * const result: SearchResult = {
 *   type: 'fuzzy',
 *   text: '北京市',
 *   timestamp: Date.now(),
 *   location: {
 *     lng: 116.3974,
 *     lat: 39.9093
 *   }
 * }
 */
declare interface SearchResult {
  type?: string
  text: string
  timestamp?: number,
  address?: string,
  location?: {
    lng: number,
    lat: number
  }
}
