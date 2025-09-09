export default function createComponent({
  target,
  props = {},
  setup = () => ({}),
  template = () => '',
  didMount = () => {},
  setEvent = () => {},
}) {
  let state = setup(props);

  function render() {
    const html = template(state, props);
    if (html) {
      target.innerHTML = html;
      didMount(state, props);
      setEvent(addEvent);
    }
  }

  function setState(newState) {
    state = { ...state, ...newState };
    render();
  }

  function addEvent(eventType, selector, callback) {
    const children = [...target.querySelectorAll(selector)];
    const isTarget = (t) => children.includes(t) || t.closest(selector);
    target.addEventListener(eventType, (event) => {
      if (!isTarget(event.target)) return false;
      return callback(event);
    });
  }

  render();

  return { setState, getState: () => state, render };
}
