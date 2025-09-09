import createComponent from '../../core/createComponent.js';

export default function Footer({ target, props }) {
  return createComponent({
    target,
    props,
    setup: (props) => ({
      leftControlItems: [
        { id: 'mic', text: '음소거' },
        {
          id: 'video',
          text: '비디오 시작',
        },
      ],
      middleControlItems: [
        {
          id: 'participants',
          text: '참가자',
        },
        { id: 'chat', text: '채팅' },
        {
          id: 'more',
          text: '더보기',
        },
      ],
      rightControlItems: [
        {
          id: 'exit',
          text: '나가기',
        },
      ],
      isOpen: false,
      sideBarContent: [],
    }),
    template: (state) => `
            <div class="controls">
                <div class='left-controls'>
                    ${state.leftControlItems
                      .map(
                        (item) =>
                          `<button class="control-button" id="${item.id}">${item.text}</button>`
                      )
                      .join('')}
                </div>
                <div class='middle-controls'>
                    ${state.middleControlItems
                      .map(
                        (item) =>
                          `<button class="control-button" id="${item.id}">${item.text}</button>`
                      )
                      .join('')}
                </div>
                <div class='right-controls'>
                    ${state.rightControlItems
                      .map(
                        (item) =>
                          `<button class="control-button" id="${item.id}">${item.text}</button>`
                      )
                      .join('')}
                </div>
            </div>
    `,
    setEvent: (addEvent) => {
      // 마이크
      addEvent('click', '#mic', (event) => {
        event.target.textContent =
          event.target.textContent === '음소거' ? '음소거 해제' : '음소거';
        event.target.style.color =
          event.target.style.color === 'red' ? 'white' : 'red';
      });

      // 비디오
      addEvent('click', '#video', (event) => {
        event.target.textContent =
          event.target.textContent === '비디오 시작'
            ? '비디오 중지'
            : '비디오 시작';
        event.target.style.color =
          event.target.style.color === 'red' ? 'white' : 'red';
      });

      // 참가자
      addEvent('click', '#participants', (event) => {
        const sideBar = document.querySelector('.side-bar');
        sideBar.innerHTML = `
          <div class="side-item-container">
              <div class="participants">참가자</div>
          </div>
        `;
      });

      // 채팅
      addEvent('click', '#chat', (event) => {
        const sideBar = document.querySelector('.side-bar');
        sideBar.innerHTML = `
          <div class="chatting-room">채팅</div>
        `;
      });
    },
  });
}
