<script setup lang="ts">
// 平板畫面：400×260 容器，內容 tab_ui.webp 滿版，整個容器用 matrix3d 貼到平板螢幕內緣
const props = defineProps<{
  phase: 'morning' | 'day'
  on: boolean
}>()

// 沿螢幕內緣取樣擬合出來的四個角，不要目測調整
const QUAD_DAY: Quad = [[78.4, 574.9], [271.7, 551.3], [303.7, 687.0], [110.4, 718.7]]
const QUAD_MORNING: Quad = [[79.1, 568.7], [266.7, 547.1], [302.7, 682.8], [117.0, 712.8]]

const el = ref<HTMLElement | null>(null)
const transform = useQuadTransform(el, () => (props.phase === 'morning' ? QUAD_MORNING : QUAD_DAY), 400, 260)
</script>

<template>
  <div
    ref="el"
    class="tab"
    :class="{ on: props.on }"
    :style="transform ? { transform } : { visibility: 'hidden' }"
    aria-hidden="true"
  >
    <div class="t-off" />
    <div class="t-ui" />
  </div>
</template>

<style scoped>
.tab {
  position: absolute;
  left: 0;
  top: 0;
  width: 400px;
  height: 260px;
  transform-origin: 0 0;
  overflow: hidden;
  border-radius: 14px;
  pointer-events: none;
}
.tab > div {
  position: absolute;
  inset: 0;
  transition: opacity .35s ease;
}
.t-off {
  background: linear-gradient(160deg, #2c2f36, #15171c 60%, #23262c);
}
.t-off::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, .08) 45%, transparent 55%);
}
.t-ui {
  background: #F3F1EC url(/scene/tab_ui.webp) center / 100% 100% no-repeat;
}
.tab:not(.on) .t-ui {
  opacity: 0;
}
.tab.on .t-off {
  opacity: 0;
}
</style>
