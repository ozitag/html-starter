;(function(global) {
  'use strict'

  var MOBILE_WIDTH = 767
  var TABLET_WIDTH = 1249

  var Layout = {
    _listeners: [],
    _documentClickListeners: [],

    is_mobile: 0,
    is_tablet: 0,

    isMobileLayout: function() {
      return $(window).width() <= MOBILE_WIDTH
    },

    isTabletLayout: function() {
      return $(window).width() <= TABLET_WIDTH && this.isMobileLayout() === false
    },

    isDesktopLayout: function() {
      return this.isMobileLayout() === false && this.isTabletLayout() === false
    },

    addListener: function(func) {
      this._listeners.push(func)
    },

    _fireChangeMode: function() {
      var that = this

      setTimeout(function() {
        for (var i = 0; i < that._listeners.length; i++) {
          that._listeners[i](that.is_mobile)
        }
      }, 0)
    },

    addDocumentClickHandler: function(handler) {
      this._documentClickListeners.push(handler)
    },

    fireDocumentClick: function(e) {
      this._documentClickListeners.forEach(function(handler) {
        handler(e)
      })
    },

    isTouchDevice: function() {
      return 'ontouchstart' in document.documentElement
    },

    init: function() {
      this.is_mobile = this.isMobileLayout()

      $(window).on('resize', function() {
        var isMobile = Layout.isMobileLayout()
        var isTablet = Layout.isTabletLayout()

        if (isMobile !== Layout.is_mobile) {
          Layout.is_mobile = isMobile
          Layout._fireChangeMode()
        } else if (isTablet !== Layout.is_tablet) {
          Layout.is_tablet = isTablet
          Layout._fireChangeMode()
        }
      })

      Layout._fireChangeMode()

      var documentClick = false
      $(document).on('touchstart', function() {
        documentClick = true
      })
      $(document).on('touchmove', function() {
        documentClick = false
      })
      $(document).on('click touchend', function(e) {
        if (e.type === 'click') {
          documentClick = true
        }
        if (documentClick) {
          Layout.fireDocumentClick(e)
        }
      })
    },
  }

  Layout.init()

  global.Layout = Layout

  global.isMobileLayout = function() {
    return Layout.isMobileLayout()
  }

  global.isTabletLayout = function() {
    return Layout.isTabletLayout()
  }

  global.isDesktopLayout = function() {
    return Layout.isDesktopLayout()
  }
})(window)
