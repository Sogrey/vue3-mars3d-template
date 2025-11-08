# Vue3 + Mars3D 项目模板

一个基于 Vue 3 + Vite + Mars3D 的现代化 3D 地图应用开发模板。

## 🚀 技术栈

- **前端框架**: Vue 3.5.22 + TypeScript
- **构建工具**: Vite 7.1.11
- **3D 地图**: Mars3D 3.10.8 + Cesium 1.135.0
- **状态管理**: Pinia 3.0.3
- **路由管理**: Vue Router 4.6.3
- **地理工具**: Turf.js 7.2.0

## 📋 项目特性

- ✅ Vue 3 Composition API + TypeScript
- ✅ Mars3D 3D 地图引擎集成
- ✅ 热重载开发体验
- ✅ 代码质量保证 (ESLint + Prettier)
- ✅ 生产环境优化构建
- ✅ 现代化开发工具链

## 🛠️ 开发环境要求

- Node.js: ^20.19.0 || >=22.12.0
- 包管理器: pnpm (推荐)

## 📦 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

## 🎯 NPM 脚本说明

### 开发模式

- **`npm run dev`** - 启动开发服务器（支持热重载）
- **`npm run dev:host`** - 主机模式启动开发服务器
- **`npm run dev:port`** - 指定端口 3000 启动开发服务器

### 生产构建

- **`npm run build`** - 构建生产环境版本
- **`npm run build:prod`** - 指定生产模式构建
- **`npm run build:analyze`** - 构建并分析打包文件大小

### 测试环境

- **`npm run build:test`** - 构建测试环境版本

### 预览测试

- **`npm run preview`** - 预览生产构建结果
- **`npm run preview:prod`** - 预览生产模式构建结果

### 代码质量

- **`npm run type-check`** - TypeScript 类型检查（已修复 eslint\_\_js 类型定义问题）
- **`npm run lint`** - ESLint 代码检查和自动修复
- **`npm run format`** - Prettier 代码格式化

### 清理构建

- **`npm run clean`** - 清理 dist 构建目录（已修复 rimraf 依赖问题）

## 🏗️ 项目结构

```
src/
├── components/          # 组件目录
│   └── mars3d/         # Mars3D 相关组件
├── engine/             # 引擎层
│   └── mars3d/         # Mars3D 引擎封装
├── configs/            # 配置文件
│   └── Mars3dMapConfig.json  # 地图配置
├── views/              # 页面视图
├── main.ts             # 应用入口
└── types.d.ts          # 类型定义
```

## 🎮 快速开始

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run type-check
npm run lint
```

## 🔧 开发工具配置

### IDE 推荐配置

- [VS Code](https://code.visualstudio.com/) + [Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 禁用 Vetur 插件

### 浏览器开发工具

- Chromium 浏览器: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 📚 相关资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Mars3D 官方文档](http://mars3d.cn/)
- [Vite 配置参考](https://vite.dev/config/)
- [TypeScript 配置](https://www.typescriptlang.org/)

## 🔄 更新日志

### 最新更新 (2025-11-08)

- ✅ **TypeScript 全局类型系统优化**
  - 实现了 Mars3D 地图配置类型的全局声明
  - 新增 `.types.ts` 文件支持全局类型，解决了 `.d.ts` 文件中无法使用 `import` 语句的限制
  - 支持 `MarsMapOptions` 类型在项目中全局可用
- ✅ **组件文档完善**
  - 为 Mars3D 地图组件添加了完整的 JSDoc 注释
  - 遵循项目注释规范，包含文件头、类、函数等详细文档
- ✅ 修复了 TypeScript 类型检查中的 `eslint__js` 类型定义错误
- ✅ 修复了 `npm run clean` 脚本中的 `rimraf` 依赖问题
- ✅ 优化了 TypeScript 配置文件，使用单文件配置替代项目引用模式
- ✅ 更新了 ESLint 配置，移除了不必要的类型注解

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个模板。

## 📄 许可证

MIT License
