import createComponent from '../../core/createComponent.js';
import Participants from '../SideItem/Participants.js';
import Chat from '../SideItem/Chat.js';

export default function Footer({ target, props }) {
  return createComponent({
    target,
    props,
    setup: (props) => ({
      isMic: false,
      isVideo: false,
      isParticipant: false,
      isChat: false,
    }),
    template: (state) => `
            <div class="controls">
                <div class='left-controls'>
                    <button class="control-button" id="mic">
                      ${
                        state.isMic
                          ? '<i class="bi bi-mic mic-on"></i>'
                          : '<i class="bi bi-mic-mute mic-off"></i>'
                      }
                      <span>오디오</span>
                    </button>
                    <button class="control-button" id="video">
                      ${
                        state.isVideo
                          ? '<i class="bi bi-camera-video video-on"></i>'
                          : '<i class="bi bi-camera-video-off video-off"></i>'
                      }
                      <span>비디오</span>
                    </button>
                </div>
                <div class='middle-controls'>
                    <button class="control-button" id="participants">
                      <i class="bi bi-people"></i>
                      <span>참가자</span>
                    </button>
                    <button class="control-button" id="chat">
                      <i class="bi bi-chat-dots"></i>
                      <span>채팅</span>
                    </button>
                    <button class="control-button" id="more">
                      <i class="bi bi-three-dots"></i>
                      <span>더보기</span>
                    </button>
                </div>
                <div class='right-controls'>
                    <button class="control-button" id="out">
                      <span>나가기</span>
                    </button>
                </div>
            </div>
    `,
    setEvent: (addEvent) => {
      // 마이크
      addEvent('click', '#mic', () => {
        const mic = document.querySelector('#mic');
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

      // 비디오
      addEvent('click', '#video', (event) => {
        const video = document.querySelector('#video');
        const childElement = video.firstElementChild;
        if (childElement.classList.contains('bi-camera-video')) {
          childElement.classList.remove('bi-camera-video');
          childElement.classList.add('bi-camera-video-off');
          childElement.classList.remove('video-on');
          childElement.classList.add('video-off');
        } else {
          childElement.classList.remove('bi-camera-video-off');
          childElement.classList.add('bi-camera-video');
          childElement.classList.remove('video-off');
          childElement.classList.add('video-on');
        }
      });

      const sideBar = document.querySelector('.side-bar');

      const closeSideBar = () => {
        sideBar.classList.remove('active');
        sideBar.innerHTML = '';
      };

      // 참가자
      addEvent('click', '#participants', (event) => {
        const wasActive = addEvent.isParticipant;
        // Reset states
        addEvent.isParticipant = false;
        addEvent.isChat = false;

        sideBar.innerHTML = ''; // Clear sidebar first

        if (!wasActive) {
          addEvent.isParticipant = true;
          sideBar.classList.add('active');
          Participants({ target: sideBar, props: { closeSideBar } });
        } else {
          closeSideBar();
        }
      });

      // 채팅
      addEvent('click', '#chat', (event) => {
        const wasActive = addEvent.isChat;
        // Reset states
        addEvent.isParticipant = false;
        addEvent.isChat = false;

        sideBar.innerHTML = ''; // Clear sidebar first

        if (!wasActive) {
          addEvent.isChat = true;
          sideBar.classList.add('active');
          Chat({ target: sideBar, props: { closeSideBar } });
        } else {
          closeSideBar();
        }
      });
    },
  });
}
