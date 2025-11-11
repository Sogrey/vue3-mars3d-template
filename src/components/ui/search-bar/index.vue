<!--
* search-bar 组件
* 地图搜索栏组件，提供模糊查询和坐标反查两种搜索模式，参考百度地图搜索框设计
* @author Sogrey
* @date 2025-11-08
* @lastModify 2025-11-08
* @version 1.0.0
-->

<template>
  <div class="search-bar">
    <div class="search-container">
      <!-- 左侧下拉列表 -->
      <select v-model="searchType" class="search-type">
        <option value="fuzzy">模糊查询</option>
        <option value="coordinate">坐标反查</option>
      </select>

      <!-- 输入框 -->
      <input v-model="searchText" class="search-input" type="text"
        :placeholder="searchType === 'fuzzy' ? '请输入搜索内容...' : '请输入坐标(如: 经度,纬度)'" @keyup.enter="handleSearch"
        @focus="showResults" @blur="hideResults" />

      <!-- 右侧搜索按钮 -->
      <button class="search-button" @click="handleSearch">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
        </svg>
      </button>
    </div>

    <!-- 搜索结果列表 -->
    <transition name="search-result-fade">
      <div v-show="showResultList" class="search-result">
        <div class="search-result-list">
          <div v-for="(result, index) in searchResults" :key="index" class="search-result-item"
            @click="selectResult(result)">
            <div class="result-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
            </div>
            <div class="result-content">
              <div class="result-name">{{ result.text }}</div>
              <div class="result-address">{{ result.address }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useAttrs, useSlots  } from 'vue'
import type { PropType } from 'vue'

/**
 * 搜索栏组件
 * 提供地图搜索功能，支持模糊查询和坐标反查两种搜索模式，参考百度地图搜索框设计
 * @author Sogrey
 * @date 2025-11-08 00:00:00
 * @lastModify 2025-11-08 00:00:00
 * @version 1.0.0
 */
export default defineComponent({
  name: 'search-bar',
  props: {},
  emits: ['search', 'selectResult'],
  setup(props, { emit }) {    
    const attrs = useAttrs();
    const slots = useSlots();
    const searchType = ref<'fuzzy' | 'coordinate'>('fuzzy')
    const searchText = ref('')
    const showResultList = ref(false)

    // 测试搜索结果数据 
    const searchResults = ref([
      {
        text: '北京市',
        address: '北京市东城区正义路2号',
        location: {
          lng: 116.3974,
          lat: 39.9093
        }
      },
      {
        text: '天安门广场',
        address: '北京市东城区东长安街天安门广场',
        location: {
          lng: 116.3975,
          lat: 39.9087
        }
      },
      {
        text: '故宫博物院',
        address: '北京市东城区景山前街4号',
        location: {
          lng: 116.3972,
          lat: 39.9175
        }
      },
      {
        text: '颐和园',
        address: '北京市海淀区新建宫门路19号',
        location: {
          lng: 116.2732,
          lat: 40.0025
        }
      },
      {
        text: '鸟巢国家体育场',
        address: '北京市朝阳区国家体育场南路1号',
        location: {
          lng: 116.3965,
          lat: 39.9928
        }
      }
    ])

    /**
     * showResults
     * 显示搜索结果列表
     * @returns {void}
     */
    const showResults = () => {
      showResultList.value = true
    }

    /**
     * hideResults
     * 隐藏搜索结果列表
     * @returns {void}
     */
    const hideResults = () => {
      // 延迟隐藏以避免点击事件被中断
      setTimeout(() => {
        showResultList.value = false
      }, 200)
    }

    /**
     * selectResult
     * 选择搜索结果项
     * @param {Object} result - 搜索结果对象
     * @returns {void}
     */
    const selectResult = (result: SearchResult) => {
      searchText.value = result.text.trim()
      showResultList.value = false

      const searchResult: SearchResult = {
        type: searchType.value,
        text: result.text.trim(),
        timestamp: Date.now(),
        address: result.address,
        location: result.location
      }

      emit('selectResult', searchResult)
    }

    /**
     * handleSearch
     * 处理搜索操作，验证输入并触发搜索事件
     * @returns {void}
     * @example
     * handleSearch() // 触发搜索事件
     * @see SearchResult
     */
    const handleSearch = () => {
      if (!searchText.value.trim()) return

      const result: SearchResult = {
        type: searchType.value,
        text: searchText.value.trim(),
        timestamp: Date.now(),
      }

      emit('search', result)
    }

    return {
      attrs, slots,
      searchType,
      searchText,
      showResultList,
      searchResults,
      handleSearch,
      showResults,
      hideResults,
      selectResult,
    }
  },
})
</script>

<style lang="less" scoped>
.search-bar {
  width: 425px;
  min-height: 40px;
  background: #ffffff;
  margin: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  border: 1px solid #3388ff;
  transition: all 0.3s ease;
  overflow: visible;
  position: relative;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }

  &:focus-within {
    box-shadow: 0 2px 15px rgba(51, 136, 255, 0.25);
  }

  .search-container {
    display: flex;
    align-items: center;
    height: 40px;
    gap: 0;
    z-index: 10;

    .search-type {
      border: none;
      background: transparent;
      border-right: 1px solid #f0f0f0;
      height: 100%;
      outline: none;
      cursor: pointer;
      font-size: 14px;
      min-width: 100px;
      color: #333;
      font-weight: 500;
      text-align: center;

      option {
        background: #fff;
        color: #333;
        padding: 8px;
      }
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      height: 100%;
      outline: none;
      font-size: 14px;
      padding: 0 16px;
      color: #333;
      font-weight: 400;

      &::placeholder {
        color: #999;
        font-weight: 400;
      }

      &:focus {
        background: transparent;
      }
    }

    .search-button {
      border: none;
      background: #3388ff;
      height: 40px;
      width: 57px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: #2970e6;
        transform: scale(1.05);
      }

      &:active {
        background: #1f5cc7;
        transform: scale(0.98);
      }

      svg {
        color: #ffffff;
        width: 30px;
        height: 30px;
      }
    }
  }

  /* 搜索结果列表样式 */
  .search-result {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 0 0 4px 4px;
    border: 1px solid #e0e0e0;
    border-top: none;
    max-height: 240px;
    overflow-y: auto;
    margin-top: 5px;

    .search-result-list {
      padding: 8px 0;

      .search-result-item {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f5f5f5;
        }

        .result-icon {
          margin-right: 12px;
          color: #3388ff;
          display: flex;
          align-items: center;

          svg {
            width: 16px;
            height: 16px;
          }
        }

        .result-content {
          flex: 1;
          min-width: 0;
          overflow: hidden;

          .result-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
          }

          .result-address {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}

/* 搜索结果动画效果 */
.search-result-fade-enter-active {
  transition: all 0.3s ease-out;
}

.search-result-fade-leave-active {
  transition: all 0.2s ease-in;
}

.search-result-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.search-result-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .search-bar {
    height: 40px;
    padding: 0 8px;

    .search-container {
      .search-type {
        min-width: 80px;
        padding: 0 8px;
        font-size: 13px;
      }

      .search-input {
        padding: 0 12px;
        font-size: 13px;
      }

      .search-button {
        width: 28px;
        height: 28px;

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
