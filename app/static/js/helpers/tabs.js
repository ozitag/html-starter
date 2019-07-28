;(function($, global) {
  'use strict'

  function CustomTabs($elem, options) {
    var that = this
    this.$elem = $elem

    options = $.extend(
      {
        tabsSelector: '.js-tabs ._link',
        onShow: function() {},
      },
      options,
    )

    var $tabButtons = this.$elem.find(options.tabsSelector)
    if ($tabButtons.length === 0) {
      return
    }

    var tabsData = {}
    $tabButtons.each(function() {
      tabsData[$(this).data('id')] = {
        button: $(this),
        content: $('#' + $(this).data('id')),
        activated: false,
      }
    })

    this.showTab = function(tabId) {
      for (var i in tabsData) {
        if (tabsData.hasOwnProperty(i)) {
          tabsData[i].content.removeClass('active').hide()
        }
      }
      $tabButtons.removeClass('active')

      if (tabId in tabsData) {
        tabsData[tabId].content.addClass('active').show()
        tabsData[tabId].button.addClass('active')

        if (tabsData[tabId].activated === false) {
          tabsData[tabId].activated = true
          options.onShow(tabsData[tabId].content)
        }
      }
    }

    if (global.location && global.location.hash && tabsData[global.location.hash.substr(1)]) {
      this.showTab(global.location.hash.substr(1))
    } else {
      this.showTab(this.$elem.find('.js-tabs ._link.active').data('id'))
    }

    $tabButtons.on('click', function() {
      that.showTab($(this).data('id'))
      return false
    })
  }

  $.fn.customTabs = function(options) {
    $(this).each(function() {
      new CustomTabs($(this), options)
    })
  }

  $(function() {
    $('.js-tabs-container').customTabs()
  })
})(jQuery, window)
