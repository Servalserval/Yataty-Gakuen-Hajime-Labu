# 轟はじめ生誕祭應援網站 維護手冊

## 資料夾結構

```
├── index.html          版面＋程式（平常不用動）
├── README.md           本說明
├── images/             全站共用圖片（hero fanart、OG 圖）
└── data/
    ├── site.json       全站設定：hero、公告、分類、頁尾
    └── projects/
        ├── _list.json  企劃清單（網頁依此載入企劃）
        └── <企劃ID>/    一個企劃 = 一個資料夾
            ├── project.json   企劃資料
            └── cover.jpg      企劃封面圖（檔名可自訂，要跟 json 一致）
```

## 新增一個企劃（3 步驟）

1. 複製任一現有企劃資料夾，改名（建議格式 `年份-企劃名`，例如 `2027-netprint`，**只用英數和連字號**）
2. 編輯裡面的 `project.json`，換掉封面圖 `cover.jpg`
3. 打開 `data/projects/_list.json`，把新資料夾名加進清單：
   ```json
   ["2026-station-ad", "2026-netprint", "2027-netprint"]
   ```

完成。**不需要決定它是進行中還是過去**——網頁會看 `end` 日期自動分類，過期自動進「過去的企劃」。

## project.json 欄位說明

| 欄位 | 說明 |
|---|---|
| `cat` | 分類代號：`ad` / `netprint` / `yosegaki` / `postcard`（要加新分類去 site.json 的 categories） |
| `name` / `desc` | 標題與說明，雙語寫法 `{ "zh": "...", "ja": "..." }`，只寫一個字串也可以 |
| `start` / `end` | 起訖日 `"YYYY-MM-DD"`；長期企劃 `end` 填 `null` |
| `cover` | 封面圖檔名（放在同一個資料夾）；沒有圖填 `null` |
| `hashtags` | 例：`["#はじめ生誕祭2026"]`，會自動連到 X 搜尋 |
| `links` | 按鈕連結，例：報名表單、告知推文、地圖 |

## 改公告 / Hero / 頁尾

都在 `data/site.json`：
- 公告 → `news`（新的放最上面）
- 生日日期、fanart、hashtag → `hero`
- 免責聲明、社群連結 → `footer`

Hero 的 fanart：把圖放進 `images/`，在 `site.json` 的 `hero.fanart` 填路徑與繪師名／連結。**務必先取得繪師同意。**

## ⚠️ JSON 的常見地雷

- **不能寫註解**（`//` 會整個壞掉）
- 最後一項後面**不能多逗號**
- 字串一定要用**雙引號** `"`
- 改完不確定有沒有壞，貼到 https://jsonlint.com 檢查，或用 VS Code 開（會畫紅線）

## 本機預覽

直接雙擊 index.html **看不到內容**（瀏覽器擋 fetch），請在資料夾開終端機執行：

```
python3 -m http.server
```

然後瀏覽器開 http://localhost:8000 。部署上線後沒有這個問題。

## 部署與日常更新（GitHub + Cloudflare Pages）

1. 把整個資料夾推上 GitHub repo
2. Cloudflare Pages → Create project → 連結該 repo →（無 build 設定，直接部署）
3. 之後更新內容：在 github.com 網頁上直接編輯 JSON → Commit → 一兩分鐘後自動上線
4. 新增企劃的圖片：在 repo 對應資料夾用「Add file → Upload files」上傳

## 上線前檢查清單

- [ ] 換掉所有「範例／サンプル」資料（4 個範例企劃）
- [ ] Hero fanart 已取得繪師授權、署名正確
- [ ] `images/og-cover.png` 換成自己的分享預覽圖
- [ ] 確認轟はじめ官方 X / YouTube 連結正確
- [ ] 圖片壓縮過（建議 squoosh.app，封面 < 500KB）
- [ ] 對照 COVER 二次創作規範（特別注意金流相關規定）
