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
                :placeholder="searchType === 'fuzzy' ? '请输入搜索内容...' : '请输入坐标(如: 经度,纬度)'" @keyup.enter="handleSearch" />

            <!-- 右侧搜索按钮 -->
            <button class="search-button" @click="handleSearch">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

/**
 * 搜索栏组件
 * 提供地图搜索功能，支持模糊查询和坐标反查两种搜索模式，参考百度地图搜索框设计
 * @author Sogrey
 * @date 2025-11-08 00:00:00
 * @lastModify 2025-11-08 00:00:00
 * @version 1.0.0
 * @see https://map.baidu.com/
 */
export default defineComponent({
    name: 'search-bar',
    props: {},
    emits: ['search'],
    setup(props, { emit }) {
        const searchType = ref<'fuzzy' | 'coordinate'>('fuzzy');
        const searchText = ref('');

        /**
         * handleSearch
         * 处理搜索操作，验证输入并触发搜索事件
         * @returns {void}
         * @example
         * handleSearch() // 触发搜索事件
         * @see SearchResult
         */
        const handleSearch = () => {
            if (!searchText.value.trim()) return;

            const result: SearchResult = {
                type: searchType.value,
                text: searchText.value.trim(),
                timestamp: Date.now()
            }

            emit('search', result);
        };

        return {
            searchType,
            searchText,
            handleSearch
        };
    }
});
</script>

<style lang="less" scoped>
.search-bar {
    width: 425px;
    height: 40px;
    background: #ffffff;
    margin: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    border: 1px solid #3388ff;
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    }

    &:focus-within {
        box-shadow: 0 2px 15px rgba(51, 136, 255, 0.25);
    }

    .search-container {
        display: flex;
        align-items: center;
        height: 100%;
        gap: 0;

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