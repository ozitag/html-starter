class ScrollObserver {
  constructor () {
    this.listeners = [];
    this.observeScroll();
  }

  observeScroll () {
    document.addEventListener('scroll', () => {
      if (!this.listeners.length) return false;
      raf(() => this.listeners.forEach(fn => fn()));
    }, passiveIfSupported);
  }

  listen (callback) {
    this.listeners.push(callback);
  }

  static init () {
    return new ScrollObserver();
  }
}

const scrollObserver = ScrollObserver.init();
window.listenScroll = (fn) => scrollObserver.listen(fn);
