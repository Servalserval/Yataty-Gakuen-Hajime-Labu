/* ============================================================
   番長的回信頁專用程式（replies.html）
   每則是一張卡：（可選）截圖＋作者(番長)＋日期＋內容(可展開)＋查看原文
   資料在 data/replies.json。
   ============================================================ */

let REPLIES = [];

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

function renderReplies() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const grid = document.getElementById("replies-grid");
  grid.textContent = "";
  if (!REPLIES.length) {
    grid.append(el("p", { class: "empty-hint" }, s("empty_replies")));
    return;
  }
  [...REPLIES].sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1))
              .forEach(r => grid.append(buildReplyCard(r)));
}

async function startReplies() {
  try {
    REPLIES = await fetchJSON("data/replies.json");
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "replies.html", render: renderReplies });
}
startReplies();
