const collapseBtn = document.querySelector("#collapseBtn");
const expandBtn = document.querySelector("#expandBtn");
const app = document.querySelector(".app");

// 사이드바 상태 전환 함수
function sidebarCollapsed(on) {
  // 상태 클래스 토글
  app.classList.toggle("is-collapsed", on);
  // 접근성 속성 업데이트
  expandBtn.setAttribute("aria-expanded", !on);
  collapseBtn.setAttribute("aria-expanded", !on);
}

collapseBtn.addEventListener("click", () => sidebarCollapsed(true));
expandBtn.addEventListener("click", () => sidebarCollapsed(false));

const STORAGE_KEYS = { SIDEBAR_WIDTH: "notionClone:sidebar-width" };
const root = document.documentElement;
const sidebar = document.querySelector("#sidebar");
const handle = document.querySelector("#resizeHandle");

const MIN_W = 220;
const MAX_W = 420;
let isResizing = false;
const DEFAULT_W = getComputedStyle(root).getPropertyValue("--sidebar-w").trim();

// 초기 너비 복원
const savedWidth = localStorage.getItem(STORAGE_KEYS.SIDEBAR_WIDTH);
if (savedWidth) {
  root.style.setProperty("--sidebar-w", savedWidth);
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const setWidth = (px) => root.style.setProperty("--sidebar-w", `${px}px`);
let newWidth;

// 드래그 시작
function onDown(e) {
  isResizing = true;
  document.body.style.userSelect = "none";
  document.body.style.cursor = "ew-resize";
  e.preventDefault();
}

// 드래그 중
function onMove(e) {
  if (!isResizing) return;

  newWidth = clamp(e.clientX, MIN_W, MAX_W);
  setWidth(newWidth);
}

// 드래그 종료
function onUp() {
  if (!isResizing) return;
  isResizing = false;

  document.body.style.userSelect = "";
  document.body.style.cursor = "";

  localStorage.setItem(STORAGE_KEYS.SIDEBAR_WIDTH, `${newWidth}px`);
}

// 더블클릭 : 기본값으로 리셋
handle.addEventListener("dblclick", () => {
  root.style.setProperty("--sidebar-w", DEFAULT_W);
  localStorage.setItem(STORAGE_KEYS.SIDEBAR_WIDTH, DEFAULT_W);
});

handle.addEventListener("mousedown", onDown);
window.addEventListener("mousemove", onMove);
window.addEventListener("mouseup", onUp);

const addPageBtn = document.getElementById("actionAddPage");
const docListRoot = document.getElementById("docListRoot");

const ICONS = {
  open: "./assets/icons/chevron-down-icon.svg",
  close: "./assets/icons/chevron-up-icon.svg",
  page: "./assets/icons/page-default-icon.svg",
};

// 새 tree-node 생성 함수
function createTreeNode(title = "새 페이지", depth = 0) {
  const node = document.createElement("div");
  node.className = "tree-node";
  node.dataset.depth = depth;
  node.style.setProperty("--indent", depth);

  node.innerHTML = `
      <div class="tree-row">
        <div class="doc-slot">
          <div class="doc-icon">
            <img src="${ICONS.page}" alt="기본 문서 아이콘" />
          </div>
          <button class="chevron" type="button" aria-label="하위 페이지 토글" data-action="toggle">
            <img src="${ICONS.close}" alt="접기" />
          </button>
        </div>
        <div class="doc-title">${title}</div>
        <div class="tree-actions">
          <button class="ghost" type="button" aria-label="더보기" data-action="more">
            <img src="./assets/icons/ellipsis-small-icon.svg" alt="더보기" />
          </button>
          <button class="ghost" type="button" aria-label="하위 페이지 추가" data-action="add-child">
            <img src="./assets/icons/plus-small-icon.svg" alt="하위 페이지 추가" />
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-list">
              <button class="dropdown-item" type="button" data-menu="duplicate">
              <img src="./assets/icons/star-icon.svg" alt="즐겨찾기" />
              즐겨찾기에 추가</button>
              <button class="dropdown-item" type="button" data-menu="rename">
              <img src="./assets/icons/rename-icon.svg" alt="이름 변경" />
              이름 바꾸기</button>
              <button class="dropdown-item" type="button" data-menu="delete">
              <img src="./assets/icons/trash-icon.svg" alt="휴지통" />
              휴지통으로 이동</button>
            </div>
          </div>
        </div>
      </div>
      <div class="tree-children"></div>
    `;
  return node;
}

addPageBtn?.addEventListener("click", () => {
  const node = createTreeNode("새 페이지", 0);
  docListRoot.appendChild(node);
});

function closeDropdown() {
  docListRoot.querySelectorAll(".dropdown-menu.is-open").forEach((el) => {
    el.classList.remove("is-open");
  });
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".dropdown-menu, [data-action='more']")) return;
  closeDropdown();
});

// 이벤트 위임: 토글/하위 추가/더보기
docListRoot.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action], .chevron, [data-menu]");
  if (!btn) return;

  const action = btn.dataset.action;
  const menuAction = btn.dataset.menu;
  const node = btn.closest(".tree-node");
  if (!node) return;

  const children = node.querySelector(":scope > .tree-children");
  const chevronImg = node.querySelector(":scope > .tree-row .chevron img");

  if (action === "add-child") {
    const depth = (parseInt(node.dataset.depth, 10) || 0) + 1;
    const childNode = createTreeNode("새 페이지", depth);
    children.appendChild(childNode);

    node.classList.add("is-open");
    chevronImg.src = ICONS.open;
    chevronImg.alt = "펼치기";
    return;
  }

  if (action === "toggle") {
    const isOpen = node.classList.toggle("is-open");
    chevronImg.src = isOpen ? ICONS.open : ICONS.close;
    chevronImg.alt = isOpen ? "펼치기" : "접기";
    return;
  }

  if (action === "more") {
    const actions = node.querySelector(":scope > .tree-row .tree-actions");
    const menu = actions.querySelector(":scope > .dropdown-menu");
    menu.classList.toggle("is-open");
  }

  // 드롭다운: 이름 변경
  if (menuAction === "rename") {
    closeDropdown();
    const titleEl = node.querySelector(":scope > .tree-row .doc-title");
    const oldTitle = titleEl.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldTitle;
    input.className = "rename-input";

    titleEl.replaceWith(input);
    input.focus();

    const saveRename = () => {
      const newTitle = input.value.trim() || oldTitle;
      const newTitleEl = document.createElement("div");
      newTitleEl.className = "doc-title";
      newTitleEl.textContent = newTitle;
      input.replaceWith(newTitleEl);
    };

    input.addEventListener("blur", saveRename, { once: true });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") input.blur();
      if (ev.key === "Escape") {
        input.value = oldTitle;
        input.blur();
      }
    });
  }
});

function getBreadcrumbPath(node) {
  const path = [];
  let current = node;

  while (current) {
    const titleEl = current.querySelector(":scope > .tree-row .doc-title");
    if (titleEl) path.unshift(titleEl.textContent.trim());

    current = current.closest(".tree-children")?.closest(".tree-node");
  }

  return path.join(" / ");
}

docListRoot.addEventListener("click", (e) => {
  const row = e.target.closest(".tree-row");
  if (!row) return;

  const node = row.closest(".tree-node");
  const path = getBreadcrumbPath(node);

  document.getElementById("breadcrumbs").textContent = path;
});

const starBtn = document.getElementById("starBtn");
const img = starBtn.querySelector("img");

starBtn.addEventListener("click", () => {
  img.src = img.src.includes("star-icon.svg")
    ? "./assets/icons/star-fill-icon.svg"
    : "./assets/icons/star-icon.svg";
});
