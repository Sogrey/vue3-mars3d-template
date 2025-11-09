import type { App } from 'vue'

import StackedCards from './stacked-cards/index.vue'
import SearchBar from './search-bar/index.vue'

const components = [StackedCards, SearchBar]

/**
 * UI组件全局注册函数
 * 将UI组件注册为 Vue 全局组件，便于在模板中直接使用
 * @param {App} app - Vue 应用实例
 * @return {App} 返回 Vue 应用实例，支持链式调用
 */
export default function (app: App): App {
  components.forEach((comp) => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
  })
  return app
}
