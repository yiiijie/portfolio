<script setup lang="ts">
// 開場：黏住畫面的舞台、捲動時間軸、鑽進右螢幕（數值照原型 frame()）
type Phase = 'morning' | 'day'

interface Frame {
  day: number
  cap1: number
  cap2: number
  hint: number
  cover: number
  transform: string
}

const story = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const scene = ref<HTMLElement | null>(null)
const cat = ref<{ pop: () => void } | null>(null)

const reduce = ref(false)
const phase = ref<Phase>('morning')
const turned = ref(false)
const zooming = ref(false)
const f = ref<Frame | null>(null)
const followAt = ref('translate(0px,0px)')
/** 推進到底的倍率；右螢幕內容依此先放大排版，推進到底時文字才清楚 */
const zoomK = ref(1)

const { progress } = useScrollProgress(story)

// 場景量測（不需要響應式）
let S = 5, Px = 0, Py = 0, W = 0, H = 0, L = 0, T = 0

function measure() {
  const st = stage.value, sc = scene.value
  if (!st || !sc) return
  W = sc.offsetWidth
  H = sc.offsetHeight
  L = (st.clientWidth - W) / 2
  T = (st.clientHeight - H) / 2
  Px = 0.672 * W
  Py = 0.4312 * H
  const vw = st.clientWidth, vh = st.clientHeight
  const s1 = 1.08 * vw * 1536 / (282 * W)
  const s2 = 1.08 * vh * 1024 / (213 * H)
  S = Math.max(s1, s2, 1.5)
  zoomK.value = S
}

function frame(p: number) {
  const st = stage.value
  if (reduce.value || !st) return

  const md = easeInOutCubic(seg(p, 0.12, 0.28))
  phase.value = md > 0.5 ? 'day' : 'morning'

  const z = easeInOutCubic(seg(p, 0.48, 0.94))
  const s = Math.pow(S, z)
  const vx = st.clientWidth / 2, vy = st.clientHeight / 2
  const posX = (L + Px) + (vx - (L + Px)) * z
  const posY = (T + Py) + (vy - (T + Py)) * z
  const tx = posX - s * Px, ty = posY - s * Py

  zooming.value = z > 0.01
  if (zooming.value) turned.value = false

  f.value = {
    day: md,
    cap1: 1 - seg(p, 0.06, 0.16),
    cap2: seg(p, 0.20, 0.28) * (1 - seg(p, 0.44, 0.50)),
    hint: 1 - seg(p, 0.02, 0.08),
    cover: seg(p, 0.90, 0.99),
    transform: `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(4)})`,
  }
}

function onResize() {
  measure()
  frame(progress.value)
}

watch(progress, frame)

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce.value) {
    phase.value = 'day'
    return
  }
  measure()
  frame(progress.value)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const sceneStyle = computed(() =>
  f.value
    ? { 'left': '0px', 'top': '0px', 'transform': f.value.transform, '--zoom-k': zoomK.value.toFixed(4) }
    : undefined,
)
const fade = (v: number | undefined) => (v === undefined ? undefined : { opacity: v })

/* 人物：轉頭 + 游標旁「關於我 →」 */
function turn() {
  if (!zooming.value) turned.value = true
}
// 觸控點擊也會觸發 mouseenter／focus；若在那時轉頭，click 會以為已轉過頭而直接跳走。
// 所以滑鼠用 pointer 事件判斷，聚焦只認鍵盤（:focus-visible）。
function onPersonEnter(e: PointerEvent) {
  if (e.pointerType === 'mouse') turn()
}
function onPersonLeave(e: PointerEvent) {
  if (e.pointerType === 'mouse') unturn()
}
function onPersonFocus(e: FocusEvent) {
  if ((e.target as HTMLElement).matches(':focus-visible')) turn()
}
function unturn() {
  turned.value = false
}
function onMove(e: MouseEvent) {
  const r = stage.value?.getBoundingClientRect()
  if (!r) return
  followAt.value = `translate(${e.clientX - r.left + 18}px,${e.clientY - r.top + 18}px)`
}
function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduce.value ? 'auto' : 'smooth' })
}
function onPerson() {
  // 觸控裝置第一次點先轉頭
  const hoverable = window.matchMedia('(hover: hover)').matches
  if (!hoverable && !turned.value && !zooming.value) {
    turned.value = true
    return
  }
  goTo('about')
}
</script>

<template>
  <section
    id="top"
    ref="story"
    aria-label="開場：奕潔的一天"
    class="relative h-[460vh] motion-reduce:h-auto"
  >
    <div
      ref="stage"
      class="stage sticky top-0 h-screen overflow-hidden bg-bg motion-reduce:relative motion-reduce:h-auto"
      :class="{ zooming }"
      :data-phase="phase"
      @mousemove="onMove"
    >
      <div
        ref="scene"
        class="scene"
        :style="sceneStyle"
      >
        <HeroScreenCode />
        <HeroScreenWorks />
        <HeroSceneLayers
          :phase="phase"
          :turned="turned"
          :day-opacity="f ? f.day : null"
        />
        <HeroCatHearts
          ref="cat"
          :opacity="f ? f.day : null"
        />

        <HeroSceneHotspot
          :rect="[39.06, 24.9, 21.5, 72]"
          :dot="[78, 42]"
          label="關於我"
          @pointerenter="onPersonEnter"
          @pointerleave="onPersonLeave"
          @focus="onPersonFocus"
          @blur="unturn"
          @click="onPerson"
        />
        <HeroSceneHotspot
          :rect="[5.5, 30, 16.6, 17.4]"
          :dot="[62, 30]"
          label="摸摸貓"
          @click="cat?.pop()"
        />
        <!-- 第 3 階段：平板開關（目前只放熱區位置） -->
        <HeroSceneHotspot
          :rect="[3.9, 52.2, 16.6, 19.6]"
          label="開關平板"
        />
        <HeroSceneHotspot
          :rect="[85.6, 31.7, 7.4, 14.6]"
          label="機器人公仔"
          tip="AI 協作夥伴：規格我寫，程式一起寫。"
          tip-below
          tap-tip
        />
        <!-- 第 3 階段：檯燈切換深色模式（目前只放熱區位置） -->
        <HeroSceneHotspot
          :rect="[83.5, 45.1, 14.1, 25.4]"
          :dot="[32, 30]"
          label="檯燈：切換深色模式"
        />
        <HeroSceneHotspot
          :rect="[57.6, 32.2, 18.7, 22]"
          :dot="[84, 18]"
          label="看作品"
          tip="點螢幕，直接看作品。"
          @click="goTo('works')"
        />
      </div>

      <!-- 標題放在舞台上（不在場景裡），固定在導覽列下方 -->
      <div
        class="absolute z-[3] left-[clamp(20px,7vw,140px)] top-[clamp(76px,11vh,130px)] text-ink transition-opacity duration-200 ease-linear [text-shadow:0_0_18px_rgba(255,248,240,.9),0_0_4px_rgba(255,248,240,.8)] portrait:left-[6%] portrait:top-[max(76px,calc(50%_-_33.4vw_-_150px))] portrait:w-[88%] w-[min(58vw,820px)] opacity-100 motion-reduce:opacity-0"
        :style="fade(f?.cap1)"
      >
        <h1 class="m-0 text-[clamp(26px,3.4vw,58px)] leading-[1.2] font-black tracking-[.01em] portrait:text-[28px]">
          早安，我是奕潔。
        </h1>
        <p class="mt-2.5 text-[clamp(14px,1.2vw,21px)] font-medium text-[#4E4540] portrait:text-[15px]">
          前端工程師，Vue 3 / Nuxt / TypeScript。往下捲，看看我的一天。
        </p>
      </div>
      <div
        class="absolute z-[3] left-[clamp(20px,7vw,140px)] top-[clamp(76px,11vh,130px)] text-ink transition-opacity duration-200 ease-linear [text-shadow:0_0_18px_rgba(255,248,240,.9),0_0_4px_rgba(255,248,240,.8)] portrait:left-[6%] portrait:top-[max(76px,calc(50%_-_33.4vw_-_150px))] portrait:w-[88%] w-[min(78vw,1100px)] opacity-0 motion-reduce:opacity-100"
        aria-hidden="true"
        :style="fade(f?.cap2)"
      >
        <h2 class="m-0 text-[clamp(26px,3.4vw,58px)] leading-[1.2] font-black tracking-[.01em] portrait:text-[28px]">
          專心寫 code 的時候，我做這些東西。
        </h2>
        <p class="mt-2.5 text-[clamp(14px,1.2vw,21px)] font-medium text-[#4E4540] portrait:text-[15px]">
          滑過畫面裡的東西看看；點螢幕，直接看作品。
        </p>
      </div>

      <div
        class="pointer-events-none absolute top-0 left-0 z-[6] rounded-full border-[1.5px] border-ink bg-surface px-4 py-2 text-[15px] font-bold whitespace-nowrap text-ink transition-opacity duration-150"
        :class="turned ? 'opacity-100' : 'opacity-0'"
        :style="{ transform: followAt }"
        aria-hidden="true"
      >
        關於我 →
      </div>
      <div
        class="pointer-events-none absolute inset-0 z-[7] bg-bg opacity-0 motion-reduce:hidden"
        :style="fade(f?.cover)"
      />
      <div
        class="absolute bottom-6 left-1/2 z-[8] flex -translate-x-1/2 items-center gap-2 text-sm text-muted transition-opacity duration-300 max-[700px]:hidden motion-reduce:hidden"
        aria-hidden="true"
        :style="fade(f?.hint)"
      >
        <svg
          class="bob"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M12 5v14M6 13l6 6 6-6" /></svg>往下捲
      </div>
      <a
        href="#works"
        class="absolute right-[clamp(16px,3vw,40px)] bottom-6 z-[8] rounded-full border border-line bg-surface px-[18px] py-2.5 text-sm font-medium text-ink no-underline max-[700px]:bottom-4"
      >跳過開場</a>
    </div>
  </section>
</template>

<style scoped>
/* 場景：1536×1024 的 3:2 圖，寬度 max(100vw, 150vh) 置中；手機用 100vw */
.scene {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: max(100vw, 150vh);
  aspect-ratio: 3 / 2;
  transform-origin: 0 0;
  container-type: inline-size;
}
@media (max-aspect-ratio: 1/1) {
  .scene {
    width: 100vw;
  }
}

.bob {
  animation: bob 1.6s ease-in-out infinite;
}
@keyframes bob {
  50% { transform: translateY(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .scene {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    transform: none;
  }
}
</style>
