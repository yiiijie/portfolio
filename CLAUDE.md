# CLAUDE.md

這是奕潔的個人作品集（Nuxt 4 + TypeScript，靜態輸出，部署在 Cloudflare Pages）。

- 開發規格在 `SPEC.md`，原型在 `reference/`。行為、數值與座標以原型為準，有疑問先問我。
- 一次只做 `SPEC.md` 第 8 節的一個階段，做完跑 `npm run lint`、`npm run typecheck`、`npm run generate`，全部通過再請我驗收。
- 內容只寫我實際做過的事，不要補充或誇大；不寫 Lighthouse 分數。
- 公司專案的截圖與錄影在我確認前一律用佔位框。
- 分支：不要直接改或推到 `main`。每個階段開一條分支（例如 `stage-1-setup`、`stage-2-hero`），完成並通過檢查後開 Pull Request 到 `main`，由我確認後合併。`main` 是 Cloudflare Pages 的正式版本。
- 回覆使用繁體中文。
