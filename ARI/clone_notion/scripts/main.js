// 공용 상수 & 상태
const STORAGE_KEYS = { SIDEBAR_WIDTH: "notionClone:sidebar-width" };
const ICONS = {
  open: "./assets/icons/chevron-down-icon.svg",
  close: "./assets/icons/chevron-up-icon.svg",
  defaultPage: "./assets/icons/page-default-icon.svg",
  star: "./assets/icons/star-icon.svg",
  starFill: "./assets/icons/star-fill-icon.svg",
};
const SIDEBAR = { MIN_W: 220, MAX_W: 420, CSS_VAR: "--sidebar-w" };

const appState = {
  pageSeq: 0,
  pages: new Map(),
  activePageId: null,
};

// 공용 로직
export function ensureIconFields(page) {
  if (!("iconType" in page)) page.iconType = "image";
  if (!("iconValue" in page)) page.iconValue = ICONS.defaultPage;
}
export function createPageData(title = "새 페이지", parentId = null) {
  const id = "p" + ++appState.pageSeq;
  const data = { id, title, content: "", parentId };
  ensureIconFields(data);
  appState.pages.set(id, data);
  return data;
}
export function getPage(id) {
  return appState.pages.get(id);
}
export function getActivePageId() {
  return appState.activePageId;
}
export function setActivePageId(id) {
  appState.activePageId = id;
}

// 네비바/사이드바 초기화
import { initNavbar } from "./navbar.js";
import { initSidebar } from "./sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
  // 네비바가 showPage 콜백을 리턴함
  const showPage = initNavbar({ appState, ICONS });

  // 사이드바에 showPage 전달
  initSidebar({
    appState,
    ICONS,
    STORAGE_KEYS,
    SIDEBAR,
    showPage,
    createPageData,
    ensureIconFields,
    getPage,
    getActivePageId,
  });
});
