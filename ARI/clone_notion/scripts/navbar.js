import {
  ensureIconFields,
  getPage,
  getActivePageId,
  setActivePageId,
} from "./main.js";

export function initNavbar({ appState, ICONS }) {
  const titleInput = document.getElementById("titleInput");
  const breadcrumbsEl = document.getElementById("breadcrumbs");
  const starBtn = document.getElementById("starBtn");
  const starImg = starBtn?.querySelector("img");
  const iconBtn = document.getElementById("iconBtn");

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  function renderHeaderIcon(type, value) {
    if (type === "emoji") {
      iconBtn.innerHTML = `<span class="doc-emoji" aria-hidden="true">${value}</span>`;
    } else {
      const src = value || ICONS.defaultPage;
      iconBtn.innerHTML = `<img src="${src}" alt="기본 페이지 아이콘" />`;
    }
  }
  function updateSidebarIcon(pageId, type, value) {
    const node = document.querySelector(`.tree-node[data-page-id="${pageId}"]`);
    if (!node) return;
    const host = node.querySelector(".doc-icon");
    if (!host) return;
    if (type === "emoji") {
      host.innerHTML = `<span class="doc-icon-emoji" aria-hidden="true">${value}</span>`;
    } else {
      const src = value || ICONS.defaultPage;
      host.innerHTML = `<img src="${src}" alt="기본 페이지 아이콘" />`;
    }
  }

  function getActiveNode() {
    return (
      document.querySelector(".tree-node.is-active") ||
      (appState.activePageId &&
        document.querySelector(
          `.tree-node[data-page-id="${appState.activePageId}"]`
        ))
    );
  }
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
  function updateBreadcrumbsFromActive() {
    const node = getActiveNode();
    if (!node) return;
    const path = getBreadcrumbPath(node);
    if (breadcrumbsEl) breadcrumbsEl.textContent = path;
  }

  // showPage: 사이드바에서 import 없이 호출하도록 여기서 제공
  function showPage(pageId, node) {
    const page = getPage(pageId);
    if (!page) return;

    setActivePageId(pageId);

    if (titleInput) {
      titleInput.value = page.title;
      autoResize(titleInput);
    }
    ensureIconFields(page);
    renderHeaderIcon(page.iconType, page.iconValue);

    if (node) {
      // active 표시
      document
        .querySelectorAll(".tree-node.is-active")
        .forEach((n) => n.classList.remove("is-active"));
      node.classList.add("is-active");
    }

    updateBreadcrumbsFromActive();
  }

  // 타이틀 실시간 동기화
  titleInput?.addEventListener("input", () => {
    autoResize(titleInput);
    const pageId = getActivePageId();
    const page = getPage(pageId);
    if (!page) return;
    const newTitle = (titleInput.value || "").trim() || "제목 없음";
    page.title = newTitle;
    const node = document.querySelector(`.tree-node[data-page-id="${pageId}"]`);
    const titleEl = node?.querySelector(":scope > .tree-row .doc-title");
    if (titleEl) titleEl.textContent = newTitle;
    updateBreadcrumbsFromActive();
  });
  window.addEventListener("load", () => titleInput && autoResize(titleInput));

  // 즐겨찾기 토글
  starBtn?.addEventListener("click", () => {
    const isStar = starImg.src.includes("star-icon.svg");
    starImg.src = isStar ? ICONS.starFill : ICONS.star;
  });

  // PicMo 연결
  const { createPopup } = window.picmoPopup || {};
  if (!createPopup) console.error("picmoPopup 로드 실패");
  if (iconBtn && createPopup) {
    const picker = createPopup(
      { rootElement: document.body, showPreview: false, animate: true },
      {
        referenceElement: iconBtn,
        triggerElement: iconBtn,
        position: "bottom-start",
      }
    );
    iconBtn.addEventListener("click", () => picker.toggle());
    picker.addEventListener("emoji:select", (e) => {
      const pageId = getActivePageId();
      const page = getPage(pageId);
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
  }

  // 초기 아이콘 렌더
  (function initIcon() {
    const pageId = getActivePageId();
    const page = pageId && getPage(pageId);
    if (page) {
      ensureIconFields(page);
      renderHeaderIcon(page.iconType, page.iconValue);
    } else {
      renderHeaderIcon("image", ICONS.defaultPage);
    }
  })();

  return showPage; // 사이드바에서 사용할 콜백
}
