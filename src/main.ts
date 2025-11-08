import '@/assets/css/main.css'

import 'mars3d-cesium/Build/Cesium/Widgets/widgets.css'
import 'mars3d/mars3d.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

import IconInstall from '@/components/icons'
import UIInstall from '@/components/ui'
import Mars3DInstall from '@/components/mars3d'

const app = createApp(App)

// Icon组件
IconInstall(app)
// UI组件
UIInstall(app)
// Mars3D组件
Mars3DInstall(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
