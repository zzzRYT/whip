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
