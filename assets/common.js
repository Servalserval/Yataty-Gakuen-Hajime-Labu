/* ============================================================
   やたてぃ学園はじめラ部 應援網站 — 共用程式
   三個頁面共用。提供：
     - 多語字串 STRINGS（介面固定文字）
     - 語言狀態與切換
     - 共用導覽列、頁尾的產生
     - 燈箱（點圖放大）
     - 小工具 el / t / s / fetchJSON
   ★ 內容性文字請改 data/ 裡的 JSON，不要改這裡。
   ★ 介面用字（按鈕、選單名）想調整措辭，改下面 STRINGS。
   ============================================================ */

/* ---------- 導覽列項目（三頁共用） ----------
   href 用「頁面檔名 + 錨點」，這樣在任何頁面點選都能正確跳轉。 */
const NAV = [
  { key: "nav_home",     href: "index.html" },
  { key: "nav_countdown", href: "countdown.html" },
  { key: "nav_ongoing",  href: "ongoing.html" },
  { key: "nav_timeline", href: "timeline.html" },
  { key: "nav_posts",    href: "posts.html" },
  { key: "nav_fanart",   href: "fanart.html" },
  { key: "nav_staff",    href: "staff.html" },
  { key: "nav_about",    href: "about.html" },
];

/* ---------- 語言下拉選單的選項 ----------
   key 是語言代碼（也用在 JSON 的多語欄位、localStorage），
   name 是選單裡顯示的文字（各語言用自己的稱呼，這是業界慣例）。
   ★ 想新增語言：這裡加一筆 + 下面 STRINGS 加一組同代碼的字串。 */
const LANGS = [
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "en", name: "English" },
];

/* ---------- 介面固定文字 ---------- */
const STRINGS = {
  zh: {
    nav_home: "首頁", nav_ongoing: "進行中的企劃", nav_posts: "活動貼文",
    nav_staff: "人員名單", nav_about: "關於我們",
    hero_title: "やたてぃ学園\nはじめラ部",
    sec_news: "最新公告", sec_ongoing: "進行中的企劃", sec_past: "過去的企劃",
    sec_posts: "活動貼文", sec_staff: "人員名單", sec_about: "關於我們",
    about_subtitle: "認識やたてぃ学園はじめラ部",
    nav_fanart: "ファンアート", nav_timeline: "年表",
    sec_fanart: "ファンアート", fanart_subtitle: "粉絲為はじめ繪製的賀圖（皆經繪師同意刊載）",
    fanart_view: "繪師的貼文",
    sec_timeline: "活動年表", timeline_subtitle: "歷年企劃一覽",
    add_calendar: "加入行事曆", birthday_title: "轟はじめ 生日",
    countdown_title: "到生日還有多久", ongoing_subtitle: "目前正在進行的應援企劃",
    nav_countdown: "倒數", sec_countdown: "倒數計時", countdown_subtitle: "距離各個重要日子還有多久", countdown_today: "就是今天！",
    timeline_empty: "尚無活動紀錄。",
    visitors: "訪客數", privacy_policy: "隱私權政策",
    sec_privacy: "隱私權政策", privacy_subtitle: "本網站如何處理你的資訊",
    badge_ongoing: "進行中⚡", badge_past: "已結束",
    period: "期間：", longterm: "長期進行中", longterm_suffix: "（長期）",
    empty_ongoing: "目前沒有進行中的企劃，新企劃籌備中，敬請期待！",
    empty_posts: "目前還沒有貼文。",
    cd_label: "距離はじめ的生日還有", cd_d: "天", cd_h: "時", cd_m: "分", cd_s: "秒",
    expand_more: "展開更多", expand_less: "收合",
    post_original: "查看原文",
    staff_illustrators: "繪師", staff_designers: "設計師", staff_members: "成員",
    posts_subtitle: "整理本部的相關推文與活動紀錄",
    staff_subtitle: "やたてぃ学園はじめラ部 的夥伴們",
    ft_about: "關於本企劃", ft_links: "相關連結", ft_quick: "快速連結",
    html_lang: "zh-Hant",
    load_error_title: "內容載入失敗",
    load_error_body: "若你是直接雙擊開啟網頁，瀏覽器安全限制會擋下資料載入。請在資料夾執行 python3 -m http.server 後開 http://localhost:8000 預覽；部署上線後不會有此問題。也請檢查 data/ 內的 JSON 格式（缺逗號、多逗號都會失敗）。",
  },
  ja: {
    nav_home: "ホーム", nav_ongoing: "実施中の企画", nav_posts: "活動ポスト",
    nav_staff: "メンバー", nav_about: "私たちについて",
    hero_title: "やたてぃ学園\nはじめラ部",
    sec_news: "お知らせ", sec_ongoing: "実施中の企画", sec_past: "過去の企画",
    sec_posts: "活動ポスト", sec_staff: "メンバー", sec_about: "私たちについて",
    about_subtitle: "やたてぃ学園はじめラ部 について",
    nav_fanart: "ファンアート", nav_timeline: "年表",
    sec_fanart: "ファンアート", fanart_subtitle: "ファンが描いたはじめへのイラスト（すべて作者の許可を得て掲載）",
    fanart_view: "作者の投稿",
    sec_timeline: "活動年表", timeline_subtitle: "これまでの企画一覧",
    add_calendar: "カレンダーに追加", birthday_title: "轟はじめ お誕生日",
    countdown_title: "誕生日まであと", ongoing_subtitle: "現在実施中の応援企画",
    nav_countdown: "カウントダウン", sec_countdown: "カウントダウン", countdown_subtitle: "大切な日まであと", countdown_today: "本日！",
    timeline_empty: "活動記録はまだありません。",
    visitors: "来訪者数", privacy_policy: "プライバシーポリシー",
    sec_privacy: "プライバシーポリシー", privacy_subtitle: "当サイトにおける情報の取り扱いについて",
    badge_ongoing: "実施中⚡", badge_past: "終了",
    period: "期間：", longterm: "常時実施中", longterm_suffix: "（常設）",
    empty_ongoing: "現在実施中の企画はありません。新企画を準備中です。お楽しみに！",
    empty_posts: "まだ投稿はありません。",
    cd_label: "はじめの誕生日まで", cd_d: "日", cd_h: "時間", cd_m: "分", cd_s: "秒",
    expand_more: "もっと見る", expand_less: "閉じる",
    post_original: "原文を見る",
    staff_illustrators: "イラストレーター", staff_designers: "デザイナー", staff_members: "メンバー",
    posts_subtitle: "本部に関するポストと活動記録をまとめています",
    staff_subtitle: "やたてぃ学園はじめラ部 の仲間たち",
    ft_about: "本企画について", ft_links: "リンク", ft_quick: "クイックリンク",
    html_lang: "ja",
    load_error_title: "コンテンツの読み込みに失敗しました",
    load_error_body: "ファイルを直接開くとブラウザのセキュリティ制限で読み込めません。フォルダ内で python3 -m http.server を実行し http://localhost:8000 を開いてください。デプロイ後は問題なく表示されます。",
  },
  en: {
    nav_home: "Home", nav_ongoing: "Ongoing", nav_posts: "Posts",
    nav_staff: "Members", nav_about: "About",
    hero_title: "Yataty Gakuen\nHajime Rabu",
    sec_news: "News", sec_ongoing: "Ongoing Projects", sec_past: "Past Projects",
    sec_posts: "Activity Posts", sec_staff: "Members", sec_about: "About Us",
    about_subtitle: "About Yataty Gakuen Hajime Rabu",
    nav_fanart: "Fan Art", nav_timeline: "Timeline",
    sec_fanart: "Fan Art", fanart_subtitle: "Birthday art for Hajime by fans (posted with each artist's permission)",
    fanart_view: "Artist's post",
    sec_timeline: "Activity Timeline", timeline_subtitle: "A look back at past projects",
    add_calendar: "Add to calendar", birthday_title: "Todoroki Hajime's Birthday",
    countdown_title: "Countdown to Birthday", ongoing_subtitle: "Support projects happening now",
    nav_countdown: "Countdown", sec_countdown: "Countdown", countdown_subtitle: "Countdowns to important days", countdown_today: "Today!",
    timeline_empty: "No activity records yet.",
    visitors: "Visitors", privacy_policy: "Privacy Policy",
    sec_privacy: "Privacy Policy", privacy_subtitle: "How this site handles your information",
    badge_ongoing: "ONGOING⚡", badge_past: "ENDED",
    period: "Period: ", longterm: "Ongoing", longterm_suffix: " ~ (ongoing)",
    empty_ongoing: "No ongoing projects right now. New projects are in the works — stay tuned!",
    empty_posts: "No posts yet.",
    cd_label: "Until Hajime's birthday", cd_d: "days", cd_h: "hrs", cd_m: "min", cd_s: "sec",
    expand_more: "Read more", expand_less: "Show less",
    post_original: "View original",
    staff_illustrators: "Illustrators", staff_designers: "Designers", staff_members: "Members",
    posts_subtitle: "Posts and activity records from our group",
    staff_subtitle: "The members of Yataty Gakuen Hajime Rabu",
    ft_about: "About this project", ft_links: "Links", ft_quick: "Quick links",
    html_lang: "en",
    load_error_title: "Failed to load content",
    load_error_body: "If you opened this file directly, the browser's security policy blocks data loading. Run python3 -m http.server in the folder and open http://localhost:8000 to preview. This is not an issue once deployed online. Also check that the JSON files under data/ are valid (a missing or extra comma will break them).",
  },
};

/* ============================================================
   Site：全站共用的小框架
   每個頁面呼叫 Site.init({...}) 啟動。
   ============================================================ */
const Site = {
  lang: "ja",      // 預設語言（訪客第一次來看到的語言）。可改 "zh" / "ja" / "en"
  SITE: null,      // data/site.json
  page: "",        // 目前頁面，用來標示導覽列 active
  _render: null,   // 頁面自己的渲染函式（切語言時會重跑）

  /* ---- 語言記憶 ---- */
  saveLang(l) { try { localStorage.setItem("site-lang", l); } catch (e) {} },
  loadLang()  { try { return localStorage.getItem("site-lang"); } catch (e) { return null; } },

  /** 啟動：載入 site.json → 畫導覽列／頁尾 → 跑頁面渲染 */
  async init({ page, render }) {
    this.page = page || "";
    this._render = render || (() => {});

    const saved = this.loadLang();
    if (saved === "zh" || saved === "ja" || saved === "en") this.lang = saved;

    try {
      this.SITE = await fetchJSON("data/site.json");
    } catch (err) {
      showLoadError(err);
      return;
    }

    this.renderHeader();
    this.renderFooter();
    this._render();
  },

  /** 切換語言時：導覽列、頁尾、頁面內容全部重畫 */
  rerenderAll() {
    document.documentElement.lang = s("html_lang");
    this.renderHeader();
    this.renderFooter();
    this._render();
  },

  /** 產生頂部導覽列並插到 body 最前面 */
  renderHeader() {
    document.documentElement.lang = s("html_lang");
    const old = document.querySelector("header");
    if (old) old.remove();

    const header = el("header");
    const inner = el("div", { class: "nav-inner" });

    const logo = el("a", { class: "nav-logo", href: "index.html" });
    logo.append("やたてぃ学園はじめラ部");
    logo.append(el("span", { class: "bolt" }, "⚡"));

    const right = el("div", { class: "nav-right" });
    const navEl = el("nav");
    const ul = el("ul", { id: "nav-menu" });
    NAV.forEach(item => {
      const li = el("li");
      const a = el("a", { href: item.href }, s(item.key));
      // 標示目前所在頁面
      if (item.href.split("#")[0] === this.page) a.classList.add("active");
      li.append(a);
      ul.append(li);
    });
    navEl.append(ul);

    // 語言下拉選單
    const langSel = el("select", { class: "lang-select", id: "lang-select", "aria-label": "Language / 語言 / 言語" });
    LANGS.forEach(l => langSel.append(el("option", { value: l.code }, l.name)));
    langSel.value = this.lang;                       // 顯示目前語言
    langSel.addEventListener("change", e => {        // 選了就切換
      this.lang = e.target.value;
      this.saveLang(this.lang);
      this.rerenderAll();
    });

    const toggle = el("button", { class: "nav-toggle", "aria-label": "Menu", "aria-expanded": "false" }, "☰");

    right.append(navEl, langSel, toggle);
    inner.append(logo, right);
    header.append(inner);
    document.body.prepend(header);

    // 漢堡選單
    toggle.addEventListener("click", () => {
      const open = ul.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    ul.addEventListener("click", e => {
      if (e.target.tagName === "A") {
        ul.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  },

  /** 產生頁尾並插到 body 最後面 */
  renderFooter() {
    const old = document.querySelector("footer");
    if (old) old.remove();
    const f = this.SITE.footer;

    const footer = el("footer");
    const container = el("div", { class: "container" });
    const grid = el("div", { class: "footer-grid" });

    const col1 = el("div");
    col1.append(el("h3", {}, s("ft_about")));
    col1.append(el("p", {}, t(f.disclaimer)));

    const col2 = el("div");
    col2.append(el("h3", {}, s("ft_links")));
    const ul2 = el("ul");
    (f.socials ?? []).forEach(so => {
      const li = el("li");
      li.append(el("a", { href: so.url, target: "_blank", rel: "noopener" }, t(so.label)));
      ul2.append(li);
    });
    col2.append(ul2);

    const col3 = el("div");
    col3.append(el("h3", {}, s("ft_quick")));
    const ul3 = el("ul");
    NAV.forEach(item => {
      const li = el("li");
      li.append(el("a", { href: item.href }, s(item.key)));
      ul3.append(li);
    });
    col3.append(ul3);

    grid.append(col1, col2, col3);
    container.append(grid);

    // 底部列：左＝訪客數、中＝版權、右＝隱私權政策
    const bottom = el("div", { class: "footer-bottom" });

    // 左下：訪客數統計（數字由 initVisitorCounter 之後填入；失敗會自動隱藏）
    const visitors = el("div", { class: "footer-visitors", id: "footer-visitors", hidden: "" });
    visitors.append(el("span", { class: "v-label" }, s("visitors") + "："));
    visitors.append(el("span", { class: "v-count", id: "visitor-count" }, "—"));

    // 中：版權
    const copy = el("p", { class: "copyright" }, t(f.copyright));

    // 右下：隱私權政策（小連結）
    const privacy = el("div", { class: "footer-privacy" });
    privacy.append(el("a", { href: "privacy.html" }, s("privacy_policy")));

    bottom.append(visitors, copy, privacy);
    container.append(bottom);

    // 最底部：小小的聯絡信箱（mailto）。site.json 沒填 contactEmail 就不顯示
    if (f.contactEmail) {
      const contact = el("p", { class: "footer-contact" });
      contact.append("✉ ");
      contact.append(el("a", { href: "mailto:" + f.contactEmail }, f.contactEmail));
      container.append(contact);
    }

    footer.append(container);
    document.body.append(footer);

    // 拉取訪客數（放最後，避免擋住其他渲染）
    initVisitorCounter();
  },
};

/* ============================================================
   共用小工具
   ============================================================ */

/* ============================================================
   訪客數統計
   ------------------------------------------------------------
   純靜態網站沒有後端，無法自己記次數，所以借用免費的計數 API。
   設定在 data/site.json 的 visitorCounter：
     enabled  : true / false（false 就不顯示）
     provider : 目前支援 "abacus"（免費、免註冊、無需 cookie）
     namespace: 自訂命名空間，建議用網域，如 "yataty-gakuen-com"
     key      : 計數項目名稱，如 "visits"
   ★ 每位訪客每次載入頁面 +1。數字存在該服務上，跨裝置共用。
   ★ 服務若失效或被擋，會靜默隱藏計數器，不影響網站其他部分。
   ★ 想換服務：在下面 PROVIDERS 加一個 builder 即可。
   ============================================================ */
const COUNTER_PROVIDERS = {
  // Abacus: GET /hit/<namespace>/<key> → { value: 數字 }
  abacus: (cfg) => ({
    url: `https://abacus.jasoncameron.dev/hit/${encodeURIComponent(cfg.namespace)}/${encodeURIComponent(cfg.key)}`,
    pick: (data) => data.value,
  }),
  // CounterAPI v1: GET /v1/<namespace>/<key>/up → { count: 數字 }
  counterapi: (cfg) => ({
    url: `https://api.counterapi.dev/v1/${encodeURIComponent(cfg.namespace)}/${encodeURIComponent(cfg.key)}/up`,
    pick: (data) => data.count,
  }),
};

let _counterDone = false;   // 一次載入只計一次（避免切語言重畫又 +1）
async function initVisitorCounter() {
  const cfg = Site.SITE && Site.SITE.visitorCounter;
  const box = document.getElementById("footer-visitors");
  if (!box) return;
  if (!cfg || !cfg.enabled) { box.hidden = true; return; }

  const make = COUNTER_PROVIDERS[cfg.provider];
  if (!make) { box.hidden = true; return; }

  // 切語言會重畫頁尾；計數只在第一次做，之後沿用快取的數字
  if (_counterDone && typeof initVisitorCounter._last === "number") {
    setCount(initVisitorCounter._last);
    return;
  }

  try {
    const { url, pick } = make(cfg);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("counter " + res.status);
    const data = await res.json();
    const n = pick(data);
    if (typeof n !== "number") throw new Error("counter bad data");
    initVisitorCounter._last = n;
    _counterDone = true;
    setCount(n);
  } catch (err) {
    console.warn("訪客數載入失敗，已隱藏計數器：", err);
    box.hidden = true;
  }

  function setCount(n) {
    const elc = document.getElementById("visitor-count");
    if (elc) elc.textContent = n.toLocaleString();   // 千分位
    box.hidden = false;
  }
}

/** 依目前語言取多語欄位：{zh,ja}→取值；純字串→原樣 */
function t(v) {
  if (v && typeof v === "object" && !Array.isArray(v)) return v[Site.lang] ?? v.zh ?? Object.values(v)[0];
  return v;
}
/** 介面固定字串 */
function s(key) { return STRINGS[Site.lang][key] ?? key; }

/** 建立元素（textContent 可避免 XSS） */
function el(tag, attrs = {}, text = "") {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (text) node.textContent = text;
  return node;
}

/* ============================================================
   加入行事曆
   ------------------------------------------------------------
   產生一個 .ics（iCalendar）下載連結。.ics 是通用格式，
   iPhone 行事曆、Google 日曆、Outlook 都能匯入，純靜態即可運作。
   用法：calendarLink("標題", "2026-06-07") → 回傳一個 <a> 按鈕
   ============================================================ */
function _ymdCompact(d) { return d.replaceAll("-", ""); }
function icsContent(title, ymd) {
  const start = _ymdCompact(ymd);
  // 全天事件的 DTEND 要設為「隔天」（結束為排他性）
  const next = new Date(ymd + "T00:00:00");
  next.setDate(next.getDate() + 1);
  const end = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, "0")}${String(next.getDate()).padStart(2, "0")}`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  // 標題裡的逗號、分號在 ICS 需轉義
  const safe = title.replace(/([,;\\])/g, "\\$1");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Yataty Gakuen Hajime Rabu//JP",
    "BEGIN:VEVENT",
    "UID:" + start + "-" + Math.random().toString(36).slice(2) + "@yataty-gakuen.com",
    "DTSTAMP:" + stamp,
    "DTSTART;VALUE=DATE:" + start,
    "DTEND;VALUE=DATE:" + end,
    "SUMMARY:" + safe,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
/** 回傳「加入行事曆」按鈕（<a>），點擊下載對應的 .ics */
function calendarLink(title, ymd, extraClass = "") {
  const a = el("a", {
    class: "cal-btn" + (extraClass ? " " + extraClass : ""),
    download: "event.ics",
    href: "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent(title, ymd)),
  });
  a.append("📅 " + s("add_calendar"));
  return a;
}

/** 載入 JSON。no-cache 確保更新後訪客不會看到舊資料 */
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path} (${res.status})`);
  return res.json();
}

/** 載入失敗時顯示友善提示（找 #error-slot，沒有就插到 body 最前） */
function showLoadError(err) {
  console.error(err);
  const box = el("div", { class: "load-error" });
  box.append(el("h2", {}, s("load_error_title")));
  box.append(el("p", {}, s("load_error_body")));
  box.append(el("p", { style: "margin-top:10px;color:#888;font-size:0.85em" }, String(err)));
  const slot = document.getElementById("error-slot");
  if (slot) slot.append(box); else document.body.prepend(box);
}

/* ============================================================
   燈箱（點圖放大）：整站共用一個
   用法： openLightbox(圖片網址, 替代文字)
   ============================================================ */
let _lightbox = null;
function ensureLightbox() {
  if (_lightbox) return _lightbox;
  const box = el("div", { class: "lightbox" });
  const close = el("button", { class: "close", "aria-label": "close" }, "×");
  const img = el("img", { src: "", alt: "" });
  box.append(close, img);
  document.body.append(box);
  const hide = () => box.classList.remove("open");
  box.addEventListener("click", hide);                 // 點背景關閉
  img.addEventListener("click", e => e.stopPropagation()); // 點圖本身不關
  close.addEventListener("click", hide);
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
  _lightbox = { box, img };
  return _lightbox;
}
function openLightbox(src, alt = "") {
  const lb = ensureLightbox();
  lb.img.src = src;
  lb.img.alt = alt;
  lb.box.classList.add("open");
}

/* ============================================================
   可展開文字：建立「文字＋展開/收合」區塊
   text：要顯示的內容字串
   回傳一個 div（已包含展開邏輯）
   ============================================================ */
function makeClampable(text) {
  const wrap = el("div", { class: "clampable" });
  const body = el("p", { class: "clamp-text" }, text);
  const btn = el("button", { class: "clamp-toggle", type: "button" }, s("expand_more"));
  wrap.append(body, btn);

  btn.addEventListener("click", () => {
    const expanded = wrap.classList.toggle("expanded");
    btn.textContent = expanded ? s("expand_less") : s("expand_more");
  });

  // 等版面排好後判斷：沒有超過行數就不顯示按鈕
  requestAnimationFrame(() => {
    if (body.scrollHeight <= body.clientHeight + 2) btn.style.display = "none";
  });
  return wrap;
}

/* ============================================================
   圖片輪播：建立會自動循環的圖片區（點擊放大）
   images：[{ src, alt }]；interval：毫秒
   ============================================================ */
function makeCarousel(images, { interval = 3500, grayscaleClickSrc = null } = {}) {
  const box = el("div", { class: "carousel" });

  // 只有一張圖：當作普通圖片，仍可點擊放大
  const imgEls = images.map((im, i) => {
    const img = el("img", { src: im.src, alt: im.alt || "", loading: "lazy" });
    if (i === 0) img.classList.add("active");
    img.onerror = () => img.remove();
    return img;
  });
  imgEls.forEach(i => box.append(i));

  box.append(el("span", { class: "zoom-hint" }, "🔍"));

  // 多張才顯示圓點與自動輪播
  let dots = [];
  if (images.length > 1) {
    const dotBox = el("div", { class: "dots" });
    images.forEach((_, i) => {
      const d = el("span");
      if (i === 0) d.classList.add("on");
      dots.push(d);
      dotBox.append(d);
    });
    box.append(dotBox);

    let idx = 0;
    setInterval(() => {
      imgEls[idx]?.classList.remove("active");
      dots[idx]?.classList.remove("on");
      idx = (idx + 1) % imgEls.length;
      imgEls[idx]?.classList.add("active");
      dots[idx]?.classList.add("on");
    }, interval);

    // 點擊放大目前顯示的那張
    box.addEventListener("click", () => {
      const cur = imgEls.find(i => i.classList.contains("active")) || imgEls[0];
      if (cur) openLightbox(cur.src, cur.alt);
    });
  } else {
    box.addEventListener("click", () => {
      if (imgEls[0]) openLightbox(imgEls[0].src, imgEls[0].alt);
    });
  }

  return box;
}

/* ============================================================
   企劃（projects）共用模組
   ------------------------------------------------------------
   首頁、進行中頁、年表頁都會用到企劃資料，故集中在這裡，避免重複。
   ============================================================ */

/** 載入所有企劃；每筆會帶 _dir（自己的資料夾路徑，圖片用）。
    某筆 JSON 壞掉只會略過該筆，不影響其他。 */
async function loadProjects() {
  const list = await fetchJSON("data/projects/_list.json");
  const results = await Promise.allSettled(list.map(async id => {
    const p = await fetchJSON(`data/projects/${id}/project.json`);
    p._dir = `data/projects/${id}/`;
    return p;
  }));
  results.filter(r => r.status === "rejected")
         .forEach(r => console.warn("企劃載入失敗，已略過：", r.reason));
  return results.filter(r => r.status === "fulfilled").map(r => r.value);
}

/** 企劃是否已結束（以日本時間 JST 為準，全球訪客分類一致） */
function isPast(p) {
  if (!p.end) return false;
  return new Date(p.end + "T23:59:59+09:00") < new Date();
}

/** 期間顯示文字，如 "2026/06/01 ～ 2026/06/14" */
function periodText(p) {
  const fmt = d => d ? d.replaceAll("-", "/") : "";
  if (!p.start && !p.end) return s("longterm");
  if (!p.end) return `${fmt(p.start)} ～${s("longterm_suffix")}`;
  return `${fmt(p.start)} ～ ${fmt(p.end)}`;
}

/** 企劃圖片陣列：優先用 images（多張→輪播），否則用單張 cover */
function projectImages(p) {
  if (Array.isArray(p.images) && p.images.length) {
    return p.images.map(name => ({ src: p._dir + name, alt: t(p.name) }));
  }
  if (p.cover) return [{ src: p._dir + p.cover, alt: t(p.name) }];
  return [];
}

/** 建立一張企劃卡片。past=true 套用灰階「已結束」樣式 */
function buildProjectCard(p, past) {
  const card = el("article", { class: "project-card" + (past ? " is-past" : "") });

  const imgs = projectImages(p);
  if (imgs.length) card.append(makeCarousel(imgs));

  card.append(past
    ? el("span", { class: "badge-past" }, s("badge_past"))
    : el("span", { class: "badge-ongoing" }, s("badge_ongoing")));

  const body = el("div", { class: "project-body" });
  const cat = Site.SITE.categories[p.cat];
  if (cat) {
    const tag = el("span", { class: "project-cat" }, t(cat.label));
    tag.style.background = cat.color;
    body.append(tag);
  }
  body.append(el("h3", { class: "project-name" }, t(p.name)));
  body.append(el("p", { class: "project-period" }, s("period") + periodText(p)));
  body.append(makeClampable(t(p.desc)));

  if (p.hashtags?.length) {
    const tagBox = el("div", { class: "project-hashtags" });
    p.hashtags.forEach(h => {
      const url = "https://x.com/search?q=" + encodeURIComponent(h);
      tagBox.append(el("a", { href: url, target: "_blank", rel: "noopener" }, h));
    });
    body.append(tagBox);
  }
  if (p.links?.length) {
    const box = el("div", { class: "project-links" });
    p.links.forEach(l => box.append(el("a", { href: l.url, target: "_blank", rel: "noopener" }, t(l.label))));
    body.append(box);
  }
  // 進行中且有截止日 → 附「加入行事曆」（提醒截止日）
  if (!past && p.end) {
    const calRow = el("div", { class: "project-cal" });
    calRow.append(calendarLink(t(p.name), p.end));
    body.append(calRow);
  }

  card.append(body);
  return card;
}
