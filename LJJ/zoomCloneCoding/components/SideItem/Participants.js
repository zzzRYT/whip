import createComponent from '../../core/createComponent.js';

export default function Participants({ target, props }) {
  createComponent({
    target,
    props,
    setup: (props) => ({
      people: [
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
                <h2>참가자 (${state.people.length})</h2>
                <div class="participants-header-buttons">
                  <i class="bi bi-box-arrow-up-right"></i>
                  <i class="bi bi-x-lg close-button"></i>
                </div>
              </div>
            </div>
        `,

    setEvent: (addEvent, state, props) => {
      addEvent('click', '.close-button', () => {
        props.closeSideBar();
      });
    },
  });
}
