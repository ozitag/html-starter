const MOBILE_WIDTH = 767;
const TABLET_WIDTH = 1023;
const LAPTOP_WIDTH = 1279;

const Layout = {
  _listeners: [],
  _documentClickListeners: [],

  is_mobile: 0,
  is_tablet: 0,
  is_laptop: 0,

  isMobileLayout: function() {
    return $(window).width() <= MOBILE_WIDTH;
  },

  isTabletLayout: function() {
    return $(window).width() <= TABLET_WIDTH;
  },

  isBigTabletLayout: function() {
    return $(window).width() > TABLET_WIDTH && $(window).width() <= LAPTOP_WIDTH;
  },

  isLaptopLayout: function() {
    return $(window).width() <= LAPTOP_WIDTH;
  },

  isDesktopLayout: function() {
    return this.isMobileLayout() === false
      && this.isTabletLayout() === false
      && this.isLaptopLayout() === false;
  },

  addListener: function(func) {
    this._listeners.push(func);
  },

  _fireChangeMode: function() {
    const that = this;

    setTimeout(function() {
      for (let i = 0; i < that._listeners.length; i++) {
        that._listeners[i](that.is_mobile);
      }
    }, 0);
  },

  addDocumentClickHandler: function(handler) {
    this._documentClickListeners.push(handler);
  },

  fireDocumentClick: function(e) {
    this._documentClickListeners.forEach(function(handler) {
      handler(e);
    });
  },

  isTouchDevice: function() {
    return 'ontouchstart' in document.documentElement;
  },

  init: function() {
    this.is_mobile = this.isMobileLayout();

    $(window).on('resize', function() {
      const isMobile = Layout.isMobileLayout();
      const isTablet = Layout.isTabletLayout();
      const isLaptop = Layout.isLaptopLayout();

      if (isMobile !== Layout.is_mobile) {
        Layout.is_mobile = isMobile;
        Layout._fireChangeMode();
      } else if (isTablet !== Layout.is_tablet) {
        Layout.is_tablet = isTablet;
        Layout._fireChangeMode();
      } else if (isLaptop !== Layout.is_laptop) {
        Layout.is_laptop = isLaptop;
        Layout._fireChangeMode();
      }
    });

    let documentClick = false;
    $(document).on('touchstart', function() {
      documentClick = true;
    });
    $(document).on('touchmove', function() {
      documentClick = false;
    });
    $(document).on('click touchend', function(e) {
      if (e.type === 'click') {
        documentClick = true;
      }
      if (documentClick) {
        Layout.fireDocumentClick(e);
      }
    });
  },
};

Layout.init();

window.Layout = Layout;

window.isMobileLayout = function() {
  return Layout.isMobileLayout();
};

window.isTabletLayout = function() {
  return Layout.isTabletLayout();
};

window.isBigTabletLayout = function() {
  return Layout.isBigTabletLayout();
};

window.isLaptopLayout = function() {
  return Layout.isLaptopLayout();
};

window.isDesktopLayout = function() {
  return Layout.isDesktopLayout();
};
