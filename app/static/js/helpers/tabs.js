(function ($) {
  'use strict';

  var methods = {
    tabsData: {},
    init: function (options) {
      var settings = $.extend({
        activeTab: false,
        btnSelector: '[data-tabs]',
        onShow: function () {
        }
      }, options);

      var that = this;
      var $tabButtons = this.find(settings.btnSelector);
      that.tabsData = {};

      if ($tabButtons.length === 0) return;

      $tabButtons.each(function () {
        that.tabsData[$(this).data('tabs')] = {
          button: $(this),
          content: $('#' + $(this).data('tabs')),
          activated: false
        };
      });

      if (settings.activeTab) {
        methods.show(settings.activeTab, that.tabsData, settings);
      } else {
        if (this.find(settings.btnSelector + '.active').data('tabs')) {
          methods.show(this.find(settings.btnSelector + '.active').data('tabs'), that.tabsData, settings);
        } else {
          methods.show(this.find(settings.btnSelector).first().data('tabs'), that.tabsData, settings);
        }
      }

      $tabButtons.on('click', function () {
        settings.activeTab = false;
        methods.show($(this).data('tabs'), that.tabsData, settings);
        return false;
      })
    },

    show: function (tabId, tabsData, settings) {
      for (var i in tabsData) {
        if (tabsData.hasOwnProperty(i)) {
          tabsData[i].content.hide();
          tabsData[i].button.removeClass('active');
        }
      }

      if (tabId in tabsData) {
        tabsData[tabId].content.show();
        tabsData[tabId].button.addClass('active');

        if (tabsData[tabId].activated === false) {
          for (var j in tabsData) {
            if (tabsData.hasOwnProperty(j)) {
              tabsData[j].activated = j === tabId;
            }
          }
          settings.onShow(tabsData[tabId].content);
        }
      }
    }
  };

  $.fn.customTabs = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('The method named ' + method + ' does not exist for jQuery.customTabs');
    }
  };
})(jQuery);