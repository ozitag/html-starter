class AoS {
  constructor() {
    this.aosBlocks = null;
    this.observer = null;
    this.options = {
      rootMargin: '0px',
      threshold: 0,
    };
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
      AoS.exclude(block);
      return false;
    }
    return true;
  }

  animate(block) {
    const handler = e => {
      const { target, currentTarget } = e;
      if (target !== currentTarget) return false;
      target.removeEventListener(endEvents.animation, handler);
      AoS.exclude(target);
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
    if (!aosBlocks.length) return null;
    this.aosBlocks = aosBlocks;
    raf(this.initObserver.bind(this));
  }

  static createInstance() {
    return new AoS();
  }
}

const aos = AoS.createInstance();
window.aosCssInit = aos.init.bind(aos);