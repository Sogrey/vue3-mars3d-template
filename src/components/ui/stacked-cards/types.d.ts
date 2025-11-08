/**
 * types.d.ts
 * 堆叠卡片组件类型定义文件
 * @author Sogrey
 * @date 2025-06-01 00:00:00
 * @lastModify 2025-11-08 00:00:00
 * @version 1.0.0
 * @see 参考百度地图 mapType-wrapper 功能
 */

// 全局类型声明 - 无需导入即可使用

/**
 * SwitchConfig 接口
 * 开关配置接口定义
 * @property {string} label - 开关标签文本
 * @property {boolean} value - 开关状态值
 */
declare interface SwitchConfig {
    label: string;
    value: boolean;
}

/**
 * CardItem 接口
 * 卡片项接口定义
 * @property {string} id - 卡片唯一标识
 * @property {string} name - 卡片显示名称
 * @property {string} image - 卡片背景图片路径
 * @property {string} [className] - 卡片样式类名（可选）
 * @property {SwitchConfig} [switchConfig] - 开关配置（可选）
 */
declare interface CardItem {
    id: string;
    name: string;
    image: string;
    className?: string;
    switchConfig?: SwitchConfig;
}
