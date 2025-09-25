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

let pageSeq = 0;
const pages = new Map();
let activePageId = null;

// 새 페이지 데이터 생성하고 pages에 등록
function createPageData(title = "새 페이지", parentId = null) {
  const id = "p" + ++pageSeq;
  const data = { id, title, content: "", parentId };
  ensureIconFields(data);
  pages.set(id, data);
  return data;
}

// 사이드바 트리에서 활성 노드 표시 관리
function setActiveNode(node) {
  docListRoot
    .querySelectorAll(".tree-node.is-active")
    .forEach((n) => n.classList.remove("is-active"));
  node.classList.add("is-active");
}

const titleInputEl = document.getElementById("titleInput");
const breadcrumbsEl = document.getElementById("breadcrumbs");

// 페이지에서 제목 변경 시 : 페이지-사이드바-브레드크럼 동기화
function applyHeaderTitleToState() {
  const node = getActiveNode();
  if (!node) return;

  const pid = node.dataset.pageId;
  const page = pages.get(pid);
  if (!page) return;

  const newTitle = (titleInputEl.value || "").trim() || "제목 없음";
  page.title = newTitle;
  const titleEl = node.querySelector(":scope > .tree-row .doc-title");
  if (titleEl) titleEl.textContent = newTitle;

  updateBreadcrumbsFromActive();
}

// 실시간 동기화
titleInputEl?.addEventListener("input", applyHeaderTitleToState);
titleInputEl?.addEventListener("blur", applyHeaderTitleToState);

// 메인 영역에 페이지 표시
function showPage(pageId, node) {
  const page = pages.get(pageId);
  if (!page) return;

  activePageId = pageId;

  if (titleInputEl) {
    titleInputEl.value = page.title;
    if (typeof autoResize === "function") autoResize(titleInputEl);
  }
  ensureIconFields(page);
  renderHeaderIcon(page.iconType, page.iconValue);

  if (node) setActiveNode(node);

  updateBreadcrumbsFromActive();
}

const addPageBtn = document.getElementById("actionAddPage");
const docListRoot = document.getElementById("docListRoot");

const ICONS = {
  open: "./assets/icons/chevron-down-icon.svg",
  close: "./assets/icons/chevron-up-icon.svg",
};

// 새 tree-node 생성
function createTreeNode(titleOrPage = "새 페이지", depth = 0, parentId = null) {
  const page =
    typeof titleOrPage === "string"
      ? createPageData(titleOrPage, parentId)
      : titleOrPage;

  ensureIconFields(page);
  const iconPage =
    page.iconType === "emoji"
      ? `<span class="doc-icon-emoji" aria-hidden="true">${page.iconValue}</span>`
      : `<img src="${
          page.iconValue || ICON_DEFAULT_SRC
        }" alt="기본 페이지 아이콘" />`;

  const node = document.createElement("div");
  node.className = "tree-node";
  node.dataset.depth = depth;
  node.dataset.pageId = page.id;
  node.style.setProperty("--indent", depth);

  node.innerHTML = `
      <div class="tree-row">
        <div class="doc-slot">
          <div class="doc-icon">
            ${iconPage}
          </div>
          <button class="chevron" type="button" aria-label="하위 페이지 토글" data-action="toggle">
            <img src="${ICONS.close}" alt="접기" />
          </button>
        </div>
        <div class="doc-title">${page.title}</div>
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
  const page = createPageData("새 페이지");
  const node = createTreeNode(page, 0);
  docListRoot.appendChild(node);

  showPage(page.id, node);
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
    const parentId = node.dataset.pageId;
    const childPage = createPageData("새 페이지", parentId);

    const childNode = createTreeNode(childPage, depth, parentId);
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

      const pid = node.dataset.pageId;
      const page = pages.get(pid);
      if (page) page.title = newTitle;

      // 활성 페이지면 헤더도 동기화
      if (activePageId === pid && titleInputEl) {
        titleInputEl.value = newTitle;
        if (typeof autoResize === "function") autoResize(titleInputEl);
      }

      updateBreadcrumbsFromActive();
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

// 활성 노드 가져오기
function getActiveNode() {
  return (
    docListRoot.querySelector(".tree-node.is-active") ||
    (activePageId &&
      docListRoot.querySelector(`.tree-node[data-page-id="${activePageId}"]`))
  );
}

// 활성 노드 기준으로 브레드크럼 텍스트 갱신
function updateBreadcrumbsFromActive() {
  const node = getActiveNode();
  if (!node) return;
  const path = getBreadcrumbPath(node);
  const breadcrumbsEl = document.getElementById("breadcrumbs");
  if (breadcrumbsEl) breadcrumbsEl.textContent = path;
}

docListRoot.addEventListener("click", (e) => {
  const row = e.target.closest(".tree-row");
  if (!row) return;

  const node = row.closest(".tree-node");
  const pid = node.dataset.pageId;
  if (pid) showPage(pid, node);
});

const starBtn = document.getElementById("starBtn");
const img = starBtn.querySelector("img");

starBtn.addEventListener("click", () => {
  img.src = img.src.includes("star-icon.svg")
    ? "./assets/icons/star-fill-icon.svg"
    : "./assets/icons/star-icon.svg";
});

const titleInput = document.getElementById("titleInput");

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// 헤더 타이틀 입력 시 높이 자동 조정
titleInput.addEventListener("input", () => autoResize(titleInput));

// 초기 로드 시에도 높이 맞춤
window.addEventListener("load", () => autoResize(titleInput));

const ICON_DEFAULT_SRC = "./assets/icons/page-default-icon.svg";

function ensureIconFields(page) {
  if (!("iconType" in page)) page.iconType = "image"; // 'image' | 'emoji'
  if (!("iconValue" in page)) page.iconValue = ICON_DEFAULT_SRC; // img src or emoji char
}

const iconBtn = document.getElementById("iconBtn");

function renderHeaderIcon(type, value) {
  if (type === "emoji") {
    iconBtn.innerHTML = `<span class="doc-emoji" aria-hidden="true">${value}</span>`;
  } else {
    const src = value || ICON_DEFAULT_SRC;
    iconBtn.innerHTML = `<img src="${src}" alt="기본 페이지 아이콘" />`;
  }
}

function updateSidebarIcon(pageId, type, value) {
  const node = document.querySelector(`.tree-node[data-page-id="${pageId}"]`);
  if (!node) return;

  const iconHost = node.querySelector(".doc-icon");
  if (!iconHost) return;

  if (type === "emoji") {
    iconHost.innerHTML = `<span class="doc-icon-emoji" aria-hidden="true">${value}</span>`;
  } else {
    const src = value || ICON_DEFAULT_SRC;
    iconHost.innerHTML = `<img src="${src}" alt="기본 페이지 아이콘" />`;
  }
}

// 모듈 스코프에서는 전역 UMD를 window로 접근
const { createPopup } = window.picmoPopup || {};
if (!createPopup) {
  console.error("picmoPopup 로드 실패");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("iconBtn");
  if (!btn) return;

  // 현재 활성 페이지 정보 확보
  const getActivePage = () => pages?.get?.(activePageId);

  {
    const page = getActivePage();
    if (page) {
      ensureIconFields(page);
      renderHeaderIcon(page.iconType, page.iconValue);
    } else {
      renderHeaderIcon("image", ICON_DEFAULT_SRC);
    }
  }

  // PicMo 팝업 생성
  const picker = createPopup(
    { rootElement: document.body, showPreview: false, animate: true },
    { referenceElement: btn, triggerElement: btn, position: "bottom-start" }
  );

  btn.addEventListener("click", () => picker.toggle());

  // 이모지 선택 → 상태 저장 → 헤더/사이드바 동기화
  picker.addEventListener("emoji:select", (e) => {
    const page = getActivePage();
    const emoji = e.emoji;

    if (page) {
      ensureIconFields(page);
      page.iconType = "emoji";
      page.iconValue = emoji;
      renderHeaderIcon("emoji", emoji);
      updateSidebarIcon(page.id, "emoji", emoji);
    } else {
      renderHeaderIcon("emoji", emoji);
    }
  });
});
