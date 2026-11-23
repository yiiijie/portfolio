<script setup lang="ts">
// 貓：呼吸動畫的去背貓，點擊冒 5 顆黏土愛心並輕微晃動
defineProps<{
  /** 去背貓的透明度（跟白天圖層同步）；null 表示交給 CSS */
  opacity: number | null
}>()

interface Heart { id: number, x: number, y: number, fx: string }

const cat = ref<HTMLImageElement | null>(null)
const hearts = ref<Heart[]>([])
let seq = 0
const timers = new Set<ReturnType<typeof setTimeout>>()

function later(fn: () => void, ms: number) {
  const t = setTimeout(() => {
    timers.delete(t)
    fn()
  }, ms)
  timers.add(t)
}

function pop() {
  for (let k = 0; k < 5; k++) {
    later(() => {
      const id = ++seq
      hearts.value.push({
        id,
        x: 10 + Math.random() * 9,
        y: 36 + Math.random() * 4,
        fx: ((Math.random() - 0.5) * 3).toFixed(2) + 'cqw',
      })
      later(() => {
        hearts.value = hearts.value.filter(h => h.id !== id)
      }, 1700)
    }, k * 90)
  }
  const el = cat.value
  if (el) {
    el.classList.remove('purr')
    void el.offsetWidth
    el.classList.add('purr')
  }
}

onBeforeUnmount(() => {
  for (const t of timers) clearTimeout(t)
})

defineExpose({ pop })
</script>

<template>
  <img
    ref="cat"
    class="cat-cut"
    src="/scene/cat.webp"
    alt=""
    width="265"
    height="164"
    :style="opacity === null ? undefined : { opacity }"
  >
  <img
    v-for="h in hearts"
    :key="h.id"
    class="heart"
    src="/scene/heart.webp"
    alt=""
    aria-hidden="true"
    :style="{ 'left': h.x + '%', 'top': h.y + '%', '--fx': h.fx }"
  >
</template>

<style scoped>
.cat-cut {
  position: absolute;
  left: 5.208%;
  top: 32.031%;
  width: 17.253%;
  height: 16.016%;
  transform-origin: 50% 92%;
  animation: breathe 3.4s ease-in-out infinite;
  pointer-events: none;
  opacity: 0;
  transition: filter .6s ease;
}
.dark .cat-cut {
  filter: url(#dimday);
}
.cat-cut.purr {
  animation: purr .5s ease-in-out 2;
}
@keyframes breathe {
  0%, 100% { transform: scale(1, 1); }
  50% { transform: scale(1.012, 1.035); }
}
@keyframes purr {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-1.6deg) scale(1.02); }
  75% { transform: rotate(1.6deg) scale(1.02); }
}
.heart {
  position: absolute;
  z-index: 4;
  pointer-events: none;
  width: 2.8cqw;
  height: auto;
  filter: drop-shadow(0 .15cqw .2cqw rgba(60, 40, 30, .25));
  animation: floatup 1.6s ease-out forwards;
}
@keyframes floatup {
  0% { opacity: 0; transform: translate(0, 0) scale(.6); }
  15% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--fx, 0px), -5cqw) scale(1.15); }
}
</style>
