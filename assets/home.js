/* ============================================================
   首頁專用程式（index.html）
   負責：Hero、生日倒數、公告、企劃（進行中／過去自動分類）
   共用功能（導覽列、頁尾、語言、燈箱）在 common.js。
   ============================================================ */

let PROJECTS = [];   // 所有企劃，各自帶 _dir（自己的資料夾路徑）

/* ---------- 企劃到期判斷（固定以日本時間 JST 為準） ---------- */
function isPast(p) {
  if (!p.end) return false;
  return new Date(p.end + "T23:59:59+09:00") < new Date();
}
function periodText(p) {
  const fmt = d => d ? d.replaceAll("-", "/") : "";
  if (!p.start && !p.end) return s("longterm");
  if (!p.end) return `${fmt(p.start)} ～${s("longterm_suffix")}`;
  return `${fmt(p.start)} ～ ${fmt(p.end)}`;
}

/** 取得企劃的圖片陣列：優先用 images（多張→輪播），否則用單張 cover */
function projectImages(p) {
  if (Array.isArray(p.images) && p.images.length) {
    return p.images.map(name => ({ src: p._dir + name, alt: t(p.name) }));
  }
  if (p.cover) return [{ src: p._dir + p.cover, alt: t(p.name) }];
  return [];
}

function buildCard(p, past) {
  const card = el("article", { class: "project-card" + (past ? " is-past" : "") });

  // 圖片區：多張用輪播、一張用普通圖、沒有就略過
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

  // 說明文字：預設顯示幾行，超過可展開
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
  card.append(body);
  return card;
}

/* ---------- 生日倒數（以日本時間 JST 為準） ---------- */
function startCountdown() {
  const md = Site.SITE.hero.birthdayMonthDay;
  if (!md) return;
  const [m, d] = md.split("-").map(Number);
  const box = document.getElementById("countdown");
  const hbd = document.getElementById("countdown-hbd");

  function nowJST() {
    const n = new Date();
    return new Date(n.getTime() + (n.getTimezoneOffset() + 540) * 60000);
  }
  function tick() {
    const now = nowJST();
    const startOfDay = new Date(now.getFullYear(), m - 1, d, 0, 0, 0);
    const endOfDay   = new Date(now.getFullYear(), m - 1, d, 23, 59, 59);
    if (now >= startOfDay && now <= endOfDay) { box.hidden = true; hbd.hidden = false; return; }
    const target = now > endOfDay ? new Date(now.getFullYear() + 1, m - 1, d) : startOfDay;
    const sec = Math.max(0, Math.floor((target - now) / 1000));
    document.getElementById("cd-d").textContent = Math.floor(sec / 86400);
    document.getElementById("cd-h").textContent = Math.floor(sec % 86400 / 3600);
    document.getElementById("cd-m").textContent = Math.floor(sec % 3600 / 60);
    document.getElementById("cd-s").textContent = sec % 60;
    box.hidden = false; hbd.hidden = true;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- 首頁渲染（切語言時重跑） ---------- */
function renderHome() {
  // data-i18n 標記的固定文字
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    if (key === "hero_title") {
      node.textContent = "";
      s(key).split("\n").forEach((line, i) => {
        if (i > 0) node.append(el("br"));
        node.append(line);
      });
    } else {
      node.textContent = s(key);
    }
  });

  const H = Site.SITE.hero;
  document.getElementById("hero-date").textContent = H.date;

  // Hero fanart
  const figure = document.getElementById("hero-fanart");
  if (H.fanart) {
    figure.hidden = false;
    const img = document.getElementById("fanart-img");
    img.src = H.fanart.src;
    img.alt = t(H.fanart.alt);
    img.onerror = () => { figure.hidden = true; };
    const credit = document.getElementById("fanart-credit");
    credit.textContent = s("fanart_by");
    credit.append(el("a", { href: H.fanart.artistUrl, target: "_blank", rel: "noopener" }, H.fanart.artistName));
  } else {
    figure.hidden = true;
  }

  // hashtags
  const heroTags = document.getElementById("hero-tags");
  heroTags.textContent = "";
  (H.tags ?? []).forEach((tg, i) => {
    if (i > 0) heroTags.append("　");
    heroTags.append(el("a", { href: tg.url, target: "_blank", rel: "noopener" }, tg.label));
  });

  // 公告
  const newsList = document.getElementById("news-list");
  newsList.textContent = "";
  (Site.SITE.news ?? []).forEach(n => {
    const li = el("li");
    li.append(el("span", { class: "news-date" }, n.date));
    li.append(n.url ? el("a", { href: n.url }, t(n.title)) : el("span", {}, t(n.title)));
    newsList.append(li);
  });

  // 企劃自動分類
  const ongoing = PROJECTS.filter(p => !isPast(p));
  const past    = PROJECTS.filter(isPast);
  ongoing.sort((a, b) => (a.end ?? "9999") < (b.end ?? "9999") ? -1 : 1);
  past.sort((a, b) => (a.end < b.end ? 1 : -1));

  const og = document.getElementById("ongoing-grid");
  og.textContent = "";
  if (ongoing.length) ongoing.forEach(p => og.append(buildCard(p, false)));
  else og.append(el("p", { class: "empty-hint" }, s("empty_ongoing")));

  const pg = document.getElementById("past-grid");
  pg.textContent = "";
  document.getElementById("past").style.display = past.length ? "" : "none";
  past.forEach(p => pg.append(buildCard(p, true)));
}

/* ---------- 啟動 ---------- */
async function startHome() {
  try {
    const list = await fetchJSON("data/projects/_list.json");
    const results = await Promise.allSettled(list.map(async id => {
      const p = await fetchJSON(`data/projects/${id}/project.json`);
      p._dir = `data/projects/${id}/`;
      return p;
    }));
    PROJECTS = results.filter(r => r.status === "fulfilled").map(r => r.value);
    results.filter(r => r.status === "rejected")
           .forEach(r => console.warn("企劃載入失敗，已略過：", r.reason));
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "index.html", render: renderHome });
  startCountdown();
}
startHome();
