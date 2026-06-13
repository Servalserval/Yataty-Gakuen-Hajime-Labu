/* ============================================================
   活動年表頁專用程式（timeline.html）
   讀入 data/projects/ 的所有企劃，依「年份」分組成時間軸。
   年份取自 start（沒有就取 end）。預設新的年份在最上面。
   不需要另外維護資料——新增企劃時年表會自動更新。
   ============================================================ */

let TL_PROJECTS = [];

/** 取企劃所屬年份（字串 4 碼）；都沒有日期就歸到「其他」 */
function projectYear(p) {
  const d = p.start || p.end || "";
  return d.slice(0, 4) || "----";
}
function periodText(p) {
  const fmt = d => d ? d.replaceAll("-", "/") : "";
  if (!p.start && !p.end) return s("longterm");
  if (!p.end) return `${fmt(p.start)} ～${s("longterm_suffix")}`;
  return `${fmt(p.start)} ～ ${fmt(p.end)}`;
}

/** 取封面縮圖（多圖取第一張） */
function thumbOf(p) {
  if (Array.isArray(p.images) && p.images.length) return p._dir + p.images[0];
  if (p.cover) return p._dir + p.cover;
  return null;
}

function buildEntry(p) {
  const row = el("div", { class: "tl-entry" });

  // 縮圖（可點擊放大）
  const thumb = thumbOf(p);
  if (thumb) {
    const img = el("img", { class: "tl-thumb", src: thumb, alt: t(p.name), loading: "lazy" });
    img.onerror = () => img.remove();
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
    row.append(img);
  }

  const info = el("div", { class: "tl-info" });
  // 分類標籤（顏色取自 categories）
  const cat = Site.SITE.categories[p.cat];
  if (cat) {
    const tag = el("span", { class: "tl-cat" }, t(cat.label));
    tag.style.background = cat.color;
    info.append(tag);
  }
  info.append(el("span", { class: "tl-name" }, t(p.name)));
  info.append(el("span", { class: "tl-period" }, periodText(p)));
  row.append(info);
  return row;
}

function renderTimeline() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const root = document.getElementById("timeline-root");
  root.textContent = "";

  if (!TL_PROJECTS.length) {
    root.append(el("p", { class: "empty-hint" }, s("timeline_empty")));
    return;
  }

  // 依年份分組
  const byYear = {};
  TL_PROJECTS.forEach(p => {
    const y = projectYear(p);
    (byYear[y] ||= []).push(p);
  });

  // 年份由新到舊
  const years = Object.keys(byYear).sort((a, b) => (a < b ? 1 : -1));
  years.forEach(year => {
    const block = el("div", { class: "tl-year" });
    block.append(el("h3", { class: "tl-year-label" }, year));

    // 同一年內：日期新的在前
    const list = byYear[year].sort((a, b) => {
      const da = a.start || a.end || "", db = b.start || b.end || "";
      return da < db ? 1 : -1;
    });
    const entries = el("div", { class: "tl-entries" });
    list.forEach(p => entries.append(buildEntry(p)));
    block.append(entries);
    root.append(block);
  });
}

async function startTimeline() {
  try {
    const list = await fetchJSON("data/projects/_list.json");
    const results = await Promise.allSettled(list.map(async id => {
      const p = await fetchJSON(`data/projects/${id}/project.json`);
      p._dir = `data/projects/${id}/`;
      return p;
    }));
    TL_PROJECTS = results.filter(r => r.status === "fulfilled").map(r => r.value);
    results.filter(r => r.status === "rejected")
           .forEach(r => console.warn("企劃載入失敗，已略過：", r.reason));
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "timeline.html", render: renderTimeline });
}
startTimeline();
