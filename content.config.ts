import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    works: defineCollection({
      type: 'page',
      source: 'works/*.md',
      schema: z.object({
        // SPEC 第 4 節的欄位
        order: z.number(),
        period: z.string(),
        role: z.string().optional(),
        stack: z.string().optional(),
        summary: z.string(),
        cover: z.string().optional(),
        // 原型裡另外出現、為了照搬文字而加的欄位
        /** 案例頁標題下的介紹 */
        lead: z.string().optional(),
        /** 案例頁 FOCUS 欄 */
        focus: z.string().optional(),
        /** 首頁列表的技術標籤（原型列表和案例頁 STACK 寫法不同） */
        tags: z.string(),
        /** 首頁列表沒有 cover 時的佔位文字 */
        coverPlaceholder: z.string().optional(),
      }),
    }),
  },
})
