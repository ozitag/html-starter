(function () {

    'use strict';

    var Popups = {

        $overlay: null,

        $popup: null,

        showOverlay: function (callback) {
            this.$overlay.fadeIn(callback);
        },

        hideOverlay: function () {
            this.$overlay.fadeOut();
        },

        createInstance: function () {
            var popup = $('<div/>').addClass('popup-wrapper');

            popup.html('<div id="circleG"><div id="circleG_1" class="circleG"></div> <div id="circleG_2" class="circleG"> </div><div id="circleG_3" class="circleG"> </div> </div>');

            popup.appendTo(this.$overlay);

            return popup;
        },

        open: function (url) {
            var that = this;

            this.showOverlay(function () {
                that.$popup = that.createInstance();
                $.get(url, function (response) {
                    that.$popup.html(response);
                });
            });
        },

        hide: function () {
            this.$popup.remove();
            this.hideOverlay();
        },

        bindEvents: function () {
            var that = this;

            $('[data-popup-ajax]').on('click', function () {
                Popups.open($(this).data('popup-ajax'));
                return false;
            });

            this.$overlay.on('click', function (e) {
                var target = $(e.target);
                if (target.hasClass('popup-overlay')) {
                    that.hide();
                }
            });

            this.$overlay.on('click', '.js-close-wnd', function () {
                that.hide();
                return false;
            });
        },

        Init: function () {
            this.$overlay = $('<div/>').addClass('popup-overlay').appendTo($('body'));

            this.bindEvents();
        }
    };

    $(function () {
        Popups.Init();
    });
})();