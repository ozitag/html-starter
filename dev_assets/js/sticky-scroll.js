;(function(global) {
  'use strict';

  class StickyProduct {
    constructor (elem) {
      this.elem = elem;
      this.elemHeight = StickyProduct.getHeight(elem);
      this.parent = elem.parentNode;
      this.parentHeight = StickyProduct.getHeight(this.parent);
      this.options = {
        fixedOffset: 30,
      };

      raf(() => this.checkPos());
      this.addEvents();
    }

    addEvents () {
      listenScroll(() => this.checkPos());
      listenResize(() => {
        this.elemHeight = StickyProduct.getHeight(this.elem);
        this.parentHeight = StickyProduct.getHeight(this.parent);
      });
      Layout.addListener(() => this.checkPos());
    }

    checkPos () {
      if (!isTabletLayout()) {
        const parentCordTop = this.parent.getBoundingClientRect().top;
        const breakpointTop = parentCordTop - this.options.fixedOffset;

        if (breakpointTop < 0) {
          const itemOffset = this.parentHeight - this.elemHeight;
          const breakpointBottom = breakpointTop + itemOffset;

          if (breakpointBottom < 0) {
            this.changePos('bottom', itemOffset);
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

    static getHeight (elem) {
      return elem.offsetHeight;
    }

    static init () {
      const elems = document.querySelectorAll('[data-pos="sticky"]');
      if (!elems.length) return false;
      elems.forEach(elem => {
        if ('init' in elem.dataset) return false;
        elem.setAttribute('data-init', true);
        return new StickyProduct(elem);
      });
    }
  }

  global.StickyProduct = StickyProduct;
})(window);