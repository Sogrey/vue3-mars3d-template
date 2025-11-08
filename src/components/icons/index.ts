import type { App } from 'vue'

import IconCommunity from '@/components/icons/IconCommunity.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import IconEcosystem from '@/components/icons/IconEcosystem.vue'
import IconSupport from '@/components/icons/IconSupport.vue'
import IconTooling from '@/components/icons/IconTooling.vue'

const components = [IconCommunity, IconDocumentation, IconEcosystem, IconSupport, IconTooling]

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
