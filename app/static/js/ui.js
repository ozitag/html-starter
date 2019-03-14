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

    Popups.addBeforeListener('example-2', function ($popup) {
      console.log('popup example-2 before list', $popup);
    });

    Popups.addListener('popupId13123', function ($popup) {
      console.log('popup example-2 lists', $popup);
    });

    document.documentElement.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, false);
  });
})();