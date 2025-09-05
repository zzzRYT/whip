import Button from './components/Button/Button.js';
import MainContent from './components/MainContent/MainContent.js';

const mainContentContainer = document.querySelector('.main-content');
mainContentContainer.innerHTML = '';
new MainContent(mainContentContainer);

console.log('mainContentContainer:', mainContentContainer);

const navigate = document.querySelector('.controls');

const navigateLists = [
    { text: '음소거', onClick: () => alert('음소거 버튼 클릭') },
    { text: '비디오 시작', onClick: () => alert('비디오 시작 버튼 클릭') },
    { text: '참가자', onClick: () => alert('참가자 버튼 클릭') },
    { text: '채팅', onClick: () => alert('채팅 버튼 클릭') },
    { text: '더보기', onClick: () => alert('더보기 버튼 클릭') },
    { text: '나가기', onClick: () => alert('나가기 버튼 클릭') },
];

navigate.innerHTML = '';

for (let i = 0; i < navigateLists.length; i++) {
    const buttonContainer = document.createElement('div');
    navigate.appendChild(buttonContainer);

    new Button(buttonContainer, {
        text: navigateLists[i].text,
        onClick: navigateLists[i].onClick,
    });
}
