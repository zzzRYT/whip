import { getRandomId, navigateTo, getWorkspaces } from './utils.js';

const app = document.querySelector('#app');
const sidebar = document.querySelector('.sidebar');
const openToggleButton = document.querySelector('.sidebar-open-toggle');
const allToggleButtons = document.querySelectorAll('.nav-toggle-button');

function toggleSidebarState() {
  app.classList.toggle('sidebar-collapsed');

  sidebar.classList.toggle('is-toggle');

  if (sidebar.classList.contains('is-toggle')) {
    openToggleButton.style.display = 'block';
  } else {
    openToggleButton.style.display = 'none';
  }
}

allToggleButtons.forEach((button) => {
  button.addEventListener('click', toggleSidebarState);
});

openToggleButton.style.display = 'none';

/** 워크스페이스 불러오기 */

const workspaceItems = document.querySelector('.workspace-items');

const addWorkspaceButton = document.querySelector('.add-page-button-container');
addWorkspaceButton.addEventListener('click', () => isToggleCreateModal());

export function renderWorkspaces() {
  workspaceItems.innerHTML = '';
  const workspaces = getWorkspaces();

  // 1. 데이터를 트리 구조로 변환
  const workspaceMap = new Map();
  workspaces.forEach((workspace) => {
    workspace.children = [];
    workspaceMap.set(workspace.id, workspace);
  });

  const rootWorkspaces = [];
  workspaces.forEach((workspace) => {
    if (workspace.parent && workspaceMap.has(workspace.parent)) {
      workspaceMap.get(workspace.parent).children.push(workspace);
    } else {
      rootWorkspaces.push(workspace);
    }
  });

  // 2. 재귀적으로 DOM 요소 생성
  function renderTree(items, container, depth = 0) {
    items.forEach((item) => {
      const workspaceDiv = document.createElement('div');
      workspaceDiv.className = 'workspace-item';
      workspaceDiv.id = item.id;
      workspaceDiv.textContent = item.name || '새 페이지';
      // 깊이에 따라 들여쓰기 적용
      workspaceDiv.style.paddingLeft = `${depth * 15}px`;

      container.appendChild(workspaceDiv);

      // 자식 요소가 있으면 재귀 호출
      if (item.children.length > 0) {
        renderTree(item.children, container, depth + 1);
      }
    });
  }

  renderTree(rootWorkspaces, workspaceItems);
}

workspaceItems.addEventListener('click', (e) => {
  const workspaceItem = e.target.closest('.workspace-item');
  if (workspaceItem) {
    const { id } = workspaceItem;
    if (id) {
      navigateTo(id);
    }
  }
});

renderWorkspaces();

/** workspace 생성 모달 */

const createWorkspaceModal = document.querySelector('.create-workspace-modal');

function isToggleCreateModal() {
  addWorkspaceButton.classList.toggle('is-create');

  if (addWorkspaceButton.classList.contains('is-create')) {
    createWorkspaceModal.style.display = 'flex';
  } else {
    createWorkspaceModal.style.display = 'none';
  }
}

createWorkspaceModal.addEventListener('click', (e) => {
  if (e.target.className !== 'create-workspace-modal') {
    return;
  }
  isToggleCreateModal();
});

const createNewPageButton = document.querySelector(
  '.new-page-button-container'
);

createNewPageButton.addEventListener('click', () => {
  addWorkspace('새 페이지');
  isToggleCreateModal();
});

function addWorkspace(name) {
  const workspaces = getWorkspaces();

  const newPage = {
    id: getRandomId(),
    name,
    contents: [],
    parent: '',
  };

  workspaces.push(newPage);
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  renderWorkspaces();
}
