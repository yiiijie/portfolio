<script setup lang="ts">
// 案例頁「一個技術挑戰」的小卡（問題／做法／另一個發現）
defineProps<{ label: string }>()
</script>

<template>
  <div class="mt-3 rounded-[14px] border border-line bg-surface px-[22px] py-5 first:mt-0 [&_p]:m-0">
    <h3 class="m-0 mb-1.5 font-num text-[13px] leading-[normal] font-bold tracking-[.14em] text-muted">
      {{ label }}
    </h3>
    <slot />
  </div>
</template>
