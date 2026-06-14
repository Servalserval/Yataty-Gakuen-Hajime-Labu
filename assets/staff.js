/* ============================================================
   人員名單頁專用程式（staff.html）
   分三個區塊：繪師 / 設計師 / 成員
   每個人：頭像＋名字＋（點擊連到 X）
   資料在 data/staff.json。
   ============================================================ */

let STAFF = {};

/* 區塊定義：JSON 的 key 對應到顯示標題的 i18n key */
const STAFF_SECTIONS = [
  { key: "illustrators", label: "staff_illustrators" },
  { key: "designers",    label: "staff_designers" },
  { key: "members",      label: "staff_members" },
  { key: "mascot",       label: "staff_mascot" }
];

function buildStaffCard(person) {
  // 整張卡片是一個連到 X 的連結
  const card = el("a", {
    class: "staff-card",
    href: person.url, target: "_blank", rel: "noopener"
  });

  const avatar = el("img", {
    class: "staff-avatar",
    src: person.image, alt: t(person.name), loading: "lazy"
  });
  // 頭像載入失敗時用佔位圖（純色＋首字）避免破圖
  avatar.onerror = () => {
    avatar.removeAttribute("src");
    avatar.style.display = "flex";
  };

  card.append(avatar);
  card.append(el("div", { class: "staff-name" }, t(person.name)));
  if (person.handle) card.append(el("div", { class: "staff-handle" }, person.handle));
  return card;
}

function renderStaff() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = s(node.getAttribute("data-i18n"));
  });

  const root = document.getElementById("staff-root");
  root.textContent = "";

  STAFF_SECTIONS.forEach(sec => {
    const people = STAFF[sec.key];
    if (!Array.isArray(people) || !people.length) return;  // 空區塊不顯示

    const block = el("div", { class: "staff-block" });
    block.append(el("h3", {}, s(sec.label)));
    const grid = el("div", { class: "staff-grid" });
    people.forEach(p => grid.append(buildStaffCard(p)));
    block.append(grid);
    root.append(block);
  });
}

async function startStaff() {
  try {
    STAFF = await fetchJSON("data/staff.json");
  } catch (err) {
    showLoadError(err);
  }
  await Site.init({ page: "staff.html", render: renderStaff });
}
startStaff();
