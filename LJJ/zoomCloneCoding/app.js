import PeopleCam from './components/PeopleCam/PeopleCam.js';
import Button from './components/Button/Button.js';

const videoGrid = document.querySelector('.video-grid');

const people = [
    { name: '이재진', img: './assets/user-9801862_1280.png' },
    { name: '강지혜', img: './assets/user-9801867_1280.png' },
    { name: '최아로인', img: './assets/user-9801869_1280.png' },
    { name: '정윤오', img: './assets/user-9801870_1280.png' },
    { name: '이주연', img: './assets/user-9801874_1280.png' },
    { name: '김미소', img: './assets/user-9801862_1280.png' },
];

// Clear existing content
videoGrid.innerHTML = '';

for (let i = 0; i < people.length; i++) {
    const personCam = PeopleCam(people[i].name, people[i].img);
    videoGrid.appendChild(personCam);
}

const navigate = document.querySelector('.controls');

const navigateLists = [
    { text: '음소거', onClick: () => alert('음소거 버튼 클릭'), className: 'custom-button' },
    { text: '비디오 시작', onClick: () => alert('비디오 시작 버튼 클릭'), className: 'custom-button' },
    { text: '화면 공유', onClick: () => alert('화면 공유 버튼 클릭'), className: 'custom-button' },
    { text: '참가자', onClick: () => alert('참가자 버튼 클릭'), className: 'custom-button' },
    { text: '채팅', onClick: () => alert('채팅 버튼 클릭'), className: 'custom-button' },
    { text: '더보기', onClick: () => alert('더보기 버튼 클릭'), className: 'custom-button' },
    { text: '나가기', onClick: () => alert('나가기 버튼 클릭'), className: 'custom-button' },
];

navigate.innerHTML = '';

for (let i = 0; i < navigateLists.length; i++) {
    const { text, onClick, className } = navigateLists[i];
    const button = Button(text, onClick, className);
    navigate.appendChild(button);
}
