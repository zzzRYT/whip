import Component from '../../core/Component.js';

export default class PeopleCam extends Component {
    template() {
        const { id, name, img } = this.props;
        return `
            <div class="people-cam">
                <img class="cam-img" src="${img}" alt="${name}" width=150 height=80>
                <span class="cam-name">${name}</span>
            </div>
        `;
    }

    setEvent() {
        const { onClick } = this.props;
        if (onClick) {
            this.addEvent('click', '.people-cam', () => {
                console.log('PeopleCam Clicked!', this.props.name);
                onClick({ id: this.props.id, name: this.props.name, img: this.props.img });
            });
        }
    }
}