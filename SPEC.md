# 奕潔作品集：Nuxt 4 開發規格

這份文件是把原型（`reference/index.html`、`reference/case-5min.html`）改寫成 Nuxt 4 正式專案的規格。原型已經在瀏覽器驗證過，**行為、數值、座標以原型為準**；規格與原型不一致時，先問我（奕潔）。

## 0. 原則

- 內容只寫我實際做過的事。專案名稱、角色、成果都以 `content/` 裡的文字為準，不要自行補充或誇大。
- 公司專案的截圖與錄影在取得同意前一律用佔位框，不要放任何真實畫面。
- 不寫 Lighthouse 分數（會浮動）。可寫「字型載入量約 9.3 MB 降到約 300 KB」。
- 每完成一個階段，跑 `npm run lint`、`npm run typecheck`、`npm run generate` 都要通過，再請我驗收。

## 1. 技術選擇

| 項目 | 選擇 |
| --- | --- |
| 框架 | Nuxt 4 + TypeScript，`ssr: true`，以 `nuxi generate` 輸出靜態網站 |
| 內容 | `@nuxt/content`（每個專案一個 Markdown 檔） |
| 圖片 | `@nuxt/image`（場景圖已是 WebP，主要用於案例頁截圖） |
| 樣式 | 一般 CSS（scoped + 少量全域變數），不另外加 UI 框架 |
| 動畫 | 先用原型的手寫捲動計算；第 4 階段再評估換成 GSAP ScrollTrigger |
| 部署 | Cloudflare Pages（建置指令 `npx nuxi generate`，輸出 `.output/public`） |
| CI | GitHub Actions：lint、typecheck、generate |

## 2. 專案結構

```
app/
  pages/
    index.vue                 # 首頁：開場場景 + 作品列表 + 關於我
    works/[slug].vue          # 案例頁
  components/
    hero/StoryStage.vue       # 黏住畫面的舞台、捲動時間軸、鑽進螢幕
    hero/SceneLayers.vue      # 早上／白天／轉頭圖層與遮罩層
    hero/SceneHotspot.vue     # 可互動物件（提示點、tooltip）
    hero/ScreenCode.vue       # 左螢幕打字程式碼
    hero/ScreenWorks.vue      # 右螢幕作品清單
    hero/TabletScreen.vue     # 平板畫面（四點透視貼合）
    hero/CatHearts.vue        # 點貓冒黏土愛心
    works/WorksList.vue
    about/NightScene.vue
    about/AboutIntro.vue
    about/Strengths.vue
    about/ContactBlock.vue
  composables/
    useScrollProgress.ts      # 回傳 0–1 的故事進度
    useTheme.ts               # 檯燈 = 深色模式，記住選擇（localStorage + try/catch）
    useQuadTransform.ts       # 四點透視 matrix3d
content/
  works/scheduler.md  5min.md  t-mamori.md  woodball.md
public/
  scene/                      # assets/scene 的 WebP 全部放這
.github/workflows/ci.yml
```

## 3. 開場場景（以原型為準）

### 3.1 圖層（由下到上）

場景是 1536×1024 的 3:2 圖片。容器寬度 `max(100vw, 150vh)`，置中；手機（`max-aspect-ratio: 1/1`）時寬度 `100vw`。

1. 左螢幕（程式碼）：left 23.4375%、top 32.031%、width 26.693%、height 22.070%
2. 右螢幕（作品清單）：left 49.870%、top 32.031%、width 26.432%、height 22.070%
3. `morning.webp` + `hole_morning.webp`（同一組）
4. `day.webp` + `hole_day.webp`（同一組，opacity 由捲動控制）
5. `turn.webp`（白天轉頭）、`turn_morning.webp`（早上轉頭）
6. `cat.webp`（left 5.208%、top 32.031%、width 17.253%、height 16.016%，呼吸動畫）
7. `lamp_night.webp`（left 76.823%、top 41.016%、width 23.177%、height 42.969%，只在深色模式出現）
8. 平板畫面（見 3.4）
9. 可互動物件

場景圖的螢幕已去背成透明，所以 1、2 會從底下透出來。`hole_*` 是「背影頭髮擋在螢幕前」的那一小塊，轉頭時和轉頭圖同步淡出，避免頭髮殘影。

### 3.2 捲動時間軸

故事區塊高度 460vh，舞台 `position: sticky`。進度 p = 已捲動距離 ÷（區塊高 − 視窗高），範圍 0–1。

| p 區間 | 效果 |
| --- | --- |
| 0.02–0.08 | 「往下捲」提示淡出 |
| 0.06–0.16 | 早上標題淡出 |
| 0.12–0.28 | 白天圖層淡入（ease in-out cubic）；過半後時段切為 day |
| 0.20–0.28 淡入、0.44–0.50 淡出 | 白天標題 |
| 0.48–0.94 | 鏡頭推進右螢幕（ease in-out cubic） |
| 0.90–0.99 | 全畫面遮罩淡入，接到作品區 |

鏡頭推進：焦點 Px = 0.672 × 場景寬、Py = 0.4312 × 場景高；最終倍率 S = max(1.08 × 視窗寬 × 1536 ÷ (282 × 場景寬), 1.08 × 視窗高 × 1024 ÷ (213 × 場景高), 1.5)；每一幀倍率 = S^z，位置從焦點線性移到視窗中心。細節照原型 `frame()`。

標題放在舞台上（不是場景裡），固定在導覽列下方，避免寬矮視窗被裁切。

### 3.3 互動

| 物件 | 熱區（left/top/width/height %） | 行為 |
| --- | --- | --- |
| 人物 | 39.06 / 24.9 / 21.5 / 72 | hover：0.25 秒淡入轉頭圖（依時段選早上或白天），hole 層淡出，游標旁出現「關於我 →」；點擊跳到關於我。觸控裝置第一次點先轉頭 |
| 貓 | 5.5 / 30 / 16.6 / 17.4 | 點擊冒 5 顆 `heart.webp`，貓輕微晃動。沒有 hover 文字 |
| 平板 | 3.9 / 52.2 / 16.6 / 19.6 | 預設：早上關、白天開；點擊切換。tooltip「點一下打開平板。」／「點一下關掉平板。」 |
| 機器人 | 85.6 / 31.7 / 7.4 / 14.6 | tooltip「AI 協作夥伴：規格我寫，程式一起寫。」 |
| 檯燈 | 83.5 / 45.1 / 14.1 / 25.4 | 切換深色模式（見 3.5） |
| 右螢幕 | 57.6 / 32.2 / 18.7 / 22 | 點擊跳到作品區 |

每個熱區有一顆呼吸的小提示點，滑過或點過後消失。熱區都是 `<button>`，鍵盤可操作；焦點框只在 `:focus-visible` 顯示。

### 3.4 平板畫面（四點透視）

平板畫面是 400×260 的容器，內容為 `tab_ui.webp`（滿版、不加 padding），整個容器套用同一個 `matrix3d`，選取框與控制點都在圖裡，一起變形。四個角（場景圖座標，順序：左上、右上、右下、左下）：

- 白天：`[78.4,574.9] [271.7,551.3] [303.7,687.0] [110.4,718.7]`
- 早上：`[79.1,568.7] [266.7,547.1] [302.7,682.8] [117.0,712.8]`

這兩組是沿螢幕內緣取樣擬合出來的，不要目測調整。時段切換時重新套用。矩陣公式照原型 `fitQuad()`。

### 3.5 深色模式（檯燈）

- 不換成晚上那張圖，而是保留當下時段，用 SVG 濾鏡把房間調暗偏藍：先 `feColorMatrix`（去飽和 0.2 後乘以 RGB 增益），再 `feComponentTransfer` gamma。
  - 白天：增益 (0.34, 0.38, 0.62)，gamma 1.25，amplitude 1.35
  - 早上：增益 (0.28, 0.33, 0.62)，gamma 1.3，amplitude 1.35
- 疊上 `lamp_night.webp` 作為檯燈光。
- 早上標題改為「早安，天還沒亮。我是奕潔。」
- 記住使用者選擇；首次造訪跟隨 `prefers-color-scheme`。

### 3.6 其他

- `prefers-reduced-motion: reduce`：不做 sticky 捲動與推進，直接顯示白天場景與標題。
- 轉頭圖在載入時先 `decode()`，第一次 hover 不卡。
- 右下角「跳過開場」連到作品區。

## 4. 作品區與案例頁

- 首頁作品列表：編號、名稱、一句成果、技術與年份、預覽（佔位）。每列連到 `/works/[slug]`。
- 案例頁固定六段：專案是什麼、我的角色、我做了什麼、一個技術挑戰、成果、截圖或錄影。版型照 `reference/case-5min.html`。
- `content/works/*.md` 的 front matter：`title`、`order`、`period`、`role`、`stack`、`summary`、`cover`（可空）。內文用上述六段標題。
- 5min 的內容直接從 `reference/case-5min.html` 搬。其他三個專案先建檔，內文留 `TODO`，由我補。

## 5. 晚上場景與關於我

- 晚上場景用 `night.webp`（兩台螢幕與平板內容已畫在圖裡，不需疊加）。
- 標題「關於我」，副標「今天的程式推上去了，伸個懶腰，來認識一下我吧。」放在左上，寬度約 31%，避開手臂。
- 之後依序是：一個人的前端團隊（三點）、我擅長（小卡）、聯絡。文字照原型。

## 6. SEO 與分享

- 每頁 `useSeoMeta`：title、description、og:image（用白天場景裁切的 1200×630 圖）。
- `nuxt.config` 設定 `app.head.htmlAttrs.lang = 'zh-Hant'`。
- 產生 sitemap（可用 `@nuxtjs/sitemap`）。

## 7. CI（`.github/workflows/ci.yml`）

推到 main 或開 PR 時：`npm ci` → `npm run lint` → `npm run typecheck` → `npm run generate`。

## 8. 開發階段與完成標準

| 階段 | 內容 | 完成標準 |
| --- | --- | --- |
| 1 | 建立 Nuxt 4 專案、ESLint、CI、首頁空殼；推上 GitHub 並接上 Cloudflare Pages | 網址打得開，CI 綠燈 |
| 2 | 搬開場場景（3.1–3.3） | 捲動與互動和原型一致，桌機與手機都測過 |
| 3 | 平板透視與深色模式（3.4–3.5） | 早上、白天開關平板都貼合螢幕內緣；深色模式色調與原型一致 |
| 4 | 作品列表與案例頁（第 4 節） | 5min 案例頁完整；其他三頁有骨架 |
| 5 | 晚上場景、關於我、聯絡（第 5 節） | 文字與原型一致 |
| 6 | SEO、無障礙、效能檢查、評估 GSAP | 鍵盤可操作；reduced motion 正常；首頁圖片總量盡量小 |

## 9. 待我（奕潔）提供

- Email、GitHub 連結、履歷 PDF
- 其他三個專案的技術挑戰與內容
- 截圖與錄影（取得公司同意後）
