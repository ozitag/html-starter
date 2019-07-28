;(function() {
  window.addEventListener('DOMContentLoaded', () => {
    window.svg4everybody()

    $('.js-dropdown-box').each(function() {
      $(this).dropdown({
        prefix: $(this).data('prefix'),
      })
    })
  })

  document.documentElement.addEventListener(
    'touchstart',
    function(event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    },
    false,
  )
})()
