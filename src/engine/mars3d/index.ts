/**
 * Mars3D 引擎核心实现文件
 * Mars3D 地图引擎的单例封装和初始化管理
 * @author Sogrey
 * @date 2025-11-08
 * @lastModify 2025-11-08
 * @version 1.0.0
 */
import * as mars3d from 'mars3d'

import Camera from './modules/camera.ts'
import Layer from './modules/layer.ts'
import Scene from './modules/scene.ts'
import Terrain from './modules/terrain.ts'
import Effect from './modules/effect.ts'
import Event from './modules/event.ts'
import Measurement from './modules/measurement.ts'
import Model from './modules/model.ts'

import * as Utils from './utils.ts'

/**
 * Mars3D 引擎单例类
 * 提供 Mars3D 地图引擎的单例封装和初始化管理功能，确保全局唯一实例
 * @see https://mars3d.cn/
 */
export default class MarsEnging {
  private static instance: MarsEnging | null = null

  // 模块
  Camera: Camera = new Camera(this)
  Layer: Layer = new Layer(this)
  Scene: Scene = new Scene(this)
  Terrain: Terrain = new Terrain(this)
  Effect: Effect = new Effect(this)
  Event: Event = new Event(this)
  Measurement: Measurement = new Measurement(this)
  Model: Model = new Model(this)

  private _map: mars3d.Map | null = null

  private constructor() {
    // 私有构造函数防止外部实例化
  }

  /**
   * 获取单例实例
   * 获取全局唯一的 Mars3D 引擎实例，确保整个应用中只有一个 Mars3D 实例
   * @return {MarsEnging} 返回 Mars3D 引擎单例实例
   * @example
   * ```typescript
   * // 获取 Mars3D 引擎实例
   * const marsEngine = MarsEnging.getInstance();
   *
   * // 在 Vue 组件中使用
   * const marsEngine = MarsEnging.getInstance();
   * marsEngine.init('mapContainer', { scene: { center: { lat: 39.9, lng: 116.3 } } });
   * ```
   */
  static getInstance(): MarsEnging {
    if (!MarsEnging.instance) {
      MarsEnging.instance = new MarsEnging()
    }
    return MarsEnging.instance
  }

  /**
   * 重置单例实例（用于测试或特殊场景）
   * @test
   */
  static resetInstance(): void {
    MarsEnging.instance = null
  }

  /**
   * 获取地图实例的getter函数
   * 拦截地图实例的访问，提供安全检查和错误处理
   * @return {mars3d.Map | null} 返回当前的地图实例，如果未初始化则返回null
   * @example
   * ```typescript
   * // 获取地图实例进行地图操作
   * const marsEngine = MarsEnging.getInstance();
   * const map = marsEngine.map;
   *
   * if (map) {
   *   // 在地图上添加图层
   *   map.addLayer(new mars3d.layer.GeoJsonLayer({
   *     name: "测试图层",
   *     url: "data/test.geojson"
   *   }));
   * } else {
   *   console.warn("地图尚未初始化，请先调用init方法");
   * }
   *
   * // Vue组件中使用
   * const handleMapClick = () => {
   *   if (marsEngine.map) {
   *     marsEngine.map.flyTo({ lat: 39.9, lng: 116.3, alt: 10000 });
   *   }
   * };
   * ```
   */
  get map(): mars3d.Map | null {
    if (!this._map) {
      console.warn('Mars3D地图尚未初始化，请先调用init方法')
      return null
    }
    return this._map
  }

  /**
   * 初始化地图
   * 初始化 Mars3D 地图实例，配置地图容器和各项参数
   * @param {string} eleId - 地图容器元素的ID或已构造好的Viewer对象
   * @param {MarsMapOptions} options - 可选配置参数对象
   * @param {mars3d.Map.sceneOptions} options.scene - 可选场景参数
   * @param {mars3d.Map.terrainOptions} options.terrain - 可选地形服务配置
   * @param {mars3d.Map.basemapOptions[]} options.basemaps - 可选底图图层配置
   * @param {mars3d.Map.layerOptions[]} options.layers - 可选叠加显示的图层配置
   * @param {mars3d.Map.controlOptions} options.control - 可选添加的控件
   * @param {mars3d.Map.effectOptions} options.effect - 可选添加的特效
   * @param {mars3d.Map.thingOptions} options.thing - 可选添加的Thing对象(如分析、管理类等)
   * @param {mars3d.Map.mouseOptions} options.mouse - 可选鼠标操作相关配置参数
   * @param {mars3d.Map.methodOptions} options.method - 可选通过参数方式直接调用Map的属性/方法
   * @example
   * ```typescript
   * // 基本用法
   * marsEngine.init('mapContainer');
   *
   * // 配置场景和图层
   * marsEngine.init('mapContainer', {
   *   scene: {
   *     center: { lat: 39.9, lng: 116.3, alt: 1000, heading: 0, pitch: -45 }
   *   },
   *   terrain: {
   *     url: 'http://data.mars3d.cn/terrain',
   *     show: true
   *   },
   *   basemaps: [
   *     { name: '天地图影像', type: 'tdt', layer: 'img' }
   *   ]
   * });
   *
   * // Vue 组件中使用
   * onMounted(() => {
   *   const marsEngine = MarsEnging.getInstance();
   *   marsEngine.init('mars3d-container', {
   *     scene: { center: { lat: 31.23, lng: 121.47, alt: 10000 } }
   *   });
   * });
   * ```
   */
  init(eleId: string, options?: MarsMapOptions) {
    this._map = new mars3d.Map(eleId, options)

    console.log(this._map)
    console.log(Utils.uuid('Sogrey'))
  }

  /**
   * destroy
   * 销毁 Mars3D 地图实例，释放资源并清理内存
   * 安全地销毁地图实例，防止内存泄漏和资源占用
   * @example
   * ```typescript
   * // 销毁地图实例
   * const marsEngine = MarsEnging.getInstance();
   * marsEngine.destroy();
   * 
   * // Vue 组件中使用
   * onUnmounted(() => {
   *   const marsEngine = MarsEnging.getInstance();
   *   marsEngine.destroy();
   * });
   * ```
   */
  destroy() {
    if (this._map) {
      this._map.destroy()
      this._map = null
    }
  }

  /**
   * isInit
   * 检查 Mars3D 地图是否已初始化
   * 返回布尔值表示地图实例是否存在，用于状态检查
   * @return {boolean} 返回地图是否已初始化的布尔值
   * @example
   * ```typescript
   * // 检查地图初始化状态
   * const marsEngine = MarsEnging.getInstance();
   * if (marsEngine.isInit()) {
   *   console.log("地图已初始化");
   * } else {
   *   console.log("地图未初始化");
   * }
   * 
   * // Vue 组件中使用
   * const handleMapAction = () => {
   *   if (marsEngine.isInit()) {
   *     // 执行地图操作
   *     marsEngine.map?.flyTo({ lat: 39.9, lng: 116.3 });
   *   }
   * };
   * ```
   */
  isInit() {
    return this._map !== null
  }
}
