import Component from '../../core/Component.js';
import Button from './Button.js';

export default class FooterContainer extends Component {
    setup() {
        const leftControlItems = [
            { text: '음소거', onClick: () => alert('음소거 버튼 클릭') },
            { text: '비디오 시작', onClick: () => alert('비디오 시작 버튼 클릭') },
        ];

        const middleControlItems = [
            { text: '참가자', onClick: () => alert('참가자 버튼 클릭') },
            { text: '채팅', onClick: () => alert('채팅 버튼 클릭') },
            { text: '더보기', onClick: () => alert('더보기 버튼 클릭') },
        ];

        const rightControlItems = [{ text: '나가기', onClick: () => alert('나가기 버튼 클릭') }];
        this.state = {
            leftControlItems,
            middleControlItems,
            rightControlItems,
            isOpen: false,
            isMuted: false,
            isVideoOff: false,
        };
    }

    template() {
        return `
            <div class="controls">
                <div class='left-controls'></div>
                <div class='middle-controls'></div>
                <div class='right-controls'></div>
            </div>
            <div class='side-bar'></div>
        `;
    }

    didMount() {
        const { leftControlItems, middleControlItems, rightControlItems } = this.state;

        const leftControls = this.$target.querySelector('.left-controls');
        const middleControls = this.$target.querySelector('.middle-controls');
        const rightControls = this.$target.querySelector('.right-controls');

        leftControls.innerHTML = '';
        middleControls.innerHTML = '';
        rightControls.innerHTML = '';

        for (const { text, onClick } of leftControlItems) {
            const buttonContainer = document.createElement('div');
            leftControls.appendChild(buttonContainer);
            new Button(buttonContainer, { text, onClick });
        }

        for (const { text, onClick } of middleControlItems) {
            const buttonContainer = document.createElement('div');
            middleControls.appendChild(buttonContainer);
            new Button(buttonContainer, { text, onClick });
        }

        for (const { text, onClick } of rightControlItems) {
            const buttonContainer = document.createElement('div');
            rightControls.appendChild(buttonContainer);
            new Button(buttonContainer, { text, onClick });
        }
    }
}
