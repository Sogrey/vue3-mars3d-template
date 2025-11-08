import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { mars3dPlugin } from "vite-plugin-mars3d"
import bundleAnalyzer from 'vite-bundle-analyzer'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const isDev = mode === 'development'

  return {
    // 基础路径 - 生产环境可能需要配置为 /your-project-name/
    base: isProduction ? './' : '/',

    plugins: [
      vue(),
      // 开发环境才启用 Vue DevTools
      ...(isDev ? [vueDevTools()] : []),
      mars3dPlugin(),
      // 自动导入组件
      Components({
        // 组件目录 - 添加所有可能的组件目录
        dirs: ['src/components', 'src/components/ui', 'src/components/mars3d'],
        // 深度扫描子目录
        deep: true,
        // 生成类型声明文件
        dts: 'src/types/global.d.ts',
        // 禁用目录命名空间以避免重复定义
        directoryAsNamespace: false,
        // 版本检测
        version: 3,
        // 自动发现组件，无需手动配置解析器
        resolvers: [],
        // 类型声明配置
        types: [
          {
            from: 'vue',
            names: ['DefineComponent']
          }
        ]
      }),
      // 生产环境启用 bundle 分析
      ...(isProduction ? [
        bundleAnalyzer({
          analyzerMode: 'static',
          openAnalyzer: true
        })
      ] : [])
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },

    // 资源文件包含配置 - 明确指定要包含的文件类型
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico', '**/*.webp'],

    // 开发服务器配置
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      // 热更新配置
      hmr: {
        overlay: true
      }
    },

    // 构建配置
    build: {
      // 生产环境移除 console 和 debugger
      minify: isProduction ? 'terser' : 'esbuild',

      // 代码分割配置
      rollupOptions: {
        // 排除 src 目录下的 .md 文件不参与打包
        external: (id) => {
          // 排除 src 目录下的 .md 文件
          if (id.includes('/src/') && id.endsWith('.md')) {
            return true
          }
          return false
        },
        output: {
          // 代码分割策略
          manualChunks: {
            // 将 mars3d 相关库单独打包
            mars3d: ['mars3d', 'mars3d-cesium'],
            // 将第三方库单独打包
            vendor: ['vue', 'vue-router', 'pinia'],
            // 将 UI 组件库单独打包
            ui: ['@turf/turf']
          },
          // 入口文件命名
          entryFileNames: 'assets/[name]-[hash].js',
          // 静态资源命名
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },

      // 压缩配置
      terserOptions: {
        compress: {
          drop_console: isProduction, // 生产环境移除 console
          drop_debugger: isProduction  // 生产环境移除 debugger
        }
      },

      // 构建输出目录
      outDir: 'dist',

      // 资源文件大小限制（开发环境不限制）
      assetsInlineLimit: isProduction ? 4096 : 0,

      // 生成 sourcemap
      sourcemap: isDev ? 'inline' : false,

      // 打包文件大小警告限制
      chunkSizeWarningLimit: 1000
    },

    // 预览配置
    preview: {
      port: 4173,
      host: true
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/assets/variables.less";`,
          javascriptEnabled: true
        }
      }
    },

    // 环境变量定义
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString())
    }
  }
})
