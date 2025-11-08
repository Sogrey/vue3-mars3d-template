/**
 * Mars3D 引擎相关类型定义和接口声明
 * @author Sogrey
 * @date 2025-11-08
 * @lastModify 2025-11-08
 * @version 1.0.0
 */
import * as mars3d from 'mars3d'

/**
 * Mars3D 地图初始化选项接口
 * 定义 Mars3D 地图初始化时的各种可选配置参数
 * @interface MarsMapOptions
 * @property {mars3d.Map.sceneOptions} [scene] - 可选场景参数
 * @property {mars3d.Map.terrainOptions} [terrain] - 可选地形服务配置
 * @property {mars3d.Map.basemapOptions[]} [basemaps] - 可选底图图层配置
 * @property {mars3d.Map.layerOptions[]} [layers] - 可选可以叠加显示的图层配置
 * @property {mars3d.Map.controlOptions} [control] - 可选添加的控件
 * @property {mars3d.Map.effectOptions} [effect] - 可选添加的特效
 * @property {mars3d.Map.thingOptions} [thing] - 可选添加的Thing对象(如分析、管理类等)
 * @property {mars3d.Map.mouseOptions} [mouse] - 可选鼠标操作相关配置参数
 * @property {mars3d.Map.methodOptions} [method] - 可选通过参数方式来构造地图后就直接执行调用Map的相关属性、方法，便于序列化
 */
export interface MarsMapOptions {
  /**
   * 可选场景参数
   */
  scene?: mars3d.Map.sceneOptions

  /**
   * 可选地形服务配置
   */
  terrain?: mars3d.Map.terrainOptions

  /**
   * 可选底图图层配置
   */
  basemaps?: mars3d.Map.basemapOptions[]

  /**
   * 可选可以叠加显示的图层配置
   */
  layers?: mars3d.Map.layerOptions[]

  /**
   * 可选添加的控件
   */
  control?: mars3d.Map.controlOptions

  /**
   * 可选添加的特效
   */
  effect?: mars3d.Map.effectOptions

  /**
   * 可选添加的Thing对象(如分析、管理类等)
   */
  thing?: mars3d.Map.thingOptions

  /**
   * 可选鼠标操作相关配置参数
   */
  mouse?: mars3d.Map.mouseOptions

  /**
   * 可选通过参数方式来构造地图后就直接执行调用Map的相关属性、方法，便于序列化
   */
  method?: mars3d.Map.methodOptions
}
