export default class Component {
    $target;
    props;
    state;
    constructor($target, props) {
        this.$target = $target;
        this.props = props;
        this.setup();
        this.render();
        this.setEvent();
    }

    setup() {}

    didMount() {}

    template() {
        return '';
    }

    render() {
        const template = this.template();
        if (template) {
            this.$target.innerHTML = template;
            this.didMount();
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    setEvent() {}

    addEvent(eventType, selector, callback) {
        const children = [...this.$target.querySelectorAll(selector)];
        const isTarget = (target) => children.includes(target) || target.closest(selector);
        this.$target.addEventListener(eventType, (event) => {
            if (!isTarget(event.target)) return false;
            return callback(event);
        });
    }
}
