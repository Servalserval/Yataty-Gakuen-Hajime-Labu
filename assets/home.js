/* ============================================================
   首頁專用程式（index.html）
   負責：Hero（標題）、公告、過去的企劃、前往進行中頁的入口
   生日／各種倒數已移到 countdown.html；企劃卡共用 common.js。
   ============================================================ */

let PROJECTS = [];

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
  const cta = document.getElementById("ongoing-cta");
  if (cta) cta.textContent = s("nav_ongoing") + " →";

  // 過去的企劃（進行中的企劃在 ongoing.html）
  const past = PROJECTS.filter(isPast).sort((a, b) => (a.end < b.end ? 1 : -1));
  const pg = document.getElementById("past-grid");
  pg.textContent = "";
  document.getElementById("past").style.display = past.length ? "" : "none";
  past.forEach(p => pg.append(buildProjectCard(p, true)));
}

async function startHome() {
  try {
    PROJECTS = await loadProjects();
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "index.html", render: renderHome });
}
startHome();
