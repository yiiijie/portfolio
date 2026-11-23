# portfolio-kit 使用方式

1. 在 GitHub 個人帳號建立空的 repo（例如 `portfolio`），clone 到電腦。
2. 把這個資料夾裡的所有東西複製到 repo 根目錄。
3. 在 repo 資料夾開啟 Claude Code，輸入：

   > 請讀 CLAUDE.md 和 SPEC.md，從第 1 階段開始做。先建立 Nuxt 4 專案，把 assets/scene 的圖片搬到 public/scene，做完第 1 階段後停下來給我驗收。

4. 第 1 階段推上 GitHub 後，到 Cloudflare Pages 連結這個 repo：
   - 建置指令：`npx nuxi generate`
   - 輸出資料夾：`.output/public`

## 資料夾內容

- `SPEC.md`：開發規格
- `CLAUDE.md`：給 Claude Code 的專案規則
- `reference/`：已驗證的原型（瀏覽器直接打開 index.html 需要經過本機伺服器，例如 `npx serve reference`）
- `assets/scene/`：網頁用的場景圖（WebP）
- `assets/source/`：原始 PNG 與去背、合成用的 Python 腳本（換圖時使用）
