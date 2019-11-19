;(function() {
  "use strict";

  class Preloader {
    static disablingPreloader() {
      const preloader = document.querySelector('.js-preloader');
      const handler = () => {
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

    static init() {
      document.addEventListener('DOMContentLoaded', Preloader.disablingPreloader);
    }
  }

  Preloader.init();
})();
