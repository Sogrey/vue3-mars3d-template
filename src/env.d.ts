/// <reference types="vite/client" />
/// <reference types="./types/global.d.ts" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}

// 项目全局类型声明
declare global {
  // 应用版本信息
  const __APP_VERSION__: string
  const __BUILD_TIME__: string
}
