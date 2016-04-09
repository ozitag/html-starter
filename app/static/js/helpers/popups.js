(function (global) {

    'use strict';

    var Popups = {

        $overlay: null,

        $popup: null,

        listeners: {},

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

            if (this.$popup && this.$popup.length) {
                that.hide();
            }

            this.showOverlay(function () {
                that.$popup = that.createInstance();
                $.get(url, function (response) {
                    that.$popup.html(response);

                    var popupId = that.$popup.find('.popup').data('popup-id');

                    if (popupId in that.listeners) {
                        var listeners = that.listeners[popupId];
                        for (var i = 0; i < listeners.length; i++) {
                            listeners[i](that.$popup);
                        }
                    }
                });
            });
        },

        hide: function () {
            if (this.$popup) {
                this.$popup.remove();
            }
            this.hideOverlay();
        },

        bindEvents: function () {
            var that = this;

            $('body').on('click', '[data-popup-ajax]', function () {
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


        addListener: function (popupId, callback) {
            if (popupId in this.listeners === false) {
                this.listeners[popupId] = [];
            }

            this.listeners[popupId].push(callback);
        },

        Init: function () {
            this.$overlay = $('<div/>').addClass('popup-overlay').appendTo($('body'));

            this.bindEvents();
        }
    };

    global.Popups = Popups;
})(window);