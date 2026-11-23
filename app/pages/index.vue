<script setup lang="ts">
useSeoMeta({
  title: '奕潔｜作品集',
})

const nav = [
  { href: '#works', label: '作品' },
  { href: '#about', label: '關於我' },
  { href: '#contact', label: '聯絡' },
]
</script>

<template>
  <div>
    <header class="pointer-events-none fixed inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-2 px-[clamp(16px,3vw,40px)] py-3.5">
      <a
        href="#top"
        class="pointer-events-auto rounded-full bg-bg/80 px-3 py-1.5 text-lg font-black no-underline backdrop-blur-md"
      >奕潔 Jessica</a>
      <nav
        aria-label="主選單"
        class="pointer-events-auto flex gap-1 rounded-full bg-bg/80 p-1 backdrop-blur-md"
      >
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="rounded-full px-3.5 py-2 text-[15px] font-medium no-underline hover:bg-surface"
        >{{ item.label }}</a>
      </nav>
    </header>

    <main>
      <HeroStoryStage />

      <!-- 第 4 階段：作品列表 -->
      <section
        id="works"
        aria-labelledby="worksTitle"
        class="px-4 py-24"
      >
        <div class="mx-auto max-w-5xl">
          <h2
            id="worksTitle"
            class="text-3xl font-black"
          >
            精選作品
          </h2>
        </div>
      </section>

      <!-- 第 5 階段：晚上場景、關於我、聯絡 -->
      <section
        id="about"
        aria-labelledby="aboutTitle"
        class="bg-night px-4 py-24 text-[#EEE8DF] dark:bg-bg"
      >
        <div class="mx-auto max-w-5xl">
          <h2
            id="aboutTitle"
            class="text-3xl font-black"
          >
            關於我
          </h2>
          <div
            id="contact"
            class="mt-16 border-t border-night-line pt-8"
          />
        </div>
      </section>
    </main>
  </div>
</template>
