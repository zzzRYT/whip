import createComponent from '../../core/createComponent.js';

export default function Chat({ target, props }) {
  createComponent({
    target,
    props,
    setup: (props) => ({
      closeSideBar: props.closeSideBar,
      messages: [
        { id: 1, user: '이재진', text: '안녕하세요', time: '오전 10:30' },
        { id: 2, user: '강지혜', text: '안녕하세요', time: '오전 10:31' },
        { id: 3, user: '최아로인', text: '누구세요', time: '오전 10:32' },
        { id: 4, user: '정윤오', text: '안녕하세요', time: '오전 10:33' },
        { id: 5, user: '이주연', text: '안녕하세요', time: '오전 10:34' },
        { id: 6, user: '김미소', text: '안녕하세요', time: '오전 10:35' },
      ],
      inputValue: '',
      curChattingRoom: 0,
    }),
    template: (state) => `
            <div class="chat-container">
                <div>
                    <div class="chat-header">
                        <h2>[DEEP DIVE] 프론트엔드 개발자 과정_6회차</h2>
                        <div class="chat-header-buttons">
                            <i class="bi bi-three-dots-vertical"></i>
                            <i class="bi bi-box-arrow-up-right"></i>
                            <i class="bi bi-x-lg close-button"></i>
                        </div>
                    </div>
                    <div class="chat-subheader">
                        <div class="people-fill-icon-container">
                            <i class="bi bi-people-fill icon-style ${
                              state.curChattingRoom === 0 ? 'active' : ''
                            }" id='all-people-chat'></i>
                            <span>모든 사람</span>
                        </div>
                        <span></span>
                        <div class="people-fill-icon-container">
                            <i class="bi bi-plus-lg icon-style ${
                              state.curChattingRoom === 1 ? 'active' : ''
                            }" id='new-chat'></i>
                            <span>새 채팅</span>
                        </div>
                    </div>
                </div>
                <div class="chat-content-container">
                    <div class="chat-contents">
                    ${state.messages
                      .map(
                        (el) => `
                        <div class="chat-message" id="message-${el.id}">
                            <i class="bi bi-person-circle chat-user-icon"></i>
                            <div class="chat-message-content">
                                <div class="chat-message-header">
                                    <span class="chat-username">${el.user}</span>
                                    <span class="chat-timestamp">${el.time}</span>
                                </div>
                                <span class="chat-text">${el.text}</span>
                            </div>
                        </div>
                    `
                      )
                      .join('')}
                    </div>
                    <div class="chat-input-container">
                        <div>
                            <input type="text" class="chat-input" placeholder="메시지를 입력하세요..." value="${
                              state.inputValue
                            }"/>
                        </div>
                        <div class="chat-send-button-container">
                            <div>
                                <button><i class="bi bi-fonts"></i></button>
                                <button><i class="bi bi-emoji-smile"></i></button>
                                <button><i class="bi bi-paperclip"></i></button>
                                <button><i class="bi bi-camera"></i></button>
                            </div>
                            <button class="chat-send-button"><i class="bi bi-send"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `,
    setEvent(addEvent, setState, state) {
      addEvent('click', '.close-button', () => {
        props.closeSideBar();
      });

      addEvent('click', '#all-people-chat', () => {
        setState({ curChattingRoom: 0 });
      });

      addEvent('click', '#new-chat', () => {
        setState({ curChattingRoom: 1 });
      });

      addEvent('input', '.chat-input', (e) => {
        setState({ inputValue: e.target.value });
      });

      addEvent('click', '.chat-send-button', () => {
        if (!state.inputValue) return;

        const newMessage = {
          id: 1,
          user: '이재진',
          text: state.inputValue,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setState({
          messages: [...state.messages, newMessage],
          inputValue: '',
        });
      });
    },
  });
}
