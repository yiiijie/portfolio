<script setup lang="ts">
// 場景裡可互動的物件：透明按鈕 + 呼吸提示點 + tooltip
const props = withDefaults(defineProps<{
  /** 熱區 left / top / width / height（場景百分比） */
  rect: [number, number, number, number]
  label: string
  /** 提示點位置（熱區內百分比） */
  dot?: [number, number]
  tip?: string
  tipBelow?: boolean
  /** 觸控時點一下切換 tooltip 顯示 */
  tapTip?: boolean
}>(), {
  dot: () => [50, 22],
  tip: undefined,
  tipBelow: false,
  tapTip: false,
})

const seen = ref(false)
const on = ref(false)

const style = computed(() => ({
  'left': props.rect[0] + '%',
  'top': props.rect[1] + '%',
  'width': props.rect[2] + '%',
  'height': props.rect[3] + '%',
  '--dx': props.dot[0] + '%',
  '--dy': props.dot[1] + '%',
}))

function onClick() {
  seen.value = true
  if (props.tapTip) on.value = !on.value
}
</script>

<template>
  <button
    type="button"
    class="hot"
    :class="{ seen, on }"
    :style="style"
    :aria-label="label"
    @mouseenter="seen = true"
    @focus="seen = true"
    @click="onClick"
  >
    <span
      v-if="tip"
      class="tip"
      :class="{ below: tipBelow }"
    >{{ tip }}</span>
  </button>
</template>

<style scoped>
.hot {
  position: absolute;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 14px;
  -webkit-tap-highlight-color: transparent;
}
.hot::after {
  content: "";
  position: absolute;
  left: var(--dx, 50%);
  top: var(--dy, 22%);
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  background: #FFFDF9;
  box-shadow: 0 0 0 2px rgba(69, 106, 158, .9);
  animation: ping 2.4s ease-out infinite;
  transition: opacity .3s, transform .3s;
}
.hot:hover::after,
.hot:focus-visible::after,
.hot.seen::after,
.zooming .hot::after {
  opacity: 0;
  transform: scale(.4);
}
@keyframes ping {
  0% { box-shadow: 0 0 0 2px rgba(69, 106, 158, .9), 0 0 0 0 rgba(255, 253, 249, .85); }
  70% { box-shadow: 0 0 0 2px rgba(69, 106, 158, .9), 0 0 0 14px rgba(255, 253, 249, 0); }
  100% { box-shadow: 0 0 0 2px rgba(69, 106, 158, .9), 0 0 0 0 rgba(255, 253, 249, 0); }
}
.hot:focus {
  outline: none;
}
.hot:focus-visible {
  outline: 2px dashed rgba(255, 253, 249, .75);
  outline-offset: 2px;
}
.tip {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translate(-50%, 6px);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  padding: 8px 14px;
  border-radius: 12px;
  background: #2A2521;
  color: #FFFDF9;
  font: 500 clamp(12px, .95cqw, 16px)/1.4 var(--font-sans);
  transition: opacity .18s, transform .18s;
}
.tip.below {
  bottom: auto;
  top: calc(100% + 10px);
}
.hot:hover .tip,
.hot:focus-visible .tip,
.hot.on .tip {
  opacity: 1;
  transform: translate(-50%, 0);
}
.zooming .hot {
  pointer-events: none;
}
.zooming .hot .tip {
  opacity: 0;
}
@media (max-width: 700px) {
  .tip {
    white-space: normal;
    width: max-content;
    max-width: 60vw;
  }
}
</style>
