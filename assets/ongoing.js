/* ============================================================
   進行中的企劃頁專用程式（ongoing.html）
   只顯示「尚未結束」的企劃。企劃卡與分類邏輯共用 common.js。
   過去的企劃在首頁與年表頁可看到。
   ============================================================ */

let PROJECTS = [];

function renderOngoing() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  // 只取進行中；快結束的排前面，長期（無 end）排最後
  const ongoing = PROJECTS.filter(p => !isPast(p))
                          .sort((a, b) => (a.end ?? "9999") < (b.end ?? "9999") ? -1 : 1);

  const grid = document.getElementById("ongoing-grid");
  grid.textContent = "";
  if (ongoing.length) ongoing.forEach(p => grid.append(buildProjectCard(p, false)));
  else grid.append(el("p", { class: "empty-hint" }, s("empty_ongoing")));
}

async function startOngoing() {
  try {
    PROJECTS = await loadProjects();
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "ongoing.html", render: renderOngoing });
}
startOngoing();
