(function (global) {
    "use strict";

    var MOBILE_WIDTH = 767;
    var TABLET_WIDTH = 960;

    var Layout = {
        _listeners: [],

        is_mobile: 0,

        isMobileLayout: function () {
            return $(window).width() <= MOBILE_WIDTH;
        },

        isTabletLayout: function () {
            return $(window).width() <= TABLET_WIDTH && this.isMobileLayout() === false;
        },

        isDesktopLayout: function () {
            return this.isMobileLayout() === false && this.isTabletLayout() === false;
        },

        addListener: function (func) {
            this._listeners.push(func);
        },

        changeMode: function (mode) {
            this.is_mobile = mode;

            var that = this;

            setTimeout(function () {
                for (var i = 0; i < that._listeners.length; i++) {
                    that._listeners[i](that.is_mobile);
                }
            }, 0);
        },

        init: function () {
            this.is_mobile = this.isMobileLayout();

            $(window).on('resize', function () {
                var is_mobile = Layout.isMobileLayout();
                if (is_mobile !== Layout.is_mobile) {
                    Layout.changeMode(is_mobile);
                }
            });
        }
    };

    Layout.init();


    global.Layout = Layout;

    global.isMobileLayout = function () {
        return Layout.isMobileLayout();
    };

    global.isTabletLayout = function () {
        return Layout.isTabletLayout();
    };

    global.isDesktopLayout = function () {
        return Layout.isDesktopLayout();
    };

})(window);