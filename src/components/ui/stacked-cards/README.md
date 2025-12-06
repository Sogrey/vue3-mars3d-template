# Stacked Cards 堆叠卡片组件

一个仿百度地图地图类型切换器的Vue 3组件，支持堆叠展开/收起动画效果。

## ✨ 特性

- 🎯 **仿百度地图设计** - 经典的右下角堆叠卡片切换器，支持从左到右顺序排列
- 🎨 **流畅动画** - 同步的展开/收起过渡效果
- ⌨️ **键盘导航** - 完整的键盘操作支持
- 🎭 **可定制开关** - 每个卡片可配置独立的开关控件
- 📱 **响应式** - 适配不同屏幕分辨率
- ♿ **无障碍** - 完整的ARIA属性支持
- 🎪 **TypeScript** - 完整的类型定义

## 📦 安装

```bash
# 如果是从npm包安装
npm install vue-stacked-cards

# 如果是本地组件
# 复制组件文件到你的项目中
cp -r src/components/ui/stacked-cards /your-project/src/components/ui/
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <div class="map-container">
    <!-- 你的地图或其他内容 -->
    
    <!-- 堆叠卡片组件 -->
    <stacked-cards 
      :cards="cardData" 
      @card-click="handleCardClick" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StackedCards from '@/components/ui/stacked-cards/index.vue'

// 卡片数据
const cardData = ref([
  {
    id: 'map',
    name: '地图',
    image: '/images/map-normal.png',
    className: 'normal'
  },
  {
    id: 'satellite', 
    name: '影像',
    image: '/images/map-satellite.png',
    className: 'satellite'
  },
  {
    id: 'terrain',
    name: '地形',
    image: '/images/map-terrain.png',
    className: 'terrain'
  }
])

// 处理卡片点击
const handleCardClick = ({ card, index }) => {
  console.log('选中卡片:', card.name, '索引:', index)
  // 在这里处理地图切换逻辑
}
</script>

<style>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
```

### 带开关的卡片

```vue
<script setup>
const cardData = ref([
  {
    id: 'map',
    name: '地图',
    image: '/images/map-normal.png',
    className: 'normal',
    switchConfig: {
      name: '显示收藏点',
      status: true
    }
  },
  {
    id: 'satellite',
    name: '影像', 
    image: '/images/map-satellite.png',
    className: 'satellite',
    switchConfig: {
      name: '开启路网',
      status: false
    }
  }
])
</script>
```

## 📖 API 文档

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `cards` | `CardItem[]` | `[]` | 卡片数据数组 |

### CardItem 接口

```typescript
interface SwitchConfig {
  /** 开关标签文本 */
  name: string
  /** 开关状态值 */
  status: boolean
  /** 其他额外参数 */
  [key: string]: any
}

interface CardItem {
  /** 卡片唯一标识 */
  id: string | number
  /** 卡片名称 */
  name: string
  /** 卡片背景图片URL */
  image: string
  /** 自定义CSS类名 */
  className?: string
  /** 开关配置 */
  switchConfig?: SwitchConfig
  /** 其他额外参数 */
  [key: string]: any
}
```

### Events

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `card-click` | `{ card: CardItem, index: number }` | 卡片点击时触发 |

## 🎨 样式配置

### CSS 变量

组件使用Less预处理器，主要样式参数如下：

```less
// 卡片尺寸配置
$card-width: 86px;           // 卡片宽度
$card-height: 60px;          // 卡片高度
$card-spacing: 16px;         // 卡片间距
$horizontal-margin: 16px;     // 水平边距
$collapsed-width: 110px;     // 收起时容器宽度

// 动画时间
$expand-duration: 0.4s;      // 展开动画时长
$color-transition: 0.3s;     // 颜色过渡时长

// 颜色配置
$active-border: #3385ff;     // 激活状态边框色
$bg-overlay: rgba(0, 0, 0, 0.5); // 展开时背景色
```

### 自定义样式

```css
/* 修改组件位置 */
#stacked-cards-wrapper {
  bottom: 20px;  /* 距离底部距离 */
  right: 20px;   /* 距离右侧距离 */
}

/* 修改卡片样式 */
.stacked-card {
  border-radius: 8px;  /* 圆角大小 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  /* 阴影效果 */
}

/* 修改激活状态 */
.stacked-card.active {
  border-color: #ff6b6b;  /* 自定义激活边框色 */
}
```

## ⌨️ 键盘操作

| 按键 | 功能 |
|------|------|
| `Tab` | 切换卡片焦点 |
| `Enter` / `Space` | 选中当前焦点卡片 |
| `←` / `→` | 左右导航切换卡片 |
| `Esc` | 失去焦点 |

## 🎯 使用场景

- **地图应用** - 地图类型切换器
- **工具面板** - 快速工具选择
- **设置面板** - 功能开关控制
- **主题切换** - 界面主题选择
- **语言切换** - 多语言选择器

## 🔧 高级配置

### 响应式断点

```less
// 高分辨率屏幕适配
@media only screen and (-webkit-min-device-pixel-ratio: 2),
(-webkit-min-device-pixel-ratio: 2),
(min-resolution: 2dppx),
(min-resolution: 192dpi) {
  .stacked-card {
    background-size: contain;
  }
}
```

### 动画同步要点

为了确保动画完全同步，关键CSS配置：

```less
#stacked-cards {
  /* 背景容器过渡 */
  transition: width 0.4s ease-out, background-color 0.3s ease-out;
}

.stacked-card {
  /* 卡片过渡 - 关键：时间与背景同步 */
  transition: left 0.4s ease-out, z-index 0.4s, border-color 0.3s ease-out;
}
```

### 排列顺序说明

- **从左到右排列**：卡片按照传入数组的顺序从左到右显示
- **索引对应**：点击事件返回的 `index` 与视觉位置和数组索引一致
- **容器定位**：整体组件位于右下角，但内部卡片从左向右展开

## 🐛 故障排除

### 常见问题

1. **动画不同步**
   - 确保背景和卡片的过渡时间一致
   - 移除不必要的 `transition-delay`

2. **图片不显示**
   - 检查图片路径是否正确
   - 确保图片资源已正确引入

3. **定位问题**
   - 确保父容器有 `position: relative`
   - 检查 z-index 层级设置

4. **开关不工作**
   - 确保使用 `v-model` 绑定
   - 添加 `@click.stop` 防止事件冒泡

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/your-username/vue3-mars3d-template.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📄 许可证

MIT License

## 🙏 致谢

- 灵感来源于百度地图的地图类型切换器
- 使用 Vue 3 Composition API 开发
- 支持 TypeScript 完整类型检查

---

**版本历史**

- `v1.0.2` - 修复卡片排列顺序，改为从左到右按数据顺序排列
- `v1.0.1` - 修复动画时间同步问题，更新类型定义(label→name, value→status)
- `v1.0.0` - 初始版本发布