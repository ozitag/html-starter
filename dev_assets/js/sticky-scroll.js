class StickyScroll {
  constructor () {
    this.container = null;
    this.elem = null;
    this.cache = {
      containerWidth: null,
      containerHeight: null,
      elemHeight: null,
    };
    this.options = {
      fixedOffset: 50,
    };
  }

  addEvents () {
    onScroll(this.updatePos.bind(this));
    onResize(this.updateComponent.bind(this));
  }

  updateComponent() {
    this.updateCache();
    this.updatePos();
  }

  updatePos () {
    if (!isMobileLayout()) {
      const containerCordTop = this.container.getBoundingClientRect().top;
      const breakpointTop = containerCordTop - this.options.fixedOffset;

      if (breakpointTop < 0) {
        const elemOffset = this.cache.containerHeight - this.cache.elemHeight;
        const breakpointBottom = breakpointTop + elemOffset;

        if (breakpointBottom < 0) {
          this.changePos('bottom', elemOffset);
        } else {
          this.changePos('fix');
        }
      } else {
        this.changePos('top');
      }
    } else {
      this.changePos('top');
    }
  }

  changePos (pos, itemOffset) {
    switch (pos) {
      case 'fix':
        this.elem.style.cssText = `
          transform: translate3d(0, ${this.options.fixedOffset}px, 0);
          width: ${this.cache.containerWidth}px;
          position: fixed;
          top: 0;
        `;
        break;
      case 'bottom':
        this.elem.style.cssText = `
          transform: translate3d(0, ${itemOffset}px, 0);
        `;
        break;
      case 'top':
        this.elem.style.cssText = ``;
    }
  }

  updateCache () {
    this.cache.containerWidth = this.container.offsetWidth;
    this.cache.containerHeight = this.container.offsetHeight;
    this.cache.elemHeight = this.elem.offsetHeight;
  }

  init (container, elem) {
    this.container = container;
    this.elem = elem;

    raf(this.updateComponent.bind(this));
    this.addEvents();
  }

  static createInstance (container) {
    if ('stickyScroll' in container.dataset) return null;

    const elem = container.querySelector('[data-sticky]');
    if (!elem) return null;

    container.setAttribute('data-sticky-scroll', true);
    const stickyScroll = new StickyScroll();
    stickyScroll.init(container, elem);

    return stickyScroll;
  }
}

window.initStickyScroll = StickyScroll.createInstance;