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
    class="layer-group"
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
    class="layer img-turn"
    :class="{ show: props.turned && props.phase === 'day' }"
    src="/scene/turn.webp"
    alt=""
    width="1536"
    height="1024"
  >
  <img
    ref="turnM"
    class="layer img-turn"
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
}
.hole {
  transition: opacity .25s ease;
}
.turned .hole {
  opacity: 0;
}
.img-turn {
  opacity: 0;
  transition: opacity .25s ease;
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
