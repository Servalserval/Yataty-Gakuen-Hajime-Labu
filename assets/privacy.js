/* ============================================================
   隱私權政策頁專用程式（privacy.html）
   結構與「關於我們」相同：引言 lead + 段落 sections + 連結 links
   資料在 data/privacy.json。沿用 about 的版面樣式。
   ============================================================ */

let PRIVACY = {};

function renderPrivacy() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const root = document.getElementById("about-root");   // 沿用 about 樣式容器
  root.textContent = "";

  if (PRIVACY.lead) root.append(el("p", { class: "about-lead" }, t(PRIVACY.lead)));

  (PRIVACY.sections ?? []).forEach(sec => {
    const block = el("div", { class: "about-section" });
    if (sec.heading) block.append(el("h2", {}, t(sec.heading)));
    (sec.body ?? []).forEach(para => block.append(el("p", {}, t(para))));
    root.append(block);
  });

  if (PRIVACY.links?.length) {
    const linkBox = el("div", { class: "about-links" });
    PRIVACY.links.forEach(l =>
      linkBox.append(el("a", { href: l.url, target: "_blank", rel: "noopener" }, t(l.label) + " ↗")));
    root.append(linkBox);
  }
}

async function startPrivacy() {
  try {
    PRIVACY = await fetchJSON("data/privacy.json");
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "privacy.html", render: renderPrivacy });
}
startPrivacy();
