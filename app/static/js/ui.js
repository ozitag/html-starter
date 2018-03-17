'use strict';

(function () {
    const App = {
        init: function () {
            $('.js-dropdown-box').each(function () {
                $(this).dropdown({
                    prefix: $(this).data('prefix')
                });
            });
        }
    };

  window.addEventListener('load', () => {
    window.svg4everybody();
    App.init();

    document.documentElement.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, false);
  });
})();