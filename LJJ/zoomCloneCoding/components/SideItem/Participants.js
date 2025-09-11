import createComponent from '../../core/createComponent.js';

export default function Participants({ target, props }) {
  createComponent({
    target,
    props,
    setup: (props) => ({}),

    template: (state) => `
            <div class="participants-container">
                <h2>참가자</h2>
            </div>
        `,
  });
}
