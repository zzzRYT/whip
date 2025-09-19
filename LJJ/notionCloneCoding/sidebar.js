import { getRandomId, navigateTo } from './utils.js';

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

function getWorkspaces() {
  const searchStorage = localStorage.getItem('workspaces');
  const workspaces = JSON.parse(searchStorage) || [];
  return workspaces;
}

const addWorkspaceButton = document.querySelector('.add-page-button-container');
addWorkspaceButton.addEventListener('click', () => isToggleCreateModal());

function renderWorkspaces() {
  workspaceItems.innerHTML = '';
  const workspaces = getWorkspaces();

  workspaces.forEach((workspace) => {
    const workspaceDiv = document.createElement('div');
    workspaceDiv.className = 'workspace-item';
    workspaceDiv.id = workspace.id;
    workspaceDiv.textContent = workspace.name || `새 페이지`;
    workspaceItems.appendChild(workspaceDiv);
  });
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
    contents: {},
    parent: null,
  };

  workspaces.push(newPage);
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  renderWorkspaces();
}
