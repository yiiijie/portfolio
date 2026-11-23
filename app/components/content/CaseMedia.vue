<script setup lang="ts">
// 案例頁的截圖或錄影。公司專案在取得同意前一律是佔位框（內文寫佔位說明）。
defineProps<{ caption?: string }>()
</script>

<template>
  <figure class="m-0">
    <div class="mt-10 flex aspect-[16/10] items-center justify-center rounded-2xl border border-dashed border-muted bg-surface p-4 text-center text-muted [&_p]:m-0">
      <slot />
    </div>
    <figcaption
      v-if="caption"
      class="mt-2.5 text-[14px] text-muted"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
