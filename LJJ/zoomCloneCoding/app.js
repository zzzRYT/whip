import MainContent from './components/MainContent/MainContent.js';

const mainContentContainer = document.querySelector('.main-content');
mainContentContainer.innerHTML = '';
new MainContent(mainContentContainer);
