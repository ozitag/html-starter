class Preloader {
  static disablingPreloader() {
    const preloader = document.querySelector('.js-preloader');
    
    if (preloader) {
      const handler = e => {
        const { target, currentTarget } = e;
        if (target !== currentTarget) return false;
        preloader.removeEventListener(endEvents.animation, handler);
        preloader.style.display = 'none';
        preloader.classList.remove('hide');

        setTimeout(() => {
          const pageEvent = new CustomEvent('pageLoaded');
          document.dispatchEvent(pageEvent);
        }, 1000);
      };
      preloader.addEventListener(endEvents.animation, handler);

      preloader.classList.add('hide');
    }

    const uikitPreloader = document.querySelector('.js-uikit-preloader');

    if (uikitPreloader) {
      const handler = e => {
        const { target, currentTarget } = e;
        if (target !== currentTarget) return false;
        uikitPreloader.removeEventListener(endEvents.animation, handler);
        uikitPreloader.style.display = 'none';
        uikitPreloader.classList.remove('hide');

        setTimeout(() => {
          const pageEvent = new CustomEvent('pageLoaded');
          document.dispatchEvent(pageEvent);
        }, 1000);
      };
      setTimeout(() => {
        uikitPreloader.addEventListener(endEvents.animation, handler);
        uikitPreloader.classList.add('hide');
      }, 500);
    }
    
    document.body.classList.add('loaded');
  }
}

window.disablingPreloader = Preloader.disablingPreloader;