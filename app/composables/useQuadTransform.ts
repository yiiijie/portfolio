import type { Ref } from 'vue'

/** 四個角（場景圖 1536×1024 座標），順序：左上、右上、右下、左下 */
export type Quad = [[number, number], [number, number], [number, number], [number, number]]

const SCENE_W = 1536

/**
 * 把 w×h 的元素貼到四邊形上的 matrix3d（公式照原型 fitQuad()）。
 * hostWidth 是場景容器的實際寬度，用來把場景圖座標換成 px。
 */
export function quadToMatrix3d(hostWidth: number, Q: Quad, w: number, h: number): string {
  const k = hostWidth / SCENE_W
  const q = Q.map(([x, y]) => [x * k, y * k] as const)
  const [x0, y0] = q[0]!, [x1, y1] = q[1]!, [x2, y2] = q[2]!, [x3, y3] = q[3]!
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3
  const den = dx1 * dy2 - dx2 * dy1
  const g = (dx3 * dy2 - dx2 * dy3) / den
  const hh = (dx1 * dy3 - dx3 * dy1) / den
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0
  return `matrix3d(${[a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1].join(',')})`
}

/**
 * 回傳把 el（w×h）貼到 quad 的 transform；跟著宿主（el 的父元素，即場景）寬度變化重新計算。
 * 場景本身的 transform 不影響 offsetWidth，所以推進鏡頭時不需重算。
 */
export function useQuadTransform(el: Ref<HTMLElement | null>, quad: () => Quad, w: number, h: number) {
  const hostWidth = ref(0)
  let ro: ResizeObserver | undefined

  onMounted(() => {
    const host = el.value?.parentElement
    if (!host) return
    hostWidth.value = host.offsetWidth
    ro = new ResizeObserver(() => {
      hostWidth.value = host.offsetWidth
    })
    ro.observe(host)
  })

  onBeforeUnmount(() => ro?.disconnect())

  return computed(() => (hostWidth.value ? quadToMatrix3d(hostWidth.value, quad(), w, h) : undefined))
}
