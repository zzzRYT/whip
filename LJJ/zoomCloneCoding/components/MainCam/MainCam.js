import Component from '../../core/Component.js';

export default class MainCam extends Component {
    setup() {
        this.state = this.props.initialPerson;
    }

    template() {
        if (!this.state) {
            return `<div></div>`;
        }
        const { name, img } = this.state;
        console.log('MainCam rendering with:', name);
        return `
            <div class="main-cam">
                <img src="${img}" alt="${name}" style="width:100%; height:100%; object-fit: cover;">
                <span class="main-cam-name">${name}</span>
            </div>
        `;
    }

    setPerson(person) {
        console.log('MainCam setPerson called with:', person.name);
        this.setState(person);
    }
}