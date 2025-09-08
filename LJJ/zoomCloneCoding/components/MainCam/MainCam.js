import Component from '../../core/Component.js';

export default class MainCam extends Component {
    template() {
        const { person } = this.props;
        if (!person) {
            return `<div></div>`;
        }
        return `
            <div class="main-cam">
                <img src="${person.img}" alt="${person.name}" style="width:100%; height:100%; object-fit: cover;">
                <span class="main-cam-name">${person.name}</span>
            </div>
        `;
    }
}
