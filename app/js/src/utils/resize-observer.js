class ResizeObserver extends Observer {
  constructor() {
    super();

    this.observeResize();
  }

  observeResize() {
    window.addEventListener('resize', () => {
      if (!this.listeners.length) return false;
      this.listeners.forEach(fn => fn());
    });
  }
}

const resizeObserver = new ResizeObserver();
window.onResize = (fn) => resizeObserver.subscribe(fn);
window.offResize = (fn) => resizeObserver.unsubscribe(fn);
