<script setup lang="ts">
// 首頁作品列表：編號、名稱、一句成果、技術與年份、預覽（佔位）
const { data: works } = await useAsyncData('works-list', () =>
  queryCollection('works').order('order', 'ASC').all(),
)

const pad = (n: number) => String(n).padStart(2, '0')
// 列表只顯示年份：「2025.12 – 現在」→「2025 – 現在」
const years = (period: string) => period.replace(/(\d{4})\.\d{1,2}/g, '$1')
// 原型用全形空白（U+3000）把技術和年份隔開
const meta = (tags: string, period: string) => `${tags}\u3000/\u3000${years(period)}`
</script>

<template>
  <section
    id="works"
    aria-labelledby="worksTitle"
    class="pt-24 pb-28"
  >
    <div class="mx-auto max-w-[1180px] px-[clamp(20px,4vw,48px)]">
      <div class="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-5">
        <h2
          id="worksTitle"
          class="m-0 text-[clamp(30px,4vw,48px)] leading-[1.2] font-black"
        >
          精選作品
        </h2>
        <span class="font-num text-[13px] leading-[normal] font-bold tracking-[.16em] text-muted">SELECTED WORK 01 — {{ pad(works?.length ?? 0) }}</span>
      </div>

      <NuxtLink
        v-for="w in works"
        :key="w.path"
        :to="w.path"
        class="group flex flex-wrap items-center gap-x-10 gap-y-7 border-b border-line py-10 no-underline"
      >
        <span class="flex-[0_0_64px] font-num text-[40px] leading-none font-bold text-muted transition-colors duration-200 group-hover:text-accent">{{ pad(w.order) }}</span>
        <div class="flex min-w-0 flex-[999_1_340px] flex-col gap-2">
          <h3 class="m-0 text-[clamp(22px,2.4vw,30px)] leading-[1.3] font-black transition-colors duration-200 group-hover:text-accent">
            {{ w.title }}
          </h3>
          <p class="m-0 text-muted">
            {{ w.summary }}
          </p>
          <p class="m-0 text-[14px] text-muted">
            {{ meta(w.tags, w.period) }}
          </p>
        </div>
        <img
          v-if="w.cover"
          :src="w.cover"
          alt=""
          class="aspect-[16/10] max-w-[400px] flex-[1_1_300px] rounded-xl object-cover transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-[.6deg]"
        >
        <div
          v-else
          class="flex aspect-[16/10] max-w-[400px] flex-[1_1_300px] items-center justify-center rounded-xl border border-dashed border-muted bg-surface p-3 text-center text-[14px] text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-[.6deg]"
        >
          {{ w.coverPlaceholder }}
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
