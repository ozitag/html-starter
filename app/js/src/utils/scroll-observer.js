class ScrollObserver {
  constructor() {
    this.listeners = [];
    this.ticking = false;
    this.observeScroll();
  }

  observeScroll() {
    document.addEventListener('scroll', () => {
      if (this.ticking) return null;
      this.ticking = true;
      raf(() => {
        this.listeners.forEach(fn => fn());
        this.ticking = false;
      });
    }, passiveIfSupported);
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }
}

const scrollObserver = new ScrollObserver();
window.onScroll = (fn) => scrollObserver.subscribe(fn);
