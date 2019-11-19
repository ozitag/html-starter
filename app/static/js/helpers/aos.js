;(function () {
  'use strict';

  class AoS {
    constructor(blocks) {
      this.aosBlocks = blocks;
      this.observer = null;
      this.options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
        delay: 100,
      };
      raf(() => {
        this.initObserver()
      });
    }

    initObserver() {
      this.observer =
        new IntersectionObserver((entries, observer) => {
          raf(() => {
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              if (entry.intersectionRatio > 0) {
                this.animate(entry.target);
                observer.unobserve(entry.target);
              }
            }
          });
        }, this.options);

      for (let i = 0; i < this.aosBlocks.length; i++) {
        const block = this.aosBlocks[i];
        const isActual = this.checkPos(block);
        if (!isActual) continue;
        block.style.transitionDelay = `${block.dataset.aosDelay}s`;
        this.observer.observe(block);
      }
    }

    checkPos(block) {
      const cords = block.getBoundingClientRect();
      if (cords.bottom < 0) {
        AoS.exclude(block);
        return false;
      }
      return true;
    }

    animate(block) {
      const handler = e => {
        const element = e.currentTarget;
        element.removeEventListener(endEvents.transition, handler, true);
        AoS.exclude(element);
      };
      block.addEventListener(endEvents.transition, handler, true);
      block.classList.add('aos-animate');
    }

    static exclude(elem) {
      elem.removeAttribute('data-aos');
      raf2x(() => {
        elem.removeAttribute('data-aos-delay');
        elem.classList.remove('aos-animate');
        elem.style.transitionDelay = ``;
      });
    }

    static init() {
      document.addEventListener('DOMContentLoaded', () => {
        const aosBlocks =
          document.querySelectorAll('[data-aos]');

        if (!aosBlocks.length) return false;

        return new AoS(aosBlocks);
      });
    }
  }

  AoS.init();
})();
