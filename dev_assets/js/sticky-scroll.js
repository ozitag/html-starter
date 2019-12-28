class StickyScroll {
  constructor (elem) {
    this.elem = elem;
    this.parent = elem.parentNode;
    this.options = {
      fixedOffset: 0,
    };

    raf(() => this.checkPos());
    this.addEvents();
  }

  addEvents () {
    listenScroll(() => this.checkPos());
    Layout.addListener(() => this.checkPos());
  }

  checkPos () {
    if (!isTabletLayout()) {
      const parentCordTop = this.parent.getBoundingClientRect().top;
      const breakpointTop = parentCordTop - this.options.fixedOffset;

      if (breakpointTop < this.options.fixedOffset) {
        const itemOffset = this.parent.offsetHeight - this.elem.offsetHeight;
        const breakpointBottom = breakpointTop + itemOffset;

        if (breakpointBottom < 0) {
          this.changePos('bottom', itemOffset);
        } else {
          this.changePos('fix');
        }
      } else {
        this.changePos('top');
      }
    }
  }

  changePos (pos, itemOffset) {
    switch (pos) {
      case 'fix':
        this.elem.classList.add('fixed');
        this.elem.style.transform = `translate3d(0, ${this.options.fixedOffset}px, 0)`;
        break;
      case 'top':
        this.elem.classList.remove('fixed');
        this.elem.style.transform = ``;
        break;
      case 'bottom':
        this.elem.classList.remove('fixed');
        this.elem.style.transform = `translate3d(0, ${itemOffset}px, 0)`;
    }
  }

  static init () {
    const elems = document.querySelectorAll('[data-scroll="sticky"]');
    if (!elems.length) return false;
    elems.forEach(elem => {
      if ('init' in elem.dataset) return false;
      elem.setAttribute('data-init', true);
      return new StickyScroll(elem);
    });
  }
}

window.StickyScroll = StickyScroll;