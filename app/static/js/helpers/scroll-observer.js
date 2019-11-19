;(function (global) {
  "use strict";

  class ScrollObserver {
    constructor() {
      this.listeners = [];
      this.observeScroll();
    }

    observeScroll() {
      document.addEventListener('scroll', () => {
        if (!this.listeners.length) return false;
        raf(() => {
          for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i]();
          }
        });
      }, passiveIfSupported);
    }

    listen(callback) {
      this.listeners.push(callback);
    }

    static init() {
      return new ScrollObserver();
    }
  }

  const scrollObserver = ScrollObserver.init();
  global.listenScroll = (fn) => scrollObserver.listen(fn);
})(window);
