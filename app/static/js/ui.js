(function ($) {
    'use strict';

    $(function () {


        document.documentElement.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, false);
    });
})(jQuery);