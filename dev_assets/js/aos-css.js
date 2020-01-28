class AoSCss {
  constructor(blocks) {
    this.aosBlocks = blocks;
    this.observer = null;
    this.options = {
      root: null,
      rootMargin: '-100px',
      threshold: 0,
      delay: 100,
    };

    raf(() => this.initObserver());
  }

  initObserver() {
    this.observer =
      new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, this.options);

    this.aosBlocks.forEach(block => {
      if (!this.checkPos(block)) return false;
      block.style.animationDelay = `${block.dataset.aosDelay}s`;
      this.observer.observe(block);
    });
  }

  checkPos(block) {
    const cords = block.getBoundingClientRect();
    if (cords.bottom < 0) {
      AoSCss.exclude(block);
      return false;
    }
    return true;
  }

  animate(block) {
    const handler = e => {
      const { target, currentTarget } = e;
      if (target !== currentTarget) return false;
      target.removeEventListener(endEvents.animation, handler);
      AoSCss.exclude(target);
    };
    block.addEventListener(endEvents.animation, handler);
    block.classList.add('aos-animate');
  }

  static exclude(elem) {
    elem.removeAttribute('data-aos');
    elem.removeAttribute('data-aos-delay');
    elem.classList.remove('aos-animate');
    elem.style.transitionDelay = ``;
  }

  init () {
    const aosBlocks = document.querySelectorAll('[data-aos]');
    if (!aosBlocks.length) return false;
    this.aosBlocks = aosBlocks;
    raf(() => this.initObserver());
  }
}

const aosCss = new AoSCss();
window.aosCssInit = aosCss.init.bind(aosCss);