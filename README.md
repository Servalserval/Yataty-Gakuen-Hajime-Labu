# やたてぃ学園はじめラ部 應援網站 — 維護手冊

## 資料夾結構

```
├── index.html          首頁（Hero、公告、企劃）
├── posts.html          活動貼文頁
├── staff.html          人員名單頁
├── README.md           本說明
├── assets/             ★ 程式與樣式（平常不用動）
│   ├── style.css         全站樣式（改配色在這檔最上面的 :root）
│   ├── common.js         共用：導覽列、頁尾、語言、燈箱、介面文字
│   ├── home.js           首頁程式
│   ├── posts.js          貼文頁程式
│   └── staff.js          人員頁程式
├── images/             共用圖片
│   ├── hero-fanart.jpg   首頁主視覺
│   ├── og-cover.png      分享預覽圖
│   ├── posts/            貼文用圖
│   └── staff/            人員頭像
└── data/               ★ 所有內容（平常只改這裡）
    ├── site.json         全站：Hero、公告、分類、頁尾
    ├── posts.json        活動貼文清單
    ├── staff.json        人員名單
    └── projects/
        ├── _list.json    企劃清單
        └── <企劃ID>/      一個企劃一個資料夾（project.json + 圖片）
```

## 平常會做的事

### 改公告 / Hero / 頁尾 → `data/site.json`
- 公告：`news`（新的放最上面）
- 生日日期、主視覺 fanart、hashtag：`hero`
- 免責聲明、社群連結：`footer`

### 新增一個企劃（首頁「進行中的企劃」）
1. 複製 `data/projects/` 內任一資料夾，改名（建議 `年份-名稱`，只用英數和連字號）
2. 編輯裡面的 `project.json`，放入圖片
3. 到 `data/projects/_list.json` 把新資料夾名加進清單

**不用管它是進行中還是過去** —— 程式會看 `end` 日期自動分類，過期自動歸檔（以日本時間為準）。

企劃圖片有兩種寫法：
- 單張封面：`"cover": "cover.jpg"`
- 多張循環播放：`"images": ["a.jpg", "b.jpg", "c.jpg"]`（卡片內會自動輪播，點圖可放大）

說明文字 `desc` 預設只顯示 3 行，太長會自動出現「展開更多」。想改行數：`assets/style.css` 搜尋 `-webkit-line-clamp: 3`。

### 新增一則活動貼文 → `data/posts.json`
複製一個 `{ ... }` 區塊：
```json
{
  "url": "推文網址（必填，查看原文會連到這）",
  "date": "2026-05-10",
  "author": "@massugumi_babu",
  "image": "images/posts/post-1.jpg",   // 沒有圖就刪掉這行
  "text": { "zh": "中文摘要", "ja": "日文摘要" }
}
```
> ⚠️ 純靜態網站無法自動抓取 X 的內文，所以 `text` 和 `image` 要自己填／自己截圖上傳。
> 圖片放進 `images/posts/`。新的貼文（date 較新）會自動排前面。

### 新增 / 修改人員 → `data/staff.json`
分三區：`illustrators`(繪師) / `designers`(設計師) / `members`(成員)。每個人：
```json
{ "name": "名字", "handle": "@帳號", "image": "images/staff/xxx.jpg", "url": "https://x.com/xxx" }
```
頭像放進 `images/staff/`，建議正方形。某一區留空陣列 `[]` 就不會顯示該區塊。

## ⚠️ JSON 常見地雷
- 不能寫註解（`//` 會壞）
- 最後一項後面不能多逗號
- 字串一定用雙引號 `"`
- 改完貼到 https://jsonlint.com 檢查，或用 VS Code 開會自動標紅
- 某個企劃／貼文壞了不會讓整站掛掉，只會略過那一筆；按 F12 看 Console 會告訴你是哪個檔

## 三語（中／日／英）
要顯示給訪客的文字寫成 `{ "zh": "中文", "ja": "日本語", "en": "English" }`；只填一部分也不會壞（缺的語言會自動退回中文）。導覽列右上的語言鈕按一下循環切換 中文 → 日本語 → English → 中文。導覽列、按鈕等介面用字在 `assets/common.js` 的 `STRINGS`（zh / ja / en 三組）。
> 人員名單的 `name` 是純字串（人名不翻譯），三種語言都顯示同一個。

## 本機預覽
直接雙擊開網頁**看不到內容**（瀏覽器擋資料載入）。在資料夾開終端機：
```
python3 -m http.server
```
再開 http://localhost:8000 。部署上線後沒這問題。

## 部署（GitHub + Cloudflare Pages）
1. 整個資料夾推上 GitHub repo
2. Cloudflare Pages → Connect to Git → 選 repo → Framework 選 None、Build 設定留空 → 部署
3. 拿到網址後，把三個 HTML 開頭的 `og:url`、`og:image` 裡的 `你的網域.pages.dev` 換成真網址（影響轉推預覽圖）
4. 之後更新：在 github.com 直接編輯 JSON → Commit → 自動重新部署

## 上線前檢查
- [ ] 替換所有「範例／サンプル」資料
- [ ] Hero fanart 與貼文圖、人員頭像都已取得授權、署名正確
- [ ] 三個 HTML 的 og 網址換成正式網域
- [ ] `images/og-cover.png` 換成自己的分享圖
- [ ] 圖片壓縮（squoosh.app，建議 < 500KB）
- [ ] 對照 COVER 二次創作規範（特別是金流相關）
