<script setup lang="ts">
// 早上／白天／轉頭圖層與 hole 遮罩層
const props = defineProps<{
  phase: 'morning' | 'day'
  turned: boolean
  /** 白天圖層透明度；null 表示交給 CSS（伺服器輸出、減少動態） */
  dayOpacity: number | null
}>()

const turnD = ref<HTMLImageElement | null>(null)
const turnM = ref<HTMLImageElement | null>(null)

onMounted(() => {
  // 先解碼轉頭圖，第一次 hover 才不會卡
  for (const im of [turnD.value, turnM.value]) im?.decode?.().catch(() => {})
})
</script>

<template>
  <div
    class="layer-group g-morning"
    :class="{ turned: props.turned }"
  >
    <img
      class="layer"
      src="/scene/morning.webp"
      alt=""
      width="1536"
      height="1024"
    >
    <img
      class="layer hole"
      src="/scene/hole_morning.webp"
      alt=""
      width="1536"
      height="1024"
    >
  </div>
  <div
    class="layer-group g-day"
    :class="{ turned: props.turned }"
    :style="props.dayOpacity === null ? undefined : { opacity: props.dayOpacity }"
  >
    <img
      class="layer"
      src="/scene/day.webp"
      alt=""
      width="1536"
      height="1024"
    >
    <img
      class="layer hole"
      src="/scene/hole_day.webp"
      alt=""
      width="1536"
      height="1024"
    >
  </div>
  <img
    ref="turnD"
    class="layer img-turn turn-d"
    :class="{ show: props.turned && props.phase === 'day' }"
    src="/scene/turn.webp"
    alt=""
    width="1536"
    height="1024"
  >
  <img
    ref="turnM"
    class="layer img-turn turn-m"
    :class="{ show: props.turned && props.phase === 'morning' }"
    src="/scene/turn_morning.webp"
    alt=""
    width="1536"
    height="1024"
  >
</template>

<style scoped>
.layer-group {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.g-day {
  opacity: 0;
}
.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  transition: filter .6s ease;
}
.hole {
  transition: opacity .25s ease, filter .6s ease;
}
/* 關燈：濾鏡定義在 StoryStage 的 <svg>，依時段選早上或白天那組 */
.dark .g-day .layer,
.dark .turn-d {
  filter: url(#dimday);
}
.dark .g-morning .layer,
.dark .turn-m {
  filter: url(#dimmorning);
}
.turned .hole {
  opacity: 0;
}
.img-turn {
  opacity: 0;
  transition: opacity .25s ease, filter .6s ease;
}
.img-turn.show {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .g-day {
    opacity: 1;
  }
}
</style>
