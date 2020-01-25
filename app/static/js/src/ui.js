class App {
  constructor() {
    this.addEvents();
  }

  addEvents() {
    window.addEventListener('DOMContentLoaded', () => {
      this.initLibs();
      this.initUI();
    });

    document.documentElement.addEventListener('touchstart', e => {
      if (e.touches.length > 1) e.preventDefault();
    });
  }

  initLibs() {
    window.svg4everybody();
  }

  initUI() {
  }

  static init() {
    return new App();
  }
}

const app = App.init();
