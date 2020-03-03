class Preloader {
  static disablingPreloader() {
    const preloader = document.querySelector('.js-preloader');
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
    document.body.classList.add('loaded');
  }
}

window.disablingPreloader = Preloader.disablingPreloader;