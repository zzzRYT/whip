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
        // 1. 현재 타겟 내부의 selector에 해당하는 모든 요소를 찾는다.
        const children = [...this.$target.querySelectorAll(selector)];

        // 2. 이벤트가 발생한 요소가 selector에 해당하는 요소인지 확인하는 함수
        const isTarget = (target) => children.includes(target) || target.closest(selector);

        // 3. 실제로 이벤트리스너를 등록
        this.$target.addEventListener(eventType, (event) => {
            if (!isTarget(event.target)) return false;
            return callback(event);
        });
    }
}
