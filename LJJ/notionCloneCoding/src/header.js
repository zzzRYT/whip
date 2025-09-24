import { getIdFromUrl, getWorkspaces, navigateTo } from './utils.js';

const folderHistory = document.querySelector('.folder-history');

function updateHeaderHistory() {
  const currentId = getIdFromUrl();
  if (!currentId) {
    folderHistory.innerHTML = '<button>환영합니다</button>';
    return;
  }

  const workspaces = getWorkspaces();
  const workspaceMap = new Map(workspaces.map((ws) => [ws.id, ws]));
  const currentWorkspace = workspaceMap.get(currentId);

  if (currentWorkspace) {
    const path = [];
    let current = currentWorkspace;

    while (current) {
      path.unshift({ name: current.name, id: current.id });
      current = current.parent ? workspaceMap.get(current.parent) : null;
    }

    folderHistory.innerHTML = path
      .map(
        (p) =>
          `<button data-id="${p.id}" class="history-item">${p.name}</button>`
      )
      .join('<span> / </span>');
  } else {
    folderHistory.innerHTML = '<button>외부기억장치</button>';
  }
}

window.addEventListener('urlchange', updateHeaderHistory);

updateHeaderHistory();

folderHistory.addEventListener('click', (e) => {
  const historyButton = e.target.closest('.history-item');
  if (historyButton) {
    const { id } = historyButton.dataset;
    if (id) {
      navigateTo(id);
    }
  }
});
