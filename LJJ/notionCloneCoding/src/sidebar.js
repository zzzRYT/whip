import { getRandomId, navigateTo, getWorkspaces } from './utils.js';

const app = document.querySelector('#app');
const sidebar = document.querySelector('.sidebar');
const openToggleButton = document.querySelector('.sidebar-open-toggle');
const allToggleButtons = document.querySelectorAll('.nav-toggle-button');

// --- 드롭다운 메뉴 관리 로직 ---
let activeDropdown = null;

function closeActiveDropdown() {
  if (activeDropdown) {
    activeDropdown.remove();
    activeDropdown = null;
  }
}

window.addEventListener('click', (e) => {
  if (
    activeDropdown &&
    !activeDropdown.contains(e.target) &&
    !e.target.closest('.workspace-dropdown-menu')
  ) {
    closeActiveDropdown();
  }
});

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

  function renderTree(items, container, depth = 0) {
    items.forEach((item) => {
      const workspaceDiv = document.createElement('div');
      workspaceDiv.className = 'workspace-item';
      workspaceDiv.id = item.id;
      const template = `
        <div>
          <button class="toggle-dropdown-child">
            <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 12 12" class="chevronDownRoundedThick" style="width: 12px; height: 12px; display: block; fill: rgb(128, 125, 120); flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(0deg); opacity: 1;"><path d="M6.02734 8.80274C6.27148 8.80274 6.47168 8.71484 6.66211 8.51465L10.2803 4.82324C10.4268 4.67676 10.5 4.49609 10.5 4.28125C10.5 3.85156 10.1484 3.5 9.72363 3.5C9.50879 3.5 9.30859 3.58789 9.15234 3.74902L6.03223 6.9668L2.90722 3.74902C2.74609 3.58789 2.55078 3.5 2.33105 3.5C1.90137 3.5 1.55469 3.85156 1.55469 4.28125C1.55469 4.49609 1.62793 4.67676 1.77441 4.82324L5.39258 8.51465C5.58789 8.71973 5.78808 8.80274 6.02734 8.80274Z"></path></svg>
          </button>
          <span class="workspace-item-name">${item.name || '새 페이지'}</span>
        </div>
        <div>
          <button class="workspace-dropdown-menu">
            <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" class="ellipsis" style="width: 22px; height: 22px; display: block; fill: rgb(128, 125, 120); flex-shrink: 0;"><path d="M4 11.375a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75"></path></svg>
          </button>
          <button class="add-child-button">
            <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" class="plus" style="width: 22px; height: 22px; display: block; fill: rgb(128, 125, 120); flex-shrink: 0;"><path d="M10 4.375a.625.625 0 0 1 .625.625v4.375H15a.625.625 0 0 1 0 1.25h-4.375V15a.625.625 0 0 1-1.25 0v-4.375H5a.625.625 0 0 1 0-1.25h4.375V5a.625.625 0 0 1 .625-.625Z"></path></svg>
          </button>
        </div>
      `;
      workspaceDiv.innerHTML = template;
      workspaceDiv.style.paddingLeft = `${depth * 15}px`;
      container.appendChild(workspaceDiv);

      if (item.children.length > 0) {
        renderTree(item.children, container, depth + 1);
      }
    });
  }

  renderTree(rootWorkspaces, workspaceItems);
}

function createDropdownMenu(workspaceId, buttonElement) {
  if (activeDropdown && activeDropdown.dataset.workspaceId === workspaceId) {
    closeActiveDropdown();
    return;
  }
  closeActiveDropdown();

  const menu = document.createElement('div');
  menu.className = 'workspace-item-dropdown';
  menu.dataset.workspaceId = workspaceId;
  menu.innerHTML = `<button class="dropdown-delete-button">삭제</button>`;

  menu
    .querySelector('.dropdown-delete-button')
    .addEventListener('click', () => {
      if (confirm('이 워크스페이스와 모든 하위 페이지를 삭제하시겠습니까?')) {
        deleteWorkspace(workspaceId);
      }
      closeActiveDropdown();
    });

  document.body.appendChild(menu);
  activeDropdown = menu;

  const buttonRect = buttonElement.getBoundingClientRect();
  menu.style.position = 'absolute';
  menu.style.top = `${buttonRect.bottom + 5}px`;
  menu.style.left = `${buttonRect.left}px`;
}

function deleteWorkspace(workspaceId) {
  let workspaces = getWorkspaces();
  const idsToDelete = new Set([workspaceId]);
  const queue = [workspaceId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = workspaces.filter((ws) => ws.parent === currentId);
    for (const child of children) {
      if (!idsToDelete.has(child.id)) {
        idsToDelete.add(child.id);
        queue.push(child.id);
      }
    }
  }

  workspaces = workspaces.filter((ws) => !idsToDelete.has(ws.id));
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  renderWorkspaces();
}

workspaceItems.addEventListener('click', (e) => {
  const workspaceItem = e.target.closest('.workspace-item');
  if (!workspaceItem) return;

  if (e.target.closest('.toggle-dropdown-child')) {
    e.stopPropagation();
    const svgElement = e.target.closest('button').querySelector('svg');
    const isRotated = svgElement.style.transform === 'rotateZ(-90deg)';
    svgElement.style.transform = isRotated
      ? 'rotateZ(0deg)'
      : 'rotateZ(-90deg)';
    const workspaces = getWorkspaces();
    const toggleChildren = (id, shouldHide) => {
      workspaces
        .filter((ws) => ws.parent === id)
        .forEach((child) => {
          const childElement = document.getElementById(child.id);
          if (childElement) {
            childElement.style.display = shouldHide ? 'none' : 'flex';
            toggleChildren(child.id, shouldHide);
          }
        });
    };
    toggleChildren(workspaceItem.id, !isRotated);
    return;
  }

  if (e.target.closest('.workspace-dropdown-menu')) {
    e.stopPropagation();
    const dropdownButton = e.target.closest('.workspace-dropdown-menu');
    createDropdownMenu(workspaceItem.id, dropdownButton);
    return;
  }

  if (e.target.closest('.add-child-button')) {
    e.stopPropagation();
    addWorkspace('새 페이지', workspaceItem.id);
    return;
  }

  navigateTo(workspaceItem.id);
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

function addWorkspace(name, parent = '') {
  const workspaces = getWorkspaces();
  const newPage = {
    id: getRandomId(),
    name,
    contents: [],
    parent,
  };
  workspaces.push(newPage);
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  renderWorkspaces();
}
