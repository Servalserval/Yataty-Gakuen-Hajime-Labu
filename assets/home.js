/* ============================================================
   首頁專用程式（index.html）
   負責：Hero（標題）、公告、過去的企劃、前往進行中頁的入口
   生日／各種倒數已移到 countdown.html；企劃卡共用 common.js。
   ============================================================ */

let PROJECTS = [];

/* 首頁「最新公告」最多顯示幾則。
   ★ 舊的公告不用刪，全部留在 data/site.json 裡，只是首頁不顯示，
     日期較新的會自動排到前面。想多顯示幾則就改這個數字。 */
const NEWS_LIMIT = 5;

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

  // 公告：日期新的排前面，只顯示最新的 NEWS_LIMIT 則（其餘仍保留在 site.json）
  const newsList = document.getElementById("news-list");
  newsList.textContent = "";
  [...(Site.SITE.news ?? [])]
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1))
    .slice(0, NEWS_LIMIT)
    .forEach(n => {
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
  await Site.init({ page: "index.html", render: renderHome });
}
startHome();
