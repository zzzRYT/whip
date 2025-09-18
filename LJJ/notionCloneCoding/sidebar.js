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
addWorkspaceButton.addEventListener('click', () =>
  addWorkspace('새로운 어쩌고')
);

function addWorkspace(name) {
  const workspaces = getWorkspaces();
  workspaces.push({ name });
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  const workspaceDiv = document.createElement('div');
  workspaceDiv.className = 'workspace-item';
  workspaceDiv.textContent = name || `워크스페이스 ${index + 1}`;
  workspaceItems.appendChild(workspaceDiv);
}

function renderWorkspaces() {
  const workspaces = getWorkspaces();

  workspaces.forEach((workspace, index) => {
    const workspaceDiv = document.createElement('div');
    workspaceDiv.className = 'workspace-item';
    workspaceDiv.textContent = workspace.name || `워크스페이스 ${index + 1}`;
    workspaceItems.appendChild(workspaceDiv);
  });
}

renderWorkspaces();
