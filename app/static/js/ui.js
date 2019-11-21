class App {
  static init() {

  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.svg4everybody()

  App.init()

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