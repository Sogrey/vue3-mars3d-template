import type { App } from 'vue'

import Mars3dMap from './index.vue'

const components = [Mars3dMap]

/**
 * 图标组件全局注册函数
 * 将图标组件注册为 Vue 全局组件，便于在模板中直接使用
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
