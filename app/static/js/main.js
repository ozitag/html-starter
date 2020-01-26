import './vendors';
import './polyfills';

import(/* webpackChunkName: "layout" */ './src/utils/layout');
import(/* webpackChunkName: "scroll-observer" */ './src/utils/scroll-observer');
import(/* webpackChunkName: "resize-observer" */ './src/utils/resize-observer');
import(/* webpackChunkName: "scroll-control" */ './src/utils/scroll-control');
import(/* webpackChunkName: "preloader" */ './src/utils/preloader');
import(/* webpackChunkName: "popups" */ './src/widgets/popups');

class App {
  constructor() {
    this.addEvents();
  }

  addEvents() {
    window.addEventListener('DOMContentLoaded', () => {
      this.initLibs();
    });

    document.documentElement.addEventListener('touchstart', e => {
      if (e.touches.length > 1) e.preventDefault();
    });
  }

  initLibs() {
    window.svg4everybody();
  }

  static init() {
    return new App();
  }
}

const app = App.init();
