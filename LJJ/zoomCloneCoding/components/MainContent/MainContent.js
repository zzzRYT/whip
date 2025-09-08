import Component from '../../core/Component.js';
import PeopleCam from '../PeopleCam/PeopleCam.js';
import MainCam from '../MainCam/MainCam.js';

export default class MainContent extends Component {
    setup() {
        const people = [
            { id: 1, name: '이재진', img: './assets/user-9801862_1280.png' },
            { id: 2, name: '강지혜', img: './assets/user-9801867_1280.png' },
            { id: 3, name: '최아로인', img: './assets/user-9801869_1280.png' },
            { id: 4, name: '정윤오', img: './assets/user-9801870_1280.png' },
            { id: 5, name: '이주연', img: './assets/user-9801874_1280.png' },
            { id: 6, name: '김미소', img: './assets/user-9801862_1280.png' },
        ];
        this.state = { main: people[0], people };
    }

    template() {
        return `
            <div class="video-grid"></div>
            <div class="main-cam-container"></div>
        `;
    }

    didMount() {
        const { people, main } = this.state;
        const mainCamContainer = this.$target.querySelector('.main-cam-container');
        const videoGrid = this.$target.querySelector('.video-grid');

        new MainCam(mainCamContainer, { person: main });

        videoGrid.innerHTML = '';
        people.forEach((person) => {
            const camContainer = document.createElement('div');
            videoGrid.appendChild(camContainer);
            new PeopleCam(camContainer, {
                ...person,
                setState: this.setState.bind(this),
            });
        });
    }
}
