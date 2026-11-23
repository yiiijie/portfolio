<script setup lang="ts">
// 左螢幕：逐字打出程式碼，打完停一下再重來
const SRC: [cls: '' | 'k' | 's' | 't', text: string][] = [
  ['k', '<' + 'script setup lang="ts">'],
  ['', 'const projects = await useProjects()'],
  ['', 'const active = ref<string | null>(null)'],
  ['k', '<' + '/script>'],
  ['', ''],
  ['k', '<template>'],
  ['t', '  <ProjectCard'],
  ['s', '    v-for="p in projects"'],
  ['s', '    :key="p.id"'],
  ['s', '    @mouseenter="active = p.id"'],
  ['t', '  />'],
  ['k', '</template>'],
]
const FULL = SRC.reduce((n, [, t]) => n + t.length + 1, -1)

const n = ref(0)
let i = 0
let timer: ReturnType<typeof setTimeout> | undefined

const lines = computed(() => {
  const out: { cls: string, text: string }[] = []
  let left = n.value
  for (const [cls, line] of SRC) {
    if (left < 0) break
    const take = line.slice(0, left)
    left -= line.length + 1
    out.push({ cls, text: take + (left >= 0 ? '\n' : '') })
  }
  return out
})

function tick() {
  i++
  if (i > FULL + 40) i = 0
  n.value = Math.min(i, FULL)
  timer = setTimeout(tick, i > FULL ? 60 : 38)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    n.value = FULL
    return
  }
  tick()
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div
    class="scr scr-l"
    aria-hidden="true"
  >
    <pre class="code"><span
      v-for="(l, k) in lines"
      :key="k"
      :class="l.cls"
    >{{ l.text }}</span><span class="caret" /></pre>
  </div>
</template>

<style scoped>
.scr {
  position: absolute;
  overflow: hidden;
}
.scr-l {
  left: 23.4375%;
  top: 32.031%;
  width: 26.693%;
  height: 22.070%;
  background: #1F2430;
}
.code {
  margin: 0;
  padding: 1.2cqw 1.2cqw 1.2cqw 1.6cqw;
  font: 500 .78cqw/1.55 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #C9D3E6;
  white-space: pre;
}
.code .k { color: #8FB0E0; }
.code .s { color: #E6C38F; }
.code .t { color: #9ED0B5; }
.caret {
  display: inline-block;
  width: .45cqw;
  height: .9cqw;
  background: #E6C38F;
  vertical-align: -.1cqw;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
