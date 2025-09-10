import createComponent from '../../core/createComponent.js';

export default function Chat({ target, props }) {
  createComponent({
    target,
    props,
    setup: (props) => ({}),

    template: (state) => `
            <div class="chat-container">
                <div>
                    <div class="chat-header">
                        <h2>[DEEP DIVE] 프론트엔드 개발자 과정_6회차</h2>
                        <div class="chat-header-buttons">
                            <span>더보기</span>
                            <span>창모드</span>
                            <span>&times;</span>
                        </div>
                    </div>
                    <div class="chat-subheader">
                        <span>참가자 6명</span>
                        <span> | </span>
                        <span>채팅</span>
                    </div>
                    <div class="chat-contents">
                    ${Array(30)
                      .fill(0)
                      .map(
                        () => `
                        <div class="chat-message">
                            <span class="chat-username">이재진</span>
                            <span class="chat-text">안녕하세요</span>
                        </div>
                    `
                      )
                      .join('')}
                    </div>
                    <div class="chat-input-container">
                        <div>
                            <input type="text" class="chat-input" placeholder="메시지를 입력하세요..." />
                        </div>
                        <div class="chat-send-button-container">
                            <div>
                                <button>텍스트변경</button>
                                <button>이모지</button>
                                <button>파일</button>
                                <button>캡처</button>
                            </div>
                            <button class="chat-send-button">전송</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
  });
}
