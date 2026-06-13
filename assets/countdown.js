/* ============================================================
   倒數頁專用程式（countdown.html）
   讀 data/countdowns/ 的事件，算出各自的目標日期，排序後：
     - 最近的 → 大倒數（天/時/分/秒，每秒跳動）
     - 其餘   → 便利貼，一張張貼在下面
   事件三種日期寫法（擇一）：
     monthDay "MM-DD"   每年循環（過了換明年；當天顯示「就是今天」）
     daysAfterDebut N   一次性，出道日(site.json debutDate)+N 天
     date "YYYY-MM-DD"  一次性，固定日期
   一次性且已過 → 自動隱藏。新增事件＝在 data/countdowns/ 加一個 json
   並登記到 _list.json。
   ============================================================ */

let CD_EVENTS = [];
let cd = { main: null, started: false };

/* ---- 時間工具（以日本時間 JST 為準，全球訪客一致） ---- */
function nowJST() {
  const n = new Date();
  return new Date(n.getTime() + (n.getTimezoneOffset() + 540) * 60000);
}
function ymdLocal(ymd) { const [y, m, d] = ymd.split("-").map(Number); return new Date(y, m - 1, d); }
function pad(n) { return String(n).padStart(2, "0"); }
function fmtYMD(dt) { return `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}`; }
function isoYMD(dt) { return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`; }
function endOfDay(dt) { return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59); }
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

/** 算出事件的目標日期；回傳 {target, today, recurring} 或 null（一次性已過→隱藏） */
function resolveEvent(ev, now) {
  if (ev.monthDay) {
    const [m, d] = ev.monthDay.split("-").map(Number);
    const thisYear = new Date(now.getFullYear(), m - 1, d);
    if (sameDay(thisYear, now)) return { target: thisYear, today: true, recurring: true };
    const target = now > endOfDay(thisYear) ? new Date(now.getFullYear() + 1, m - 1, d) : thisYear;
    return { target, today: false, recurring: true };
  }
  if (typeof ev.daysAfterDebut === "number") {
    if (!Site.SITE.debutDate) return null;
    const base = ymdLocal(Site.SITE.debutDate);
    base.setDate(base.getDate() + ev.daysAfterDebut);
    if (now > endOfDay(base)) return null;
    return { target: base, today: sameDay(base, now), recurring: false };
  }
  if (ev.date) {
    const t = ymdLocal(ev.date);
    if (now > endOfDay(t)) return null;
    return { target: t, today: sameDay(t, now), recurring: false };
  }
  return null;
}

/** 便利貼上「還有 N 天」的本地化文字 */
function remainingText(n) {
  if (Site.lang === "ja") return `あと ${n} 日`;
  if (Site.lang === "en") return `${n} ${n === 1 ? "day" : "days"} left`;
  return `還有 ${n} 天`;
}

/* ---- 大倒數卡片 ---- */
function buildMain(ev, r) {
  const wrap = el("div", { class: "cd-main-card" });
  wrap.append(el("h2", { class: "cd-main-label" }, t(ev.label)));
  wrap.append(el("p", { class: "hero-date" }, fmtYMD(r.target)));

  const nums = el("div", { class: "countdown" });
  const grid = el("div", { class: "countdown-nums" });
  const mk = (labelKey) => {
    const u = el("span", { class: "unit" });
    const num = el("span", { class: "num" }, "0");
    u.append(num, el("br"), el("span", { class: "lbl" }, s(labelKey)));
    return { u, num };
  };
  const dD = mk("cd_d"), dH = mk("cd_h"), dM = mk("cd_m"), dS = mk("cd_s");
  grid.append(dD.u, dH.u, dM.u, dS.u);
  nums.append(grid);

  const hbd = el("p", { class: "countdown-hbd" }, "🎉 " + t(ev.label) + " " + s("countdown_today"));
  hbd.hidden = true;

  wrap.append(nums, hbd);
  wrap.append(calendarLink(t(ev.label), isoYMD(r.target)));

  cd.main = { target: r.target, num: { d: dD.num, h: dH.num, m: dM.num, s: dS.num }, nums, hbd };
  return wrap;
}

/* ---- 便利貼卡片 ---- */
const STICKY_BG = ["#ece6f9", "#fff3c4", "#ffe0ec", "#d8f5d0", "#e0f0ff"];
function buildSticky(ev, r, i) {
  const card = el("div", { class: "cd-sticky" });
  card.style.background = STICKY_BG[i % STICKY_BG.length];
  card.style.transform = `rotate(${i % 2 ? 1.6 : -1.8}deg)`;   // 交錯微傾，便利貼感
  card.append(el("div", { class: "cd-sticky-label" }, t(ev.label)));
  card.append(el("div", { class: "cd-sticky-date" }, fmtYMD(r.target)));
  const days = Math.max(0, Math.ceil((r.target - nowJST()) / 86400000));
  card.append(el("div", { class: "cd-sticky-days" }, r.today ? s("countdown_today") : remainingText(days)));
  card.append(calendarLink(t(ev.label), isoYMD(r.target), "cal-mini"));
  return card;
}

/* ---- 渲染（切語言時重跑） ---- */
function renderCountdown() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const now = nowJST();
  const resolved = CD_EVENTS
    .map(ev => ({ ev, r: resolveEvent(ev, now) }))
    .filter(x => x.r)
    .sort((a, b) => a.r.target - b.r.target);   // 最近的在前

  const mainBox = document.getElementById("cd-main");
  const stickyBox = document.getElementById("cd-stickies");
  mainBox.textContent = "";
  stickyBox.textContent = "";
  cd.main = null;

  if (!resolved.length) {
    mainBox.append(el("p", { class: "empty-hint" }, s("timeline_empty")));
    return;
  }
  mainBox.append(buildMain(resolved[0].ev, resolved[0].r));
  resolved.slice(1).forEach((x, i) => stickyBox.append(buildSticky(x.ev, x.r, i)));
}

/* ---- 每秒更新大倒數 ---- */
function tick() {
  if (!cd.main) return;
  const now = nowJST();
  const eod = endOfDay(cd.main.target);
  if (now > eod) { renderCountdown(); return; }            // 已過 → 重新解析（換下一年／隱藏）
  if (now >= cd.main.target && now <= eod) {               // 當天 → 慶祝，不倒數
    cd.main.nums.hidden = true; cd.main.hbd.hidden = false; return;
  }
  cd.main.nums.hidden = false; cd.main.hbd.hidden = true;
  const sec = Math.max(0, Math.floor((cd.main.target - now) / 1000));
  cd.main.num.d.textContent = Math.floor(sec / 86400);
  cd.main.num.h.textContent = Math.floor(sec % 86400 / 3600);
  cd.main.num.m.textContent = Math.floor(sec % 3600 / 60);
  cd.main.num.s.textContent = sec % 60;
}

async function startCountdownPage() {
  try {
    const list = await fetchJSON("data/countdowns/_list.json");
    const results = await Promise.allSettled(list.map(id => fetchJSON(`data/countdowns/${id}.json`)));
    CD_EVENTS = results.filter(r => r.status === "fulfilled").map(r => r.value);
    results.filter(r => r.status === "rejected")
           .forEach(r => console.warn("倒數事件載入失敗，已略過：", r.reason));
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "countdown.html", render: renderCountdown });
  if (!cd.started) { cd.started = true; tick(); setInterval(tick, 1000); }
}
startCountdownPage();
