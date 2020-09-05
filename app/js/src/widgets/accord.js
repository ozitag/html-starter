const widgetInstances = new Map();

class Accord extends Widget {
  constructor(item, options = {}) {
    super(item, 'js-accord');

    this.$toggle = options.toggleElement ? options.toggleElement : this.queryElement('.toggle');
    this.$body = options.bodyElement ? options.bodyElement : this.queryElement('.body');

    this.opened = false;
    this.busy = false;

    this.onToggleClick = this.onToggleClick.bind(this);
  }

  build() {
    this.$toggle.addEventListener('click', this.onToggleClick);
  }

  destroy() {
    this.$toggle.removeEventListener('click', this.onToggleClick);
  }

  onToggleClick(e) {
    e.preventDefault();
    if (this.busy) return;
    this.busy = true;

    if (this.opened === false) {
      this.$node.classList.add('opened');
      this.expand();
    } else {
      this.collapse();
      this.$node.classList.remove('opened');
    }

    this.opened = !this.opened;
  }

  collapse() {
    this.animate({
      from: this.$body.scrollHeight,
      to: 0,
    });
  }

  expand() {
    this.animate({
      from: 0,
      to: this.$body.scrollHeight,
    });
  }

  animate(height) {
    const elem = this.$body;

    const handler = e => {
      if (e.target !== e.currentTarget) return false;
      elem.removeEventListener(endEvents.transition, handler);
      elem.classList.remove('animate');
      elem.style.height = '';
      this.busy = false;
    };
    elem.addEventListener(endEvents.transition, handler);

    elem.classList.add('animate');
    elem.style.height = `${height.from}px`;
    raf2x(() => {
      elem.style.height = `${height.to}px`;
    });
  }

  static destroy(elem) {
    widgetInstances.get(elem).destroy();
  }

  static init(elem, options = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new Accord(elem, options));
    }

    widgetInstances.get(elem).build();

    return widgetInstances.get(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const accords = document.querySelectorAll('.js-accord');
  accords.forEach(item => {
    Accord.init(item);
  });
});

window.Accord = Accord;
