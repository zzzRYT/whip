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
