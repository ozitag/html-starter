import aosAnimations from './aos-animations';

class AoS {
  constructor () {
    this.aosBlocks = null;
    this.observer = null;
    this.options = {
      rootMargin: '0px',
      threshold: 0,
    };
  }

  initObserver () {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(({ intersectionRatio, target }) => {
        if (intersectionRatio > 0) this.animate(target);
      });
    }, this.options);

    this.aosBlocks.forEach(block => {
      if (!this.checkPos(block)) return false;
      this.observer.observe(block);

      const animationName = block.dataset.aos;
      const delays = {
        base: this.getDelay(block),
        group: this.getDelay(block, true),
      };
      this.enumElements(block, (item, i) => {
        this.initAnimation(item, animationName, delays, i).pause();
      });
    });
  }

  checkPos (block) {
    const cords = block.getBoundingClientRect();
    if (cords.bottom < 0) {
      this.exclude(block);
      return false;
    }
    return true;
  }

  animate (elem) {
    this.enumElements(elem, item => {
      item.getAnimations()[0].play();
    });
    this.exclude(elem);
  }

  initAnimation (elem, animationName, delays, delayFactor = 1) {
    const animationConfig = aosAnimations[animationName];
    const animationDelay = this.getDelay(elem) ||
      delays.base + (delayFactor > 0 ? delays.group : 0) ||
      animationConfig.delay || 0;

    return elem.animate(animationConfig.frames, {
      ...animationConfig.settings,
      delay: animationDelay * delayFactor,
    });
  }

  enumElements (elem, callback) {
    if ('aosGroup' in elem.dataset) {
      const children = elem.querySelectorAll('[data-aos-item]');
      children.forEach((child, i) => {
        callback(child, i);
      });
    } else {
      callback(elem);
    }
  }

  getDelay (elem, inGroup) {
    return (inGroup ? parseFloat(elem.dataset.aosGroupDelay) : parseFloat(elem.dataset.aosDelay)) || 0;
  }

  exclude (elem) {
    const animationMode = elem.dataset.aosMode;
    if (animationMode !== 'always') {
      this.observer.unobserve(elem);
    }
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
window.aosInit = aos.init.bind(aos);