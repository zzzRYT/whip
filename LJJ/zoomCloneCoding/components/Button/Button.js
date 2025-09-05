import Component from '../../core/Component.js';
export default class Button extends Component {
    template() {
        const { text } = this.props;
        return `<button class="custom-button">${text}</button>`;
    }

    setEvent() {
        const { onClick } = this.props;
        this.addEvent('click', 'button', (event) => {
            onClick(event);
        });
    }
}
