/* ============================================================
   過去的企劃頁專用程式（past.html）
   只顯示「已結束」的企劃（灰階卡）。進行中的企劃在主頁。
   企劃卡與分類邏輯共用 common.js。
   ============================================================ */

let PROJECTS = [];

function renderPast() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  // 已結束；最近結束的排前面
  const past = PROJECTS.filter(isPast).sort((a, b) => (a.end < b.end ? 1 : -1));

  const grid = document.getElementById("past-grid");
  grid.textContent = "";
  if (past.length) past.forEach(p => grid.append(buildProjectCard(p, true)));
  else grid.append(el("p", { class: "empty-hint" }, s("empty_past")));
}

async function startPast() {
  try {
    PROJECTS = await loadProjects();
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "past.html", render: renderPast });
}
startPast();
