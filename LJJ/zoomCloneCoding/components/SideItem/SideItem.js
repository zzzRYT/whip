import createComponent from '../../core/createComponent.js';

export default function SideItems({ target, props }) {
  return createComponent({
    target,
    props,
    setup: (props) => ({}),
    template: (state) => `
            <div class="side-item-container">
                <div class="chatting-room">채팅</div>
                <div class="participants">참가자</div>
            </div>
        `,
  });
}
