(function ($) {
    'use strict';

    var App = {
        init: function () {

        }
    };

    $(function () {
        $(window).on("load", function () {
           App.init();
        });

        document.documentElement.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, false);
    });
})(jQuery);