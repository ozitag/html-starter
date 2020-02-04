class ResizeObserver {
  constructor () {
    this.listeners = [];
    this.observeResize();
  }

  observeResize () {
    window.addEventListener('resize', () => {
      if (!this.listeners.length) return false;
      raf(() => this.listeners.forEach(fn => fn()));
    });
  }

  listen (callback) {
    this.listeners.push(callback);
  }

  static init () {
    return new ResizeObserver();
  }
}

const resizeObserver = ResizeObserver.init();
window.listenResize = (fn) => resizeObserver.listen(fn);