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

            popup.appendTo(this.$overlay);

            return popup;
        },

        open: function (url, callback) {
            var that = this;

            if (this.$popup && this.$popup.length) {
                that.hide();
            }

            var $loader = $('<div class="preloader-overlay" style="display: block"><div class="preloader-block"> <div class="preloader-block__circle_01"></div> <div class="preloader-block__circle_02"></div> <div class="preloader-block__circle_03"></div> <div class="preloader-block__circle_04"></div> <div class="preloader-block__circle_05"></div> <div class="preloader-block__circle_06"></div> <div class="preloader-block__circle_07"></div> <div class="preloader-block__circle_08"></div> <div class="preloader-block__circle_09"></div> <div class="preloader-block__circle_10"></div> <div class="preloader-block__circle_11"></div> <div class="preloader-block__circle_12"></div> </div> </div> ');
            that.$overlay.append($loader);

            this.showOverlay(function () {
                that.$popup = that.createInstance();

                if (that.$popup.length === 1) {
                    $loader.remove();
                }

                $.get(url, function (response) {
                    that.$popup.html(response);

                    var popupId = that.$popup.find('.popup').data('popup-id');

                    if (popupId in that.listeners) {
                        var listeners = that.listeners[popupId];
                        for (var i = 0; i < listeners.length; i++) {
                            listeners[i](that.$popup);
                        }
                    }

                    if (typeof callback !== 'undefined') {
                        callback(that.$popup, popupId, url);
                    }
                });
            });
        },

        openById: function (id, callback) {
            var that = this;

            var $popup = $('#' + id).clone();
            $popup.show();
            if ($popup.length === 0) {
                return;
            }

            if (this.$popup && this.$popup.length) {
                that.hide();
            }

            this.showOverlay(function () {
                that.$popup = that.createInstance();
                that.$popup.append($popup);

                var popupId = that.$popup.find('.popup').data('popup-id');

                if (popupId in that.listeners) {
                    var listeners = that.listeners[popupId];
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i](that.$popup);
                    }
                }

                if (typeof callback !== 'undefined') {
                    callback(that.$popup, popupId);
                }
            });
        },

        openFrame: function (url, width, height) {
            var that = this;

            if (this.$popup && this.$popup.length) {
                that.hide();
            }

            var $frame = $('<iframe/>').hide();
            $frame.attr('src', url);
            $frame.attr('width', '100%');
            $frame.attr('height', '100%');
            $frame.attr('border', 0);
            $frame.css('border', 0);

            var popupWidth = width ? width : 300;
            var popupHeight = height ? height : 300;

            var $popup = $('<div/>').addClass('popup').css({
                width: popupWidth + 'px',
                height: popupHeight + 'px'
            }).addClass('popup-frame');

            var $loader = $('<div class="preloader-overlay" style="display: block"><div class="preloader-block"> <div class="preloader-block__circle_01"></div> <div class="preloader-block__circle_02"></div> <div class="preloader-block__circle_03"></div> <div class="preloader-block__circle_04"></div> <div class="preloader-block__circle_05"></div> <div class="preloader-block__circle_06"></div> <div class="preloader-block__circle_07"></div> <div class="preloader-block__circle_08"></div> <div class="preloader-block__circle_09"></div> <div class="preloader-block__circle_10"></div> <div class="preloader-block__circle_11"></div> <div class="preloader-block__circle_12"></div> </div> </div> ');
            $popup.append($loader);
            $popup.append('<a href="#" class="popup__close icon-close-popup js-close-wnd"></a>');
            $popup.append($frame);

            $frame.on('load', function () {
                $loader.remove();
                $frame.show();
            });

            this.showOverlay(function () {
                that.$popup = that.createInstance();
                that.$popup.append($popup);
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

            $('body').on('click', '[data-popup-ajax]:not([data-popup-auto=0])', function () {
                $('body').addClass('popup-opened');
                Popups.open($(this).data('popup-ajax'));
                return false;
            }).on('click', '[data-popup-frame]:not([data-popup-auto=0])', function () {
                $('body').addClass('popup-opened');
                Popups.openFrame($(this).data('popup-frame'), $(this).data('frame-width'), $(this).data('frame-height'));
                return false;
            }).on('click', '[data-popup]:not([data-popup-auto=0])', function () {
                $('body').addClass('popup-opened');
                Popups.openById($(this).data('popup'));
                return false;
            });

            this.$overlay.on('click', function (e) {
                var target = $(e.target);
                if (target.hasClass('popup-overlay')) {
                    that.hide();
                    $('body').removeClass('popup-opened');
                }
            });

            this.$overlay.on('click', '.js-close-wnd', function () {
                that.hide();
                $('body').removeClass('popup-opened');
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
