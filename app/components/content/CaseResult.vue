<script setup lang="ts">
// 案例頁「成果」：前後對照的長條，加一句說明
interface Bar {
  label: string
  value: string
  /** 長條寬度（%） */
  width: number
  accent?: boolean
}
defineProps<{ bars: Bar[] }>()
</script>

<template>
  <div class="flex flex-col gap-[18px] rounded-2xl border border-line bg-surface p-6">
    <div
      v-for="b in bars"
      :key="b.label"
      class="flex flex-col gap-1.5"
    >
      <div class="flex justify-between text-[15px]">
        <span>{{ b.label }}</span>
        <b
          class="font-num"
          :class="b.accent ? 'text-accent' : ''"
        >{{ b.value }}</b>
      </div>
      <div class="h-3.5 overflow-hidden rounded-[7px] bg-[#EDE3D6] dark:bg-night-line">
        <i
          class="block h-full min-w-2 rounded-[7px]"
          :class="b.accent ? 'bg-accent' : 'bg-[#B8AA9A]'"
          :style="{ width: b.width + '%' }"
        />
      </div>
    </div>
    <small class="text-[14px] text-muted [&_p]:m-0"><slot /></small>
  </div>
</template>
