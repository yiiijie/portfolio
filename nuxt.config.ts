import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      title: '奕潔｜作品集',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Space+Grotesk:wght@500;700&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  nitro: {
    // 固定輸出到 .output/public；不設定的話在 Cloudflare Pages 上會自動改用
    // cloudflare-pages-static preset，輸出到 dist，與建置設定不符
    preset: 'static',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
