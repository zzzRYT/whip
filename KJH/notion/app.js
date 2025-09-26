// Notion 
// =====================
// html data-theme="light|dark"
const THEME_KEY = "vnotion:theme"; 

function applyTheme(theme) {
  // DOM 루트에 data-theme를 설정 → CSS 변수 교체
  document.documentElement.setAttribute("data-theme", theme);
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
}

function loadTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") return t;
  } catch (e) {}
  // 기본값은 다크 테마
  return "dark";
}
const settingsOverlay = document.querySelector("#settingsOverlay");
const themeToggle = document.querySelector("#themeToggle"); // "Use light theme" 체크박스

function openSettings() {
  // 현재 테마 반영: 'light'면 체크, 'dark'면 체크 해제
  currentTheme = loadTheme();
  if (themeToggle) themeToggle.checked = currentTheme === "light";
  if (settingsOverlay) settingsOverlay.style.display = "grid";
}

// 오버레이
document.querySelectorAll("#actionSettings").forEach((el) => {
  el.addEventListener("click", openSettings);
});

document.querySelector("#settingsClose")?.addEventListener("click", () => {
  if (settingsOverlay) settingsOverlay.style.display = "none";
});

settingsOverlay?.addEventListener("click", (e) => {
  if (e.target === settingsOverlay) settingsOverlay.style.display = "none";
});

// 라이트/다크 전환
themeToggle?.addEventListener("change", () =>
  themeToggle.checked
    ? (applyTheme("light"), saveTheme("light"), currentTheme = "light")
    : (applyTheme("dark"), saveTheme("dark"), currentTheme = "dark")
);

document.querySelector("#settingsClose")?.addEventListener("click", () => {
  if (settingsOverlay) settingsOverlay.style.display = "none";
});

settingsOverlay?.addEventListener("click", (e) => {
  if (e.target === settingsOverlay) settingsOverlay.style.display = "none";
});

//to-do리스트
const editor = document.querySelector("#editor");

  document.querySelector("#todoBtn")?.addEventListener("click", () => {
    const box = document.createElement("div");
    box.innerHTML = '<label><input type="checkbox"> <span>To-do</span></label>';
    editor.appendChild(box);   
    if (typeof saveEditor === "function") saveEditor();
  });