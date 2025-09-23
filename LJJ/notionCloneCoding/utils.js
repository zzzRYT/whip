/**
 * 랜덤 id 값을 반환해주는 함수
 * @returns 랜덤 id 값
 */
function getRandomId() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < 12; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}

/**
 * url의 id정보를 받아오는 함수
 * @returns url의 id 정보
 */
function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

/**
 * query-string에 id값을 추가하는 함수
 * @param {string} id
 */
function navigateTo(id) {
  const url = `/LJJ/notionCloneCoding?id=${id}`;
  const state = { id };
  history.pushState(state, '', url);
  window.dispatchEvent(new CustomEvent('urlchange'));
}

/**
 * localStorage에서 workspaces 데이터를 가져오는 함수
 * @returns {Array} workspaces
 */
function getWorkspaces() {
  const searchStorage = localStorage.getItem('workspaces');
  const workspaces = JSON.parse(searchStorage) || [];
  return workspaces;
}

export { getRandomId, navigateTo, getIdFromUrl, getWorkspaces };
