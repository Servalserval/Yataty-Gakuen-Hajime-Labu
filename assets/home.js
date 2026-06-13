/* ============================================================
   首頁專用程式（index.html）
   負責：Hero（標題）、生日倒數區塊、公告、過去的企劃、前往進行中頁的入口
   企劃卡與分類邏輯共用 common.js 的 buildProjectCard / isPast / loadProjects。
   ============================================================ */

let PROJECTS = [];

/* ---------- 生日倒數（以日本時間 JST 為準） ----------
   規則：今年生日已過 → 倒數到明年的生日；
         生日當天 → 不倒數，顯示「生日當天」；
         其餘 → 倒數到今年生日。 */
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
    // 生日當天 → 顯示祝賀、不倒數
    if (now >= startOfDay && now <= endOfDay) { box.hidden = true; hbd.hidden = false; return; }
    // 今年已過 → 明年；否則 → 今年
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

  // 倒數區塊的生日日期
  document.getElementById("hero-date").textContent = H.date;

  // 生日「加入行事曆」按鈕（用即將到來的那一年）
  const calBox = document.getElementById("hero-cal");
  calBox.textContent = "";
  if (H.birthdayMonthDay) {
    const [mm, dd] = H.birthdayMonthDay.split("-").map(Number);
    const now = new Date();
    let year = now.getFullYear();
    const todayMd = (now.getMonth() + 1) * 100 + now.getDate();
    if (todayMd > mm * 100 + dd) year += 1;   // 今年已過用明年
    const ymd = `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    calBox.append(calendarLink(s("birthday_title"), ymd));
  }

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

  // 過去的企劃（進行中的企劃已移到 ongoing.html）
  const past = PROJECTS.filter(isPast).sort((a, b) => (a.end < b.end ? 1 : -1));
  const pg = document.getElementById("past-grid");
  pg.textContent = "";
  document.getElementById("past").style.display = past.length ? "" : "none";
  past.forEach(p => pg.append(buildProjectCard(p, true)));
}

/* ---------- 啟動 ---------- */
async function startHome() {
  try {
    PROJECTS = await loadProjects();
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "index.html", render: renderHome });
  startCountdown();
}
startHome();
