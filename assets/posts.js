/* ============================================================
   活動貼文頁專用程式（posts.html）
   每則貼文是一張預覽卡：（可選）圖片＋作者日期＋內文（可展開）＋查看原文
   資料在 data/posts.json。
   ※ 純靜態網站無法自動抓取 X 內文，故內文／圖片為人工填寫。
   ============================================================ */

let POSTS = [];

function buildPostCard(post) {
  const card = el("article", { class: "post-card" });

  // 圖片（可選）：點擊放大
  if (post.image) {
    const img = el("img", { class: "post-img", src: post.image, alt: t(post.text) || "post image", loading: "lazy" });
    img.onerror = () => img.remove();
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
    card.append(img);
  }

  const body = el("div", { class: "post-body" });

  // 作者＋日期
  const meta = el("div", { class: "post-meta" });
  if (post.author) meta.append(el("span", { class: "author" }, post.author));
  if (post.date)   meta.append(el("span", {}, post.date));
  body.append(meta);

  // 內文（預設幾行，可展開）
  if (post.text) body.append(makeClampable(t(post.text)));

  // 右下角「查看原文」
  const footer = el("div", { class: "post-footer" });
  footer.append(el("a", {
    class: "post-original",
    href: post.url, target: "_blank", rel: "noopener"
  }, s("post_original") + " ↗"));
  body.append(footer);

  card.append(body);
  return card;
}

function renderPosts() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const grid = document.getElementById("post-grid");
  grid.textContent = "";
  if (!POSTS.length) {
    grid.append(el("p", { class: "empty-hint" }, s("empty_posts")));
    return;
  }
  // 新的貼文排前面（依日期）
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
            .forEach(p => grid.append(buildPostCard(p)));
}

async function startPosts() {
  try {
    POSTS = await fetchJSON("data/posts.json");
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "posts.html", render: renderPosts });
}
startPosts();
