import * as mars3d from 'mars3d'
import * as Cesium from 'mars3d-cesium'
import { Tween, Easing } from '@tweenjs/tween.js'

import MarsEnging from '../index'

/**
 * 视角信息接口
 */
export interface CameraViewOptions {
  /** 经度 */
  lng: number
  /** 纬度 */
  lat: number
  /** 高度 */
  alt: number
  /** 航向角（度） */
  heading?: number
  /** 俯仰角（度） */
  pitch?: number
  /** 翻滚角（度） */
  roll?: number
}

/**
 * 漫游路径点配置
 */
export interface RoamingPoint extends CameraViewOptions {
  /** 到达此点耗时（秒） */
  duration?: number
  /** 到达此点后停留时间（秒） */
  stop?: number
  /** 缓动函数 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  easingFunction?: any
}

/**
 * 漫游配置参数
 */
export interface RoamingOptions {
  /** 漫游路径点列表 */
  points: RoamingPoint[]
  /** 漫游速度（km/h），默认为 60 */
  speed?: number
  /** 是否循环播放 */
  loop?: boolean
  /** 是否开启飞行动画 */
  flyTo?: boolean
  /** 飞行动画参数 */
  flyToOptions?: {
    duration?: number
    maximumHeight?: number
    offset?: Cesium.Cartesian3
    orientation?: {
      heading: number
      pitch: number
      roll?: number
    }
  }
  /** 实时回调函数 */
  onUpdate?: (state: RoamingState) => void
  /** 漫游完成回调 */
  onComplete?: () => void
}

/**
 * 漫游实时状态
 */
export interface RoamingState {
  /** 当前相机位置 */
  position: CameraViewOptions
  /** 相机方向 */
  direction: {
    heading: number
    pitch: number
    roll: number
  }
  /** 总漫游时长（毫秒） */
  totalDuration: number
  /** 已漫游时长（毫秒） */
  elapsedTime: number
  /** 当前路径点索引 */
  currentPointIndex: number
}

/**
 * Camera 模块类
 * 提供相机视角的获取、设置和漫游功能
 */
export default class Camera {
  private engine: MarsEnging

  private _tweens: Tween<Record<string, unknown>>[] = []

  private _isRoaming = false

  private _isPaused = false

  private _roamingOptions: RoamingOptions | null = null

  private _totalDuration = 0

  private _elapsedTime = 0

  private _preUpdateHandler: ((event: unknown) => void) | null = null

  private _oldShouldAnimate: boolean | undefined

  private _oldStartTime: Cesium.JulianDate | undefined

  private _oldCurrentTime: Cesium.JulianDate | undefined

  private _oldClockRange: Cesium.ClockRange | undefined

  private _roamingStartTime_: number | undefined

  constructor(engine: MarsEnging) {
    this.engine = engine
  }

  /**
   * 获取地图实例
   */
  private get map(): mars3d.Map | null {
    return this.engine.map
  }

  /**
   * 获取当前相机视角信息
   * @returns 包含位置和方向信息的对象
   */
  getView(): CameraViewOptions | null {
    const map = this.map
    if (!map) return null

    const camera = map.scene.camera
    const position = camera.positionCartographic

    const heading = Cesium.Math.toDegrees(camera.heading)
    const pitch = Cesium.Math.toDegrees(camera.pitch)
    const roll = Cesium.Math.toDegrees(camera.roll)

    return {
      lng: Cesium.Math.toDegrees(position.longitude),
      lat: Cesium.Math.toDegrees(position.latitude),
      alt: position.height,
      heading,
      pitch,
      roll
    }
  }

  /**
   * 设置相机视角
   * @param options 视角配置参数
   */
  setView(options: Partial<CameraViewOptions> & { flyTo?: boolean; flyToOptions?: RoamingOptions['flyToOptions'] }): void {
    const map = this.map
    if (!map) return

    const camera = map.scene.camera

    const dest = Cesium.Cartesian3.fromDegrees(options.lng ?? 0, options.lat ?? 0, options.alt ?? 0)

    if (options.flyTo) {
      camera.flyTo({
        destination: dest,
        orientation: {
          heading: Cesium.Math.toRadians(options.heading ?? 0),
          pitch: Cesium.Math.toRadians(options.pitch ?? -90),
          roll: Cesium.Math.toRadians(options.roll ?? 0)
        },
        ...options.flyToOptions
      })
    } else {
      camera.setView({
        destination: dest,
        orientation: {
          heading: Cesium.Math.toRadians(options.heading ?? 0),
          pitch: Cesium.Math.toRadians(options.pitch ?? -90),
          roll: Cesium.Math.toRadians(options.roll ?? 0)
        }
      })
    }
  }

  /**
   * 初始化视角漫游
   * @param options 漫游配置参数
   */
  initRoaming(options: RoamingOptions): void {
    this._roamingOptions = options
    this._isRoaming = false
    this._isPaused = false
  }

  /**
   * 开启视角漫游
   */
  startRoaming(): void {
    const map = this.map
    if (!map || !this._roamingOptions) return

    // 如果已经在漫游中，先停止
    if (this._isRoaming) {
      this.stopRoaming()
    }

    // 取消当前飞行
    map.scene.camera.cancelFlight()

    const views = this._roamingOptions.points
    if (views.length < 2) {
      console.warn('漫游路径点至少需要2个')
      return
    }

    // 保存时钟状态
    this._oldShouldAnimate = map.clock.shouldAnimate
    this._oldStartTime = map.clock.startTime.clone()
    this._oldCurrentTime = map.clock.currentTime.clone()
    this._oldClockRange = map.clock.clockRange

    // 设置时钟
    const currentTime = map.clock.currentTime.clone()
    map.clock.startTime = currentTime
    map.clock.clockRange = Cesium.ClockRange.UNBOUNDED
    map.clock.shouldAnimate = true

    // 创建 Tweens
    this._tweens = this._createTweens(views)

    if (this._tweens.length === 0) return

    // 计算总时长
    this._totalDuration = this._calculateTotalDuration(views)
    this._roamingStartTime_ = Cesium.JulianDate.toDate(currentTime).getTime()
    this._elapsedTime = 0
    this._isRoaming = true
    this._isPaused = false

    // 禁用相机输入
    map.scene.screenSpaceCameraController.enableInputs = false

    // 启动第一个 tween，使用 Cesium 时间作为时间基准（与 tween.update 保持一致）
    const firstTween = this._tweens[0]
    if (firstTween) {
      const nowTimestamp = Cesium.JulianDate.toDate(map.clock.currentTime).getTime()
      firstTween.start(nowTimestamp)
    }

    // 绑定更新事件
    this._preUpdateHandler = this._onPreUpdate.bind(this)
    map.on(mars3d.EventType.preUpdate, this._preUpdateHandler)
  }

  /**
   * 暂停漫游
   */
  pauseRoaming(): void {
    const map = this.map
    if (!map || !this._isRoaming || this._isPaused) return

    map.clock.shouldAnimate = false
    this._isPaused = true
  }

  /**
   * 继续漫游
   */
  resumeRoaming(): void {
    const map = this.map
    if (!map || !this._isRoaming || !this._isPaused) return

    map.clock.shouldAnimate = true
    this._isPaused = false
  }

  /**
   * 停止漫游
   * 停止后释放内存占用，移除监听，停止后不能暂停/继续，只能重新开始
   */
  stopRoaming(): void {
    const map = this.map
    if (!map) return

    // 先设置停止标志，防止在清理过程中触发回调
    this._isRoaming = false
    this._isPaused = false

    // 移除更新事件
    if (this._preUpdateHandler) {
      map.off(mars3d.EventType.preUpdate, this._preUpdateHandler)
      this._preUpdateHandler = null
    }

    // 停止所有 tween
    if (this._tweens.length > 0) {
      for (const tween of this._tweens) {
        tween.stop()
      }
      this._tweens = []
    }

    // 恢复时钟状态
    this._restoreClockState()
  }

  /**
   * 获取漫游状态
   */
  getRoamingState(): { isRoaming: boolean; isPaused: boolean } {
    return {
      isRoaming: this._isRoaming,
      isPaused: this._isPaused
    }
  }

  /**
   * 创建 Tweens 数组
   */
  private _createTweens(views: RoamingPoint[]): Tween<Record<string, unknown>>[] {
    const m = views.length - 1
    const tweens: Tween<Record<string, unknown>>[] = []

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    for (let i = 0; i < m; i++) {
      const i0 = i - 1 < 0 ? 0 : i - 1
      const i1 = i
      const i2 = i + 1 > m ? m : i + 1
      const i3 = i + 2 > m ? m : i + 2

      const startObject = {
        lng: views[i0]?.lng ?? 0,
        lat: views[i0]?.lat ?? 0,
        alt: views[i0]?.alt ?? 0,
        heading: views[i0]?.heading ?? 0,
        pitch: views[i0]?.pitch ?? -90
      }

      const stopObject: Record<string, unknown> = {
        lng: [views[i1]?.lng ?? 0, views[i2]?.lng ?? 0, views[i3]?.lng ?? 0],
        lat: [views[i1]?.lat ?? 0, views[i2]?.lat ?? 0, views[i3]?.lat ?? 0],
        alt: [views[i1]?.alt ?? 0, views[i2]?.alt ?? 0, views[i3]?.alt ?? 0],
        heading: [views[i1]?.heading ?? 0, views[i2]?.heading ?? 0, views[i3]?.heading ?? 0],
        pitch: [views[i1]?.pitch ?? -90, views[i2]?.pitch ?? -90, views[i3]?.pitch ?? -90]
      }

      const duration = (views[i1]?.duration ?? 3) * 1000
      const delay = (views[i1]?.stop ?? 0) * 1000
      const easingFunction = views[i1]?.easingFunction ?? Easing.Linear.None

      const tween = new Tween(startObject)
        .to(stopObject, duration)
        .delay(delay)
        .easing(easingFunction)
        .interpolation(this._catmullRomInterpolation.bind(this))
        .onUpdate(function (this: Record<string, unknown>) {
          // 漫游已停止时直接返回，防止 stopRoaming 后继续执行回调
          if (!that._isRoaming) return

          if (!that.map?.clock.shouldAnimate) return

          // 从 this 获取当前值
          const lng = (this.lng ?? startObject.lng) as number
          const lat = (this.lat ?? startObject.lat) as number
          const alt = (this.alt ?? startObject.alt) as number
          const heading = (this.heading ?? startObject.heading) as number
          const pitch = (this.pitch ?? startObject.pitch) as number
          
          that._updateCamera({
            lng,
            lat,
            alt,
            heading,
            pitch
          })

          // 计算已漫游时长
          if (that._roamingStartTime_ && that.map) {
            that._elapsedTime = Cesium.JulianDate.toDate(that.map.clock.currentTime).getTime() - that._roamingStartTime_
          }

          // 触发实时回调
          if (that._roamingOptions?.onUpdate) {
            const state = that._getRoamingState(i)
            that._roamingOptions.onUpdate(state)
          }
        })
        .onComplete(() => {
          // 漫游已停止时直接返回
          if (!that._isRoaming) return

          if (i === m - 1) {
            that._onRoamingComplete()
          }
        })

      tweens.push(tween)
    }

    // 不使用链式连接，在 onComplete 中手动处理
    for (let i = 0; i < tweens.length; i++) {
      const tween = tweens[i]
      if (!tween) continue

      // 每个 tween 完成后自动启动下一个
      if (i < tweens.length - 1) {
        const nextTween = tweens[i + 1]
        if (nextTween) {
          tween.onComplete(() => {
            // 漫游已停止时直接返回
            if (!that._isRoaming) return

            console.log('[Roaming] tween', i, 'completed, starting next')
            // 使用当前 Cesium 时间启动下一个 tween
            const map = that.map
            if (map) {
              const nowTimestamp = Cesium.JulianDate.toDate(map.clock.currentTime).getTime()
              nextTween.start(nowTimestamp)
            }
          })
        }
      }
    }

    return tweens
  }

  /**
   * Catmull-Rom 插值函数
   */
  private _catmullRomInterpolation(v: number | number[], t: number, alpha = 0.5): number {
    let p0: number, p1: number, p2: number, p3: number

    if (Array.isArray(v)) {
      if (v.length < 3) {
        return v[0] ?? 0
      }
      p0 = v[0] ?? 0
      p1 = v[1] ?? 0
      p2 = v[2] ?? 0
      p3 = v[3] ?? v[2] ?? 0
    } else {
      return v
    }

    let dt0 = Math.pow(Math.abs(p0 - p1), alpha)
    let dt1 = Math.pow(Math.abs(p1 - p2), alpha)
    let dt2 = Math.pow(Math.abs(p2 - p3), alpha)

    // 先处理 dt1，再处理 dt0 和 dt2（因为 dt0 可能依赖 dt1）
    if (dt1 < 1e-4) dt1 = 1.0
    if (dt0 < 1e-4) dt0 = dt1
    if (dt2 < 1e-4) dt2 = dt1
    
    // 防止 NaN
    if (!isFinite(dt0)) dt0 = 1.0
    if (!isFinite(dt1)) dt1 = 1.0
    if (!isFinite(dt2)) dt2 = 1.0

    let t0 = (p1 - p0) / dt0 - (p2 - p0) / (dt0 + dt1) + (p2 - p1) / dt1
    let t1_calc = (p2 - p1) / dt1 - (p3 - p1) / (dt1 + dt2) + (p3 - p2) / dt2

    t0 *= dt1
    t1_calc *= dt1

    const x0 = p1
    const x1 = p2
    const a0 = x0
    const a1 = t0
    const a2 = -3 * x0 + 3 * x1 - 2 * t0 - t1_calc
    const a3 = 2 * x0 - 2 * x1 + t0 + t1_calc

    const tt = t * t
    const ttt = tt * t

    return a0 + a1 * t + a2 * tt + a3 * ttt
  }

  /**
   * 更新相机位置
   */
  private _updateCamera(view: CameraViewOptions): void {
    const map = this.map
    if (!map) return

    const position = Cesium.Cartesian3.fromDegrees(view.lng, view.lat, view.alt)

    map.scene.camera.setView({
      destination: position,
      orientation: {
        heading: Cesium.Math.toRadians(view.heading ?? 0),
        pitch: Cesium.Math.toRadians(view.pitch ?? -90),
        roll: Cesium.Math.toRadians(view.roll ?? 0)
      }
    })
  }

  /**
   * 获取漫游状态
   */
  private _getRoamingState(currentIndex: number): RoamingState {
    const position = this.getView()
    const direction = {
      heading: position?.heading ?? 0,
      pitch: position?.pitch ?? -90,
      roll: position?.roll ?? 0
    }

    return {
      position: {
        lng: position?.lng ?? 0,
        lat: position?.lat ?? 0,
        alt: position?.alt ?? 0,
        heading: direction.heading,
        pitch: direction.pitch,
        roll: direction.roll
      },
      direction,
      totalDuration: this._totalDuration,
      elapsedTime: this._elapsedTime,
      currentPointIndex: currentIndex
    }
  }

  /**
   * 计算总时长
   */
  private _calculateTotalDuration(views: RoamingPoint[]): number {
    let total = 0
    for (let i = 0; i < views.length - 1; i++) {
      total += (views[i]?.duration ?? 3) * 1000
      total += (views[i]?.stop ?? 0) * 1000
    }
    return total
  }

  /**
   * 漫游完成处理
   */
  private _onRoamingComplete(): void {
    const map = this.map
    if (!map) return

    // 移除预更新监听
    if (this._preUpdateHandler) {
      map.off(mars3d.EventType.preUpdate, this._preUpdateHandler)
      this._preUpdateHandler = null
    }

    // 检查是否需要循环
    const shouldLoop = this._roamingOptions?.loop ?? false

    // 如果需要循环，重新开始漫游
    if (shouldLoop) {
      // 恢复相机输入
      map.scene.screenSpaceCameraController.enableInputs = true

      // 恢复时钟状态
      this._restoreClockState()

      // 重新开始漫游
      this.startRoaming()
      return
    }

    // 恢复相机输入
    map.scene.screenSpaceCameraController.enableInputs = true

    // 恢复时钟状态
    this._restoreClockState()

    // 触发完成回调
    if (this._roamingOptions?.onComplete) {
      this._roamingOptions.onComplete()
    }

    // 清空 tween 数组
    this._tweens = []

    // 重置状态
    this._isRoaming = false
    this._isPaused = false
  }

  /**
   * 恢复时钟状态
   */
  private _restoreClockState(): void {
    const map = this.map
    if (!map) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const camera = map.scene.camera as any
    if (!Cesium.defined(camera._currentFlight)) {
      map.scene.screenSpaceCameraController.enableInputs = true
    }

    if (Cesium.defined(this._oldShouldAnimate)) {
      map.clock.shouldAnimate = this._oldShouldAnimate
    }

    if (Cesium.defined(this._oldStartTime)) {
      map.clock.startTime = this._oldStartTime
    }

    if (Cesium.defined(this._oldCurrentTime)) {
      map.clock.currentTime = this._oldCurrentTime
    }

    if (Cesium.defined(this._oldClockRange)) {
      map.clock.clockRange = this._oldClockRange
    }
  }

  /**
   * 预更新事件处理
   */
  private _onPreUpdate(): void {
    const map = this.map
    if (!map) return

    // 漫游已停止时直接返回
    if (!this._isRoaming || this._tweens.length === 0) {
      return
    }

    // 漫游被暂停时
    if (!map.clock.shouldAnimate) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const camera = map.scene.camera as any

    // 当调用了 camera.flyTo 时，停止漫游
    if (camera._currentFlight) {
      this.stopRoaming()
      return
    }

    // 更新 Tween - tween.js 25.x 移除了全局列表，需要手动更新每个 tween
    const now = Cesium.JulianDate.toDate(map.clock.currentTime).getTime()
    
    // 手动更新每个活动的 tween
    for (const tween of this._tweens) {
      // @ts-ignore
      if (tween._isPlaying) {
        tween.update(now)
      }
    }
  }
}
