import createComponent from '../../core/createComponent.js';

export default function Participants({ target, props }) {
  createComponent({
    target,
    props,
    setup: (props) => ({
      peoples: [
        { id: 1, name: '이재진', type: 'me', isMic: false, isVideo: true },
        { id: 2, name: '강지혜', type: 'host', isMic: true, isVideo: true },
        {
          id: 3,
          name: '최아로인',
          type: 'co-host',
          isMic: true,
          isVideo: false,
        },
        { id: 4, name: '정윤오', type: 'none', isMic: false, isVideo: false },
        { id: 5, name: '이주연', type: 'none', isMic: true, isVideo: true },
        { id: 6, name: '김미소', type: 'none', isMic: false, isVideo: true },
      ],
    }),

    template: (state) => `
            <div class="participants-container">
              <div class="participants-header">
                <h2>참가자 (${state.peoples.length})</h2>
                <div class="participants-header-buttons">
                  <i class="bi bi-box-arrow-up-right"></i>
                  <i class="bi bi-x-lg close-button"></i>
                </div>
              </div>
              <div class="participants-list-container">
                <div class="participants-search">
                  <i class="bi bi-search"></i>
                  <input type="text" class="participants-search-input" placeholder="검색" />
                </div>
                <div class="participants-list">
                  ${state.peoples
                    .map(
                      (person) => `
                    <div class="participants-item">
                      <div class="participants-info">
                        <div class="participants-profile">
                          <img src="./assets/user-9801862_1280.png" alt="profile"/>
                        </div>
                        <span class="participants-name">${person.name}</span>
                        <span class="participants-type">${getHostType(
                          person.type
                        )}</span>
                      </div>
                      <div>
                        <button class="mute-button mute-button-${person.id}">${
                        person.isMic
                          ? '<i class="bi bi-mic mic-on"></i>'
                          : '<i class="bi bi-mic-mute mic-off"></i>'
                      }</button>
                        <button class="video-button">${
                          person.isVideo
                            ? '<i class="bi bi-camera-video video-on"></i>'
                            : '<i class="bi bi-camera-video-off video-off"></i>'
                        }</button>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                
                </div>
              </div>
            </div>
        `,

    setEvent: (addEvent, state, props) => {
      addEvent('click', '.close-button', () => {
        props.closeSideBar();
      });

      addEvent('click', '.mute-button', (id) => {
        const mic = document.querySelector('.mute-button');
        const childElement = mic.firstElementChild;
        if (childElement.classList.contains('bi-mic')) {
          childElement.classList.remove('bi-mic');
          childElement.classList.add('bi-mic-mute');
          childElement.classList.remove('mic-on');
          childElement.classList.add('mic-off');
        } else {
          childElement.classList.remove('bi-mic-mute');
          childElement.classList.add('bi-mic');
          childElement.classList.remove('mic-off');
          childElement.classList.add('mic-on');
        }
      });
    },
  });
}

function getHostType(type) {
  if (type === 'me') return '(나)';
  if (type === 'host') return '(호스트)';
  if (type === 'co-host') return '(공동 호스트)';
  if (type === 'none') return '';
  return '';
}
