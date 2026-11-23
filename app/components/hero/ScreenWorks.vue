<script setup lang="ts">
// 右螢幕：作品清單（文字照原型）
//
// 鏡頭推進是把整個場景用 transform 放大（手機直式最多約 17 倍）。iOS Safari 會用放大前的
// 小尺寸把文字畫成點陣圖再拉大，所以會糊。這裡讓內容先用推進到底的倍率 --zoom-k 排版，
// 再縮小 1/k 放回螢幕，並獨立成一個合成圖層：推進到底時兩個倍率抵消，文字以實際大小繪製。
// 外觀與原型相同，所有 cqw 尺寸都乘上 k，再整體縮小 1/k。
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
    <div class="hi">
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
.hi {
  --k: var(--zoom-k, 1);
  position: absolute;
  left: 0;
  top: 0;
  width: calc(100% * var(--k));
  height: calc(100% * var(--k));
  transform-origin: 0 0;
  /* translateZ 讓它成為獨立圖層，以自身（放大後）的尺寸繪製 */
  transform: scale(calc(1 / var(--k))) translateZ(0);
}
.mini {
  position: absolute;
  left: 33%;
  right: 5%;
  top: 14%;
  bottom: 8%;
  display: flex;
  flex-direction: column;
  gap: calc(.45cqw * var(--k));
  color: #2A2521;
}
.mini-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 700 calc(.5cqw * var(--k)) var(--font-num);
  letter-spacing: .12em;
  color: #6A5F57;
}
.mini h3 {
  margin: 0;
  font-weight: 900;
  font-size: calc(1.25cqw * var(--k));
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
  gap: calc(.6cqw * var(--k));
  align-items: baseline;
  padding: calc(.32cqw * var(--k)) 0;
  border-top: calc(.06cqw * var(--k)) solid #D9CDBE;
  font-size: calc(.62cqw * var(--k));
  font-weight: 700;
}
.mini li span {
  font-family: var(--font-num);
  color: #456A9E;
  font-size: calc(.55cqw * var(--k));
}
</style>
