import './vendors';
import './polyfills';

class App {
  constructor () {
    this.addEvents();
  }

  addEvents () {
    document.documentElement.addEventListener('touchstart', e => {
      if (e.touches.length > 1) e.preventDefault();
    });
  }

  initLibs () {
    window.svg4everybody();
  }

  initUI () {
    disablingPreloader();
  }

  coreInit () {
    return Promise.all([
      import(/* webpackChunkName: "layout" */ './src/utils/layout'),
      import(/* webpackChunkName: "scroll-observer" */ './src/utils/scroll-observer'),
      import(/* webpackChunkName: "resize-observer" */ './src/utils/resize-observer'),
      import(/* webpackChunkName: "scroll-control" */ './src/utils/scroll-control'),
      import(/* webpackChunkName: "preloader" */ './src/utils/preloader'),
    ]);
  }

  modulesInit () {
    return Promise.all([
      import(/* webpackChunkName: "popups" */ './src/widgets/popups'),
    ]);
  }

  init () {
    this.coreInit().then(() => {
      return this.modulesInit();
    }).then(() => {
      this.initLibs();
      this.initUI();
    });
  }
}

const app = new App();
app.init();

