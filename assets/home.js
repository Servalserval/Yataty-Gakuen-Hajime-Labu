/* ============================================================
   首頁專用程式（index.html）
   負責：Hero（標題）、公告、過去的企劃、前往進行中頁的入口
   生日／各種倒數已移到 countdown.html；企劃卡共用 common.js。
   ============================================================ */

let PROJECTS = [];
let REPLIES = [];

/** 建立一張「番長的回信」卡片（沿用貼文卡樣式，加金色左框與「番長より」標記） */
function buildReplyCard(r) {
  const card = el("article", { class: "post-card reply-card" });

  if (r.image) {
    const img = el("img", { class: "post-img", src: r.image, alt: s("reply_author"), loading: "lazy" });
    img.onerror = () => img.remove();
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
    card.append(img);
  }

  const body = el("div", { class: "post-body" });
  const meta = el("div", { class: "post-meta" });
  meta.append(el("span", { class: "author" }, "⚡ " + s("reply_author")));
  if (r.date) meta.append(el("span", {}, r.date));
  body.append(meta);

  if (r.text) body.append(makeClampable(t(r.text)));

  const footer = el("div", { class: "post-footer" });
  footer.append(el("a", { class: "post-original", href: r.url, target: "_blank", rel: "noopener" }, s("post_original") + " ↗"));
  body.append(footer);

  card.append(body);
  return card;
}

function renderHome() {
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

  // hashtags（hero）
  const heroTags = document.getElementById("hero-tags");
  heroTags.textContent = "";
  (H.tags ?? []).forEach((tg, i) => {
    if (i > 0) heroTags.append("　");
    heroTags.append(el("a", { href: tg.url, target: "_blank", rel: "noopener" }, tg.label));
  });

  // 番長的回信（有資料才顯示整個區塊；新的在前）
  const repliesSection = document.getElementById("replies");
  const repliesGrid = document.getElementById("replies-grid");
  repliesGrid.textContent = "";
  if (REPLIES.length) {
    repliesSection.style.display = "";
    [...REPLIES].sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1))
                .forEach(r => repliesGrid.append(buildReplyCard(r)));
  } else {
    repliesSection.style.display = "none";
  }

  // 公告
  const newsList = document.getElementById("news-list");
  newsList.textContent = "";
  (Site.SITE.news ?? []).forEach(n => {
    const li = el("li");
    li.append(el("span", { class: "news-date" }, n.date));
    li.append(n.url ? el("a", { href: n.url }, t(n.title)) : el("span", {}, t(n.title)));
    newsList.append(li);
  });

  // 前往「進行中的企劃」頁的入口按鈕文字
  // 進行中的企劃（卡片直接顯示在主頁；過去的企劃在 past.html）
  const ongoing = PROJECTS.filter(p => !isPast(p))
                          .sort((a, b) => (a.end ?? "9999") < (b.end ?? "9999") ? -1 : 1);
  const og = document.getElementById("ongoing-grid");
  og.textContent = "";
  if (ongoing.length) ongoing.forEach(p => og.append(buildProjectCard(p, false)));
  else og.append(el("p", { class: "empty-hint" }, s("empty_ongoing")));

  // 「看過去的企劃 →」連結
  const seePast = document.getElementById("see-past-link");
  if (seePast) seePast.textContent = s("see_past") + " →";
}

async function startHome() {
  try {
    PROJECTS = await loadProjects();
  } catch (err) {
    showLoadError(err);
  }
  // 番長的回信（載入失敗就當作沒有，不影響其他內容）
  try {
    REPLIES = await fetchJSON("data/replies.json");
  } catch (err) {
    console.warn("番長的回信載入失敗（或尚無此檔），已略過：", err);
    REPLIES = [];
  }
  await Site.init({ page: "index.html", render: renderHome });
}
startHome();
