const app = document.querySelector('#app');
const sidebar = document.querySelector('.sidebar');
const openToggleButton = document.querySelector('.sidebar-open-toggle');
const allToggleButtons = document.querySelectorAll('.nav-toggle-button');

function toggleSidebarState() {
  // #app 컨테이너에 클래스를 토글하여 grid 레이아웃을 변경합니다.
  app.classList.toggle('sidebar-collapsed');

  // 사이드바 자체의 상태를 추적하기 위한 클래스도 토글합니다.
  sidebar.classList.toggle('is-toggle');

  // 사이드바가 숨겨졌는지 여부에 따라 열기 버튼을 표시/숨김 처리합니다.
  if (sidebar.classList.contains('is-toggle')) {
    openToggleButton.style.display = 'block';
  } else {
    openToggleButton.style.display = 'none';
  }
}

// 두 토글 버튼에 클릭 이벤트 리스너를 추가합니다.
allToggleButtons.forEach(button => {
  button.addEventListener('click', toggleSidebarState);
});

// 초기 상태: 사이드바가 보이므로 열기 버튼은 숨깁니다.
openToggleButton.style.display = 'none';
