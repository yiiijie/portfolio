<script setup lang="ts">
// 案例頁：固定六段（專案是什麼、我的角色、我做了什麼、一個技術挑戰、成果、截圖或錄影）。
// 版型照 reference/case-5min.html：「截圖或錄影」放在標題區下方，其餘五段依序編號。
const route = useRoute()
const path = `/works/${route.params.slug}`

const { data } = await useAsyncData(`work-${path}`, async () => {
  const [work, all] = await Promise.all([
    queryCollection('works').path(path).first(),
    queryCollection('works').order('order', 'ASC').select('path', 'title', 'order').all(),
  ])
  return { work, all }
})

const work = computed(() => data.value?.work)
type BodyNode = NonNullable<typeof work.value>['body']['value'][number]
if (!work.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到這個作品', fatal: true })
}

const MEDIA_TITLE = '截圖或錄影'

/** 把內文依 h2 切成段落：標題文字、錨點 id、標題以下的節點 */
interface Part { id: string, title: string, nodes: BodyNode[] }

function textOf(node: BodyNode): string {
  if (typeof node === 'string') return node
  return node.slice(2).map(n => textOf(n as BodyNode)).join('')
}

const parts = computed<Part[]>(() => {
  const out: Part[] = []
  for (const node of work.value?.body.value ?? []) {
    if (Array.isArray(node) && node[0] === 'h2') {
      out.push({ id: String(node[1]?.id ?? `s${out.length + 1}`), title: textOf(node), nodes: [] })
    }
    else if (out.length) {
      out.at(-1)!.nodes.push(node)
    }
  }
  return out
})
const media = computed(() => parts.value.find(p => p.title === MEDIA_TITLE))
const sections = computed(() => parts.value.filter(p => p.title !== MEDIA_TITLE))

/** 用 ContentRenderer 輸出一段節點 */
const asDoc = (nodes: BodyNode[]) => ({ ...work.value!, body: { ...work.value!.body, value: nodes, toc: undefined } })

const pad = (n: number) => String(n).padStart(2, '0')

const meta = computed(() =>
  [
    ['ROLE', work.value?.role],
    ['PERIOD', work.value?.period],
    ['STACK', work.value?.stack],
    ['FOCUS', work.value?.focus],
  ].filter((m): m is [string, string] => !!m[1]),
)

const idx = computed(() => data.value?.all.findIndex(w => w.path === path) ?? -1)
const prev = computed(() => (idx.value > 0 ? data.value?.all[idx.value - 1] : undefined))
const next = computed(() => data.value?.all[idx.value + 1])

useSeoMeta({
  title: () => `${work.value?.title}｜奕潔作品集`,
  description: () => work.value?.summary,
})
</script>

<template>
  <div
    v-if="work"
    class="mx-auto max-w-[880px] px-[clamp(20px,5vw,48px)] text-[17px] leading-[1.8]"
  >
    <div class="flex flex-wrap items-center justify-between gap-3 py-5">
      <NuxtLink
        to="/#works"
        class="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[15px] font-medium no-underline"
      >
        ← 回到作品列表
      </NuxtLink>
      <NuxtLink
        to="/"
        class="font-black no-underline"
      >
        奕潔 Jessica
      </NuxtLink>
    </div>

    <header class="border-b-2 border-ink pt-10 pb-8">
      <span class="font-num text-[13px] leading-[normal] font-bold tracking-[.16em] text-muted">CASE {{ pad(work.order) }}</span>
      <h1 class="mt-3 mb-4 text-[clamp(32px,5vw,52px)] leading-[1.2] font-black">
        {{ work.title }}
      </h1>
      <p
        v-if="work.lead"
        class="m-0 text-[19px] text-muted"
      >
        {{ work.lead }}
      </p>
      <dl
        v-if="meta.length"
        class="mt-7 mb-0 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-8 gap-y-4"
      >
        <div
          v-for="[k, v] in meta"
          :key="k"
          class="flex flex-col gap-0.5"
        >
          <dt class="font-num text-[12px] leading-[normal] font-bold tracking-[.14em] text-muted">
            {{ k }}
          </dt>
          <dd class="m-0 font-medium">
            {{ v }}
          </dd>
        </div>
      </dl>
    </header>

    <ContentRenderer
      v-if="media"
      :value="asDoc(media.nodes)"
    />

    <section
      v-for="(s, i) in sections"
      :key="s.id"
      :aria-labelledby="s.id"
      class="pt-14"
    >
      <h2
        :id="s.id"
        class="m-0 mb-4 flex items-baseline gap-3.5 text-[clamp(24px,3vw,32px)] leading-[1.3] font-black"
      >
        <span class="font-num text-[15px] font-bold text-accent">{{ pad(i + 1) }}</span>{{ s.title }}
      </h2>
      <ContentRenderer :value="asDoc(s.nodes)" />
    </section>

    <nav
      aria-label="其他作品"
      class="mt-[72px] mb-20 flex flex-wrap justify-between gap-4 border-t-2 border-ink pt-6"
    >
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        class="group flex min-h-11 flex-col gap-0.5 no-underline"
      >
        <span class="font-num text-[12px] leading-[normal] font-bold tracking-[.14em] text-muted">PREVIOUS</span>
        <b class="text-[20px] group-hover:text-accent">← {{ prev.title }}</b>
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="next"
        :to="next.path"
        class="group flex min-h-11 flex-col gap-0.5 text-right no-underline"
      >
        <span class="font-num text-[12px] leading-[normal] font-bold tracking-[.14em] text-muted">NEXT</span>
        <b class="text-[20px] group-hover:text-accent">{{ next.title }} →</b>
      </NuxtLink>
    </nav>
  </div>
</template>
