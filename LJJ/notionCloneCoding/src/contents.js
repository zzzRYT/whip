import { updateHeaderHistory } from './header.js';
import { renderWorkspaces } from './sidebar.js';
import { getIdFromUrl, getWorkspaces } from './utils.js';
import { BlockNoteEditor } from '@blocknote/core';

const workspaceNameElement = document.querySelector('.workspace-name');

const editor = BlockNoteEditor.create();
editor.mount(document.getElementById('editor'));

export function getContents() {
  const currentId = getIdFromUrl();
  const workspaces = getWorkspaces();
  if (currentId) {
    const currentWorkspace = workspaces.find((ws) => ws.id === currentId);
    if (currentWorkspace) {
      workspaceNameElement.value = currentWorkspace.name;
      const content =
        currentWorkspace.contents && currentWorkspace.contents.length > 0
          ? currentWorkspace.contents
          : [];
      editor.replaceBlocks(editor.topLevelBlocks, content);
      return currentWorkspace;
    }
  }
  workspaceNameElement.value = '';
  editor.replaceBlocks(editor.topLevelBlocks, []);
  return null;
}

export function workspaceTitleChangeHandler() {
  const name = workspaceNameElement.value;
  const workspace = getContents();
  if (workspace) {
    workspace.name = name ? name : '제목 없음';
    const workspaces = getWorkspaces();
    const newWorkspaces = workspaces.map((ws) =>
      ws.id === workspace.id ? workspace : ws
    );
    localStorage.setItem('workspaces', JSON.stringify(newWorkspaces));
    workspaceNameElement.value = workspace.name;
    renderWorkspaces();
    updateHeaderHistory();
  }
}
workspaceNameElement.addEventListener('change', workspaceTitleChangeHandler);

window.addEventListener('urlchange', getContents);
getContents();

export function createButton(text, onClick) {
  const element = document.createElement('a');
  element.className = 'block-side-menu';
  element.href = '#';
  element.text = text;
  element.style.margin = '10px';
  if (onClick) {
    element.addEventListener('click', (e) => {
      onClick();
      e.preventDefault();
    });
  }
  return element;
}
let element;

editor.sideMenu.onUpdate((sideMenuState) => {
  if (!element) {
    element = document.createElement('div');
    element.className = 'block-element';
    element.style.background = 'gray';
    element.style.position = 'absolute';
    element.style.padding = '10px';
    element.style.opacity = '0.8';
    const addBtn = createButton('+', () => {
      const blockContent = sideMenuState.block.content;
      const isBlockEmpty =
        blockContent !== undefined &&
        Array.isArray(blockContent) &&
        blockContent.length === 0;
      if (isBlockEmpty) {
        editor.setTextCursorPosition(sideMenuState.block);
        editor.openSuggestionMenu('/');
      } else {
        const insertedBlock = editor.insertBlocks(
          [{ type: 'paragraph' }],
          sideMenuState.block,
          'after'
        )[0];
        editor.setTextCursorPosition(insertedBlock);
        editor.openSuggestionMenu('/');
      }
    });
    element.appendChild(addBtn);
    const dragBtn = createButton('::', () => {});
    dragBtn.addEventListener('dragstart', (evt) =>
      editor.sideMenu.blockDragStart(evt, sideMenuState.block)
    );
    dragBtn.addEventListener('dragend', editor.sideMenu.blockDragEnd);
    dragBtn.draggable = true;
    element.style.display = 'none';
    element.appendChild(dragBtn);
    document.getElementById('editor').appendChild(element);
  }
  if (sideMenuState.show) {
    element.style.display = 'block';
    element.style.top = sideMenuState.referencePos.top + 'px';
    element.style.left =
      sideMenuState.referencePos.x - element.offsetWidth + 'px';
  } else {
    element.style.display = 'none';
  }
});

editor.onChange(() => {
  // debounce 기능 추가
  clearTimeout(editor.changeTimeout);
  editor.changeTimeout = setTimeout(() => {
    const currentId = getIdFromUrl();
    if (!currentId) return;

    const workspaces = getWorkspaces();
    const currentWorkspace = workspaces.find((ws) => ws.id === currentId);

    if (currentWorkspace) {
      currentWorkspace.contents = editor.document;
      const newWorkspaces = workspaces.map((ws) =>
        ws.id === currentId ? currentWorkspace : ws
      );
      localStorage.setItem('workspaces', JSON.stringify(newWorkspaces));
    }
  }, 1000);
});
