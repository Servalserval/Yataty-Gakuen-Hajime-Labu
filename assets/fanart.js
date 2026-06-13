/* ============================================================
   ファンアート頁專用程式（fanart.html）
   每張賀圖一張卡：圖片（點擊放大）＋繪師＋說明（可展開）＋繪師貼文連結
   資料在 data/fanart.json。
   ※ 刊載任何賀圖前，務必先取得繪師同意並保留署名與原貼文連結。
   ============================================================ */

let FANART = [];

function buildFanartCard(item) {
  const card = el("article", { class: "post-card" });   // 沿用貼文卡樣式

  // 賀圖（點擊放大）
  if (item.image) {
    const img = el("img", { class: "post-img", src: item.image, alt: item.artist || "fan art", loading: "lazy" });
    img.onerror = () => img.remove();
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
    card.append(img);
  }

  const body = el("div", { class: "post-body" });

  // 繪師＋日期
  const meta = el("div", { class: "post-meta" });
  if (item.artist) meta.append(el("span", { class: "author" }, item.artist));
  if (item.date)   meta.append(el("span", {}, item.date));
  body.append(meta);

  // 說明（可展開）
  if (item.text) body.append(makeClampable(t(item.text)));

  // 右下角「繪師的貼文」
  const footer = el("div", { class: "post-footer" });
  footer.append(el("a", {
    class: "post-original", href: item.url, target: "_blank", rel: "noopener"
  }, s("fanart_view") + " ↗"));
  body.append(footer);

  card.append(body);
  return card;
}

function renderFanart() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const grid = document.getElementById("fanart-grid");
  grid.textContent = "";
  if (!FANART.length) {
    grid.append(el("p", { class: "empty-hint" }, s("empty_posts")));
    return;
  }
  // 新的賀圖排前面
  [...FANART].sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1))
             .forEach(item => grid.append(buildFanartCard(item)));
}

async function startFanart() {
  try {
    FANART = await fetchJSON("data/fanart.json");
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "fanart.html", render: renderFanart });
}
startFanart();
