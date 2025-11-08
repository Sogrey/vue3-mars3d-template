/**
 * Mars3D 引擎相关类型定义和接口声明
 * 使用 .type.ts 文件扩展名，允许使用 import 语句
 * @author Sogrey
 * @date 2025-11-08
 * @lastModify 2025-11-08
 * @version 1.0.0
 */

// ## 核心机制解析

// ### 1. **使用 `.type.ts` 文件扩展名**
// ```typescript
// // 关键：使用 .type.ts 而不是 .d.ts
// // 这允许在文件中使用 import 语句
// import * as mars3d from 'mars3d'
// ```

// ### 2. **`declare global` 声明全局作用域**
// ```typescript
// declare global {
//     interface MarsMapOptions {
//         // 接口定义
//     }
// }
// ```

// **作用机制：**
// - `declare global` 告诉 TypeScript 编译器：这些声明要在全局作用域中生效
// - 在 `declare global` 块内定义的接口和类型会自动成为全局可用的
// - 无需在任何地方导入，项目中任何文件都可以直接使用 `MarsMapOptions`

// ### 3. **模块化与全局化的结合**
// ```typescript
// // 全局声明
// declare global {
//     interface MarsMapOptions { /* ... */ }
// }

// // 导出类型供模块化使用
// export type { MarsMapOptions }
// ```

// **双重使用方式：**
// ```typescript
// // 方式1：全局使用（无需导入）
// const options: MarsMapOptions = { /* ... */ }

// // 方式2：模块化导入使用
// import type { MarsMapOptions } from '@/engine/mars3d/mars3d.types'
// ```

// ### 4. **TypeScript 编译器配置支持**
// `tsconfig.app.json` 中已经包含了 `.ts` 文件的处理：
// ```json
// {
//   "include": ["env.d.ts", "src/**/*", "src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
// }
// ```

// ## 技术原理详解

// ### **为什么 .d.ts 文件不能实现？**
// - `.d.ts` 文件是纯声明文件，不支持 `import` 语句
// - 一旦 `.d.ts` 文件中出现 `import`，该文件就变成模块作用域，无法全局声明

// ### **为什么 .type.ts 文件可以？**
// 1. **文件扩展名**：`.type.ts` 被视为普通 TypeScript 文件
// 2. **模块检测**：有 `import/export` 语句，文件被视为模块
// 3. **全局声明**：`declare global` 允许在模块内声明全局类型
// 4. **类型导出**：同时支持导出供其他模块导入使用

// ### **编译过程**
// ```typescript
// // 编译前：源文件
// declare global {
//     interface MarsMapOptions { /* ... */ }
// }

// // 编译后：全局类型声明
// interface MarsMapOptions { /* ... */ }
// ```

// ## 验证方法

// 你可以创建测试文件验证全局类型是否可用：
// ```typescript
// // test.ts - 不需要任何导入语句
// const testOptions: MarsMapOptions = {
//     scene: { center: { lng: 116.46, lat: 39.92, alt: 0 } }
// }
// ```

// ## 优势总结

// 1. **类型具体性**：直接引用 mars3d 库的具体类型，避免重新定义
// 2. **全局可用**：无需导入，项目中任何地方都可使用
// 3. **模块化兼容**：同时支持导入使用，保持代码组织灵活性
// 4. **类型安全**：利用 mars3d 官方类型定义，确保类型准确性

// 这种方案完美解决了 `.d.ts` 文件的限制，实现了类型的具体性和全局可用性的统一。

import * as mars3d from 'mars3d'

// 全局声明 Mars3D 相关类型，使其在整个项目中可用
declare global {
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
    interface MarsMapOptions {
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
}

// 导出类型供直接导入使用
export type { MarsMapOptions }

// 确保这是一个模块（有 import/export 语句）
export { }