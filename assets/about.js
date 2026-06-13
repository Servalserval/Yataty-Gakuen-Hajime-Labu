/* ============================================================
   關於我們頁專用程式（about.html）
   結構：引言 lead + 多個段落 sections + 相關連結 links
   資料在 data/about.json。
   ============================================================ */

let ABOUT = {};

function renderAbout() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const root = document.getElementById("about-root");
  root.textContent = "";

  // 引言（開頭較大的一段）
  if (ABOUT.lead) {
    root.append(el("p", { class: "about-lead" }, t(ABOUT.lead)));
  }

  // 各段落：每段一個標題 + 多個內文段落
  (ABOUT.sections ?? []).forEach(sec => {
    const block = el("div", { class: "about-section" });
    if (sec.heading) block.append(el("h2", {}, t(sec.heading)));
    (sec.body ?? []).forEach(para => block.append(el("p", {}, t(para))));
    root.append(block);
  });

  // 相關連結（按鈕樣式）
  if (ABOUT.links?.length) {
    const linkBox = el("div", { class: "about-links" });
    ABOUT.links.forEach(l =>
      linkBox.append(el("a", { href: l.url, target: "_blank", rel: "noopener" }, t(l.label) + " ↗")));
    root.append(linkBox);
  }
}

async function startAbout() {
  try {
    ABOUT = await fetchJSON("data/about.json");
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "about.html", render: renderAbout });
}
startAbout();
