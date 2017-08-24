(function ($) {
    'use strict';

    function Tabs($elem, options) {
        var that = this;
        this.$elem = $elem;

        options = $.extend({
            tabsSelector: '.js-tabs ._link',
            onShow: function () {
            }
        }, options);

        var $tabButtons = this.$elem.find(options.tabsSelector);
        if ($tabButtons.length === 0) {
            return;
        }

        var tabsData = {};
        $tabButtons.each(function () {
            tabsData[$(this).data('id')] = {
                button: $(this),
                content: $('#' + $(this).data('id')),
                activated: false
            };
        });

        this.showTab = function (tabId) {
            for (var i in tabsData) {
                if (tabsData.hasOwnProperty(i)) {
                    tabsData[i].content.hide();
                }
            }
            $tabButtons.removeClass('active');

            if (tabId in tabsData) {
                tabsData[tabId].content.show();
                tabsData[tabId].button.addClass('active');

                if (tabsData[tabId].activated === false) {
                    tabsData[tabId].activated = true;
                    options.onShow(tabsData[tabId].content);
                }
            }
        };

        this.showTab(this.$elem.find('.js-tabs ._link.active').data('id'));

        $tabButtons.on('click', function () {
            that.showTab($(this).data('id'));
            return false;
        });
    }

    $.fn.tabs = function (options) {
        $(this).each(function () {
            new Tabs($(this), options);
        });
    };

    $(function () {
        $('.js-tabs-container').tabs();
    });
})(jQuery);