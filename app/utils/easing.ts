export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v))
}

/** 把 p 在 [a, b] 區間內換算成 0–1 */
export function seg(p: number, a: number, b: number): number {
  return clamp((p - a) / (b - a), 0, 1)
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
