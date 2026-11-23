<script setup lang="ts">
// 右螢幕：作品清單（文字照原型）
const items = [
  { no: '01', name: 'Scheduler AI 排班系統' },
  { no: '02', name: '離海 5min 活動住宿官網' },
  { no: '03', name: 'T-Mamori 資安平台' },
  { no: '04', name: 'Woodball 木球賽事系統' },
]
</script>

<template>
  <div
    class="scr-r"
    aria-hidden="true"
  >
    <div class="mini">
      <div class="mini-top">
        <span>SELECTED WORK</span><span>01 — 04</span>
      </div>
      <h3>精選作品</h3>
      <ol>
        <li
          v-for="it in items"
          :key="it.no"
        >
          <span>{{ it.no }}</span>{{ it.name }}
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.scr-r {
  position: absolute;
  overflow: hidden;
  left: 49.870%;
  top: 32.031%;
  width: 26.432%;
  height: 22.070%;
  background: #FBF8F3;
}
.mini {
  position: absolute;
  left: 33%;
  right: 5%;
  top: 14%;
  bottom: 8%;
  display: flex;
  flex-direction: column;
  gap: .45cqw;
  color: #2A2521;
}
.mini-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 700 .5cqw var(--font-num);
  letter-spacing: .12em;
  color: #6A5F57;
}
.mini h3 {
  margin: 0;
  font-weight: 900;
  font-size: 1.25cqw;
  line-height: 1.2;
}
.mini ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}
.mini li {
  display: flex;
  gap: .6cqw;
  align-items: baseline;
  padding: .32cqw 0;
  border-top: .06cqw solid #D9CDBE;
  font-size: .62cqw;
  font-weight: 700;
}
.mini li span {
  font-family: var(--font-num);
  color: #456A9E;
  font-size: .55cqw;
}
</style>
