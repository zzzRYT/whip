import FooterContainer from './components/Footer/FooterContainer.js';
import MainContent from './components/MainContent/MainContent.js';

const mainContentContainer = document.querySelector('.main-content');
mainContentContainer.innerHTML = '';
new MainContent(mainContentContainer);

const footerContainer = document.querySelector('.footer-container');
footerContainer.innerHTML = '';
new FooterContainer(footerContainer);
