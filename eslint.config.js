import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslintParser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'

export default [
  {
    name: 'ignores',
    ignores: ['dist/**', 'node_modules/**']
  },
  
  // 全局配置
  {
    name: 'global',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  
  // JavaScript文件配置
  {
    name: 'javascript',
    files: ['**/*.js', '**/*.jsx'],
    ...js.configs.recommended,
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error'
    }
  },
  
  // TypeScript文件配置
  {
    name: 'typescript',
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error'
    }
  },
  
  // Vue文件配置
  {
    name: 'vue',
    files: ['**/*.vue'],
    plugins: {
      vue
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          ts: tseslintParser
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    // 手动应用Vue推荐的规则，而不是使用包含extends的配置对象
    rules: {
      ...vue.configs.recommended.rules,
      'vue/multi-word-component-names': 'off'
    }
  }
]