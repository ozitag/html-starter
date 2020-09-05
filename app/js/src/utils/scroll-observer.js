class ScrollObserver extends Observer {
  constructor() {
    super();

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

}

const scrollObserver = new ScrollObserver();
window.onScroll = (fn) => scrollObserver.subscribe(fn);
window.offScroll = (fn) => scrollObserver.unsubscribe(fn);
