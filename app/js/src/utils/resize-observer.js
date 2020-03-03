class ResizeObserver {
  constructor () {
    this.listeners = [];
    this.observeResize();
  }

  observeResize () {
    window.addEventListener('resize', () => {
      if (!this.listeners.length) return false;
      this.listeners.forEach(fn => fn());
    });
  }

  subscribe (callback) {
    this.listeners.push(callback);
  }
}

const resizeObserver = new ResizeObserver();
window.onResize = (fn) => resizeObserver.subscribe(fn);