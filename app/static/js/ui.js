(function ($) {
    'use strict';

    var App = {
        init: function () {
            $('.js-dropdown-box').each(function () {
                $(this).dropdown({
                    prefix: $(this).data('prefix')
                });
            });
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