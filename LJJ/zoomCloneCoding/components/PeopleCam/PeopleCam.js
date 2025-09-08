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
        const { setState } = this.props;
        if (setState) {
            this.addEvent('dblclick', '.people-cam', () => {
                setState({ main: { id: this.props.id, name: this.props.name, img: this.props.img } });
            });
        }
    }
}
