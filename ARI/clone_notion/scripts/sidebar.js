export function initSidebar({
  ICONS,
  STORAGE_KEYS,
  SIDEBAR,
  showPage,
  createPageData,
  ensureIconFields,
  getPage,
  getActivePageId,
}) {
  const app = document.querySelector(".app");
  const collapseBtn = document.querySelector("#collapseBtn");
  const expandBtn = document.querySelector("#expandBtn");
  const root = document.documentElement;
  const handle = document.querySelector("#resizeHandle");
  const docListRoot = document.getElementById("docListRoot");
  const addPageBtn = document.getElementById("actionAddPage");

  // 접기/펼치기
  const sidebarCollapsed = (on) => {
    app.classList.toggle("is-collapsed", on);
    expandBtn.setAttribute("aria-expanded", !on);
    collapseBtn.setAttribute("aria-expanded", !on);
  };
  collapseBtn?.addEventListener("click", () => sidebarCollapsed(true));
  expandBtn?.addEventListener("click", () => sidebarCollapsed(false));

  // 리사이즈 복원
  const DEFAULT_W = getComputedStyle(root)
    .getPropertyValue(SIDEBAR.CSS_VAR)
    .trim();
  const savedWidth = localStorage.getItem(STORAGE_KEYS.SIDEBAR_WIDTH);
  if (savedWidth) root.style.setProperty(SIDEBAR.CSS_VAR, savedWidth);

  // 리사이즈 드래그
  let isResizing = false;
  let newWidth;
  function onDown(e) {
    isResizing = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  }
  function onMove(e) {
    if (!isResizing) return;
    const n = Math.min(SIDEBAR.MAX_W, Math.max(SIDEBAR.MIN_W, e.clientX));
    newWidth = n;
    root.style.setProperty(SIDEBAR.CSS_VAR, `${n}px`);
  }
  function onUp() {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    if (newWidth != null)
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_WIDTH, `${newWidth}px`);
  }
  handle?.addEventListener("dblclick", () => {
    root.style.setProperty(SIDEBAR.CSS_VAR, DEFAULT_W);
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_WIDTH, DEFAULT_W);
  });
  handle?.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  // 트리 생성
  function setActiveNode(node) {
    docListRoot
      .querySelectorAll(".tree-node.is-active")
      .forEach((n) => n.classList.remove("is-active"));
    node.classList.add("is-active");
  }
  function createTreeNode(
    titleOrPage = "새 페이지",
    depth = 0,
    parentId = null
  ) {
    const page =
      typeof titleOrPage === "string"
        ? createPageData(titleOrPage, parentId)
        : titleOrPage;
    ensureIconFields(page);
    const iconHtml =
      page.iconType === "emoji"
        ? `<span class="doc-icon-emoji" aria-hidden="true">${page.iconValue}</span>`
        : `<img src="${
            page.iconValue || ICONS.defaultPage
          }" alt="기본 페이지 아이콘" />`;

    const node = document.createElement("div");
    node.className = "tree-node";
    node.dataset.depth = depth;
    node.dataset.pageId = page.id;
    node.style.setProperty("--indent", depth);
    node.innerHTML = `
      <div class="tree-row">
        <div class="doc-slot">
          <div class="doc-icon">${iconHtml}</div>
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
                <img src="./assets/icons/star-icon.svg" alt="즐겨찾기" />즐겨찾기에 추가
              </button>
              <button class="dropdown-item" type="button" data-menu="rename">
                <img src="./assets/icons/rename-icon.svg" alt="이름 변경" />이름 바꾸기
              </button>
              <button class="dropdown-item" type="button" data-menu="delete">
                <img src="./assets/icons/trash-icon.svg" alt="휴지통" />휴지통으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="tree-children"></div>
    `;
    return node;
  }

  // 페이지 추가 버튼
  addPageBtn?.addEventListener("click", () => {
    const page = createPageData("새 페이지");
    const node = createTreeNode(page, 0);
    docListRoot.appendChild(node);
    showPage(page.id, node);
  });

  // 드롭다운 열림 상태 관리
  function closeDropdown() {
    docListRoot
      .querySelectorAll(".dropdown-menu.is-open")
      .forEach((el) => el.classList.remove("is-open"));
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest(".dropdown-menu, [data-action='more']")) return;
    closeDropdown();
  });

  // 트리 이벤트 위임
  docListRoot.addEventListener("click", (e) => {
    const btn = e.target.closest(
      "[data-action], .chevron, [data-menu], .tree-row"
    );
    if (!btn) return;

    const node = btn.closest(".tree-node");
    if (!node) return;

    const children = node.querySelector(":scope > .tree-children");
    const chevronImg = node.querySelector(":scope > .tree-row .chevron img");

    const action = btn.dataset.action;
    const menuAction = btn.dataset.menu;

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
      return;
    }

    // 행 클릭 → 페이지 표시
    if (btn.classList.contains("tree-row")) {
      const pageId = node.dataset.pageId;
      if (pageId) showPage(pageId, node);
      return;
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

        const pageId = node.dataset.pageId;
        const page = getPage(pageId);
        if (page) page.title = newTitle;

        // 활성 페이지면 헤더도 동기화(네비바 input에 반영)
        if (getActivePageId() === pageId) {
          const titleInput = document.getElementById("titleInput");
          if (titleInput) {
            titleInput.value = newTitle;
            const evt = new Event("input");
            titleInput.dispatchEvent(evt);
          }
        }

        // 브레드크럼 텍스트 갱신 (네비바에서 계산)
        const breadcrumbsEl = document.getElementById("breadcrumbs");
        if (breadcrumbsEl) {
          // showPage를 다시 호출하면 네비바 갱신 로직을 재사용
          showPage(getActivePageId() || pageId, node);
        }
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
}
