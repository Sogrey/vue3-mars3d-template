<!--
 * index.vue
 * 堆叠卡片组件主文件
 * @author Sogrey
 * @date 2025-06-01 00:00:00
 * @lastModify 2025-11-08 00:00:00
 * @version 1.0.0
 * @see 参考百度地图 mapType-wrapper 功能
-->

<template>
    <div id="stacked-cards-wrapper" :class="{ expand: isExpanded }" @mouseenter="isExpanded = true"
        @mouseleave="isExpanded = false">
        <div id="stacked-cards">
            <div v-for="(card, index) in cardList" :key="card.id" class="stacked-card"
                :class="[card.className, { active: activeCardIndex === index }]" :style="{
                    backgroundImage: `url(${card.image})`,
                    zIndex: index
                }" @click="handleCardClick(card, index)">
                <div v-if="card.switchConfig" class="switch-box">
                    <label :title="card.switchConfig.label">
                        <input v-model="card.switchConfig.value" type="checkbox" class="switch" @click.stop />
                        <p>{{ card.switchConfig.label }}</p>
                    </label>
                </div>
                <span>{{ card.name }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

/**
 * stacked-cards 组件
 * 堆叠卡片展开组件，仿照百度地图右下角地图类型切换功能
 * @example
 * <stacked-cards :cards="stackedCardsData" @card-click="handleCardClick" />
 * @see 参考百度地图 mapType-wrapper 功能
 */
export default defineComponent({
    name: 'stacked-cards',
    props: {
        /**
         * 卡片数据数组
         * @type {CardItem[]}
         */
        cards: {
            type: Array as PropType<CardItem[]>,
            default: () => []
        }
    },
    emits: ['card-click'],
    setup(props, { emit }) {
        const isExpanded = ref(false);
        const activeCardIndex = ref(0);

        /**
         * 使用传入的卡片数据或默认数据
         * @type {Ref<CardItem[]>}
         */
        const cardList = ref<CardItem[]>(
            props.cards.length > 0 ? props.cards : []
        );

        /**
         * handleCardClick
         * 处理卡片点击事件
         * @param {CardItem} card - 被点击的卡片数据
         * @param {number} index - 卡片索引
         */
        const handleCardClick = (card: CardItem, index: number) => {
            activeCardIndex.value = index;
            emit('card-click', { card, index });
        };

        return {
            isExpanded,
            activeCardIndex,
            cardList,
            handleCardClick
        };
    }
});
</script>

<style lang="less" scoped>
#stacked-cards-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    bottom: 32px;
}

#stacked-cards {
    height: 80px;
    cursor: pointer;
    transition-property: width, background-color;
    transition-duration: 0.4s;
    width: 110px;
    background-color: rgba(0, 0, 0, 0);
    position: relative;
}

.expand #stacked-cards {
    width: 404px;
    background-color: rgba(0, 0, 0, 0.8);
}

.expand .stacked-card {
    border: 1px solid rgba(255, 255, 255, 0);
    overflow: hidden;
}

.expand .stacked-card.active {
    border: 3px solid #3385FF;
}

// 动态设置展开状态下的卡片位置
.expand .stacked-card:nth-child(1) {
    right: 298px;
}

.expand .stacked-card:nth-child(2) {
    right: 202px;
}

.expand .stacked-card:nth-child(3) {
    right: 106px;
}

.expand .stacked-card:nth-child(4) {
    right: 6px;
}

.stacked-card {
    height: 60px;
    width: 86px;
    position: absolute;
    border-radius: 5px;
    top: 10px;
    box-sizing: border-box;
    border: 1px solid rgba(153, 153, 153, 0.42);
    background-size: cover;
    background-position: center;
    transition-property: right, border-color;
    transition-duration: 0.4s;
    overflow: hidden;

    span {
        position: absolute;
        bottom: 0;
        right: 0;
        display: inline-block;
        padding: 3px 3px 2px 4px;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #FFF;
        border-top-left-radius: 2px;
        background-color: rgba(0, 0, 0, 0.5);
    }

    &.active span,
    &:hover span {
        background-color: #3385FF;
    }

    &:hover {
        border: 3px solid #3385FF;
    }

    .switch-box p {
        margin: 0;
    }

    .switch-box input.switch {
        margin: 0;
    }

    &:hover .switch-box {
        visibility: visible;
    }
}

// 动态设置折叠状态下的卡片位置
.stacked-card:nth-child(1) {
    z-index: 4;
    right: 20px;
}

.stacked-card:nth-child(2) {
    z-index: 3;
    right: 15px;
}

.stacked-card:nth-child(3) {
    z-index: 2;
    right: 10px;
}

.stacked-card:nth-child(4) {
    z-index: 1;
    right: 5px;
}

.switch-box {
    visibility: hidden;
    position: absolute;
    width: 100%;
    height: 20px;
    line-height: 20px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    label {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 8px;
        cursor: pointer;
        margin-left: 5px;
    }

    p {
        display: inline;
        margin: 0;
        font-size: 12px;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 60px;
    }

    input.switch {
        margin: 0;
        cursor: pointer;
        width: 12px;
        height: 12px;
    }
}

// 响应式适配
@media only screen and (-webkit-min-device-pixel-ratio: 2),
(-webkit-min-device-pixel-ratio: 2),
(min-resolution: 2dppx),
(min-resolution: 192dpi) {
    .stacked-card {
        background-size: contain;
    }
}
</style>