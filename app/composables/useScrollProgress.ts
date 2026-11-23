import type { Ref } from 'vue'

/**
 * 回傳 0–1 的故事進度：已捲動距離 ÷（區塊高 − 視窗高）。
 */
export function useScrollProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(0)
  let raf = 0

  function update() {
    const el = target.value
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    progress.value = total > 0 ? clamp(-el.getBoundingClientRect().top / total, 0, 1) : 0
  }

  function schedule() {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      update()
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (raf) cancelAnimationFrame(raf)
  })

  return { progress, update }
}
