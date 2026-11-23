---
title: 離海 5min 活動住宿官網
order: 2
period: 2025.12 – 現在
role: 前端，從零建置
stack: Nuxt 4 · TypeScript · Nuxt Image
focus: SSR · SEO · 效能 · CI
tags: Nuxt 4 · SSR · SEO
summary: 重新設計 SSR 首屏載入策略；中文字型載入量由約 9.3 MB 降到約 300 KB。
lead: 墾丁水上活動業者的活動與住宿官網。我用 Nuxt 4 從零建置，並把首頁的載入體驗重新整理過一輪。
cover: ''
coverPlaceholder: '[待放：5min 首頁截圖]'
---

## 專案是什麼

離海是墾丁的水上活動業者。官網讓旅客瀏覽活動與住宿方案，同時是業者在搜尋引擎上被找到的主要入口，所以載入速度和 SEO 都很重要。

## 我的角色

前端由我從零建置：用 Nuxt 4 + TypeScript 建立專案，開發前台與後台頁面，負責 SSR、SEO、效能，以及部署流程。

## 我做了什麼

- **前後台頁面**以 Nuxt 4 的 SSR 輸出頁面內容，讓搜尋引擎和使用者第一時間就拿到完整的 HTML。
- **SEO 基礎建設**建置動態 Sitemap、依環境設定 robots 與是否允許收錄，並完成 Google Search Console 設定。
- **效能最佳化**重新設計首屏圖片的載入策略，搭配 Nuxt Image、WebP、字型分塊與快取設定。
- **自動化建置**用 GitHub Actions 建立測試環境的自動建置，並產出部署用的 `.output`。

## 一個技術挑戰：首頁主圖載入太慢

::case-challenge{label="問題"}
首頁的主圖出現得很慢。分析 Lighthouse 報告後發現，主圖被 `<ClientOnly>` 包住，沒有出現在伺服器輸出的 HTML 裡，瀏覽器要等 JavaScript 執行完才開始下載這張圖。
::

::case-challenge{label="做法"}
把主圖移出 `<ClientOnly>`，改為直接載入並提高下載優先權（eager loading、fetchpriority），在 head 預先載入，並依螢幕寬度提供不同尺寸的圖片。
::

::case-challenge{label="另一個發現"}
中文字型檔案很大，整包載入會拖慢頁面。改成字型分塊，只載入頁面實際用到的字，並設定快取。
::

## 成果

::case-result
---
bars:
  - label: 中文字型載入量（優化前）
    value: 約 9.3 MB
    width: 100
  - label: 中文字型載入量（優化後）
    value: 約 300 KB
    width: 3.2
    accent: true
---
字型載入量減少約 97%。主圖改由伺服器直接輸出，不必等 JavaScript 執行完才開始下載。
::

## 截圖或錄影

::case-media{caption="首頁到活動頁的瀏覽流程。"}
\[待放：5min 首頁操作錄影，需先取得公司與客戶同意\]
::
