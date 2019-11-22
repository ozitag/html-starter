class App {
  constructor() {
    this.addEvents();
  }

  addEvents() {
    window.addEventListener('DOMContentLoaded', () => {
      window.svg4everybody()

      $('.js-dropdown-box').each(function() {
        $(this).dropdown({
          prefix: $(this).data('prefix'),
        })
      })
    })

    document.documentElement.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }, false)
  }

  static init() {
    return new App();
  }
}

const app = App.init();