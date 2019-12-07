const Popups = {
  $overlay: null,

  $popup: null,
  popupMode: null,

  listeners: {},
  beforeListeners: {},

  popupsOpened: [],

  disabled: false,

  bodyScroll: null,

  showOverlay: function(callback) {
    this.createOverlay();
    this.$overlay.fadeIn(callback);
  },

  hideOverlay: function() {
    this.$overlay.fadeOut();
  },

  createOverlay: function() {
    const that = this;

    if (this.$overlay !== null) {
      return false;
    }

    this.$overlay = $('<div/>')
      .addClass('popup')
      .css('display', 'none')
      .appendTo($('body'));

    this.$overlay.on('click', function(e) {
      const target = $(e.target);
      if (target.hasClass('popup')) {
        that.hide();
        $('body').removeClass('popup-opened');
        if (window.innerWidth < 768) {
          window.scrollBy(0, that.bodyScroll);
        }
      }
    });

    this.$overlay.on('click', '.js-close-wnd', function() {
      that.hide();
      $('body').removeClass('popup-opened');
      if (window.innerWidth < 768) {
        window.scrollBy(0, that.bodyScroll);
      }
      return false;
    });
  },

  open: function(url, callback) {
    if (this.disabled) {
      return;
    }

    const that = this;

    if (this.$popup && this.$popup.length) {
      that.hide();
    }

    const $loader = $(
      '<div class="preloader-overlay" style="display: block"><div class="preloader-block"> <div class="preloader-block__circle_01"></div> <div class="preloader-block__circle_02"></div> <div class="preloader-block__circle_03"></div> <div class="preloader-block__circle_04"></div> <div class="preloader-block__circle_05"></div> <div class="preloader-block__circle_06"></div> <div class="preloader-block__circle_07"></div> <div class="preloader-block__circle_08"></div> <div class="preloader-block__circle_09"></div> <div class="preloader-block__circle_10"></div> <div class="preloader-block__circle_11"></div> <div class="preloader-block__circle_12"></div> </div> </div> ',
    );
    that.$overlay.append($loader);

    that.popupMode = 'ajax';

    this.showOverlay(function() {
      that.$popup = that.$overlay;

      if (that.$popup.length === 1) {
        $loader.remove();
      }

      $.get(url, function(response) {
        that.$popup.html(response);

        const popupId = that.$popup.find('.popup').data('popup-id');

        if (popupId in that.listeners) {
          const listeners = that.listeners[popupId];
          for (let i = 0; i < listeners.length; i++) {
            listeners[i](that.$popup);
          }
        }

        if (typeof callback !== 'undefined') {
          callback(that.$popup, popupId, url);
        }
      });
    });
  },

  openById: function(id, callback) {
    if (this.disabled) {
      return;
    }

    const that = this;

    $('body').addClass('popup-opened');

    const $popup = $('#' + id);

    if ($popup.length === 0) {
      return;
    }

    if (this.$popup && this.$popup.length) {
      that.hide();
    }

    that.popupMode = 'id';

    let waitCallback = function(callback) {
      callback();
    };

    const popupId = $popup.data('popup-id');
    if (popupId in this.beforeListeners) {
      waitCallback = this.beforeListeners[popupId];
    }

    waitCallback(function() {
      that.showOverlay(function() {
        $('body').addClass('popup-opened');
        $popup.removeClass('phide').addClass('pshow');

        that.$popup = that.$overlay;
        that.$popup.append($popup);

        const popupId = that.$popup.find('.popup__box').data('popup-id');

        if (popupId in that.listeners) {
          const listeners = that.listeners[popupId];
          for (let i = 0; i < listeners.length; i++) {
            listeners[i](that.$popup.find('.popup__box'), that.popupsOpened.indexOf(id) === -1);
          }
        }
        that.popupsOpened.push(id);

        if (typeof callback !== 'undefined') {
          callback(that.$popup, popupId);
        }
      });
    });
  },

  openFrame: function(url, width, height) {
    if (this.disabled) {
      return;
    }

    const that = this;

    if (this.$popup && this.$popup.length) {
      that.hide();
    }

    const $frame = $('<iframe/>').hide();
    $frame.attr('src', url);
    $frame.attr('width', '100%');
    $frame.attr('height', '100%');
    $frame.attr('border', 0);
    $frame.css('border', 0);

    const popupWidth = width ? width : 300;
    const popupHeight = height ? height : 300;

    const $popup = $('<div/>')
      .addClass('popup__box')
      .css({
        width: popupWidth + 'px',
        height: popupHeight + 'px',
      })
      .addClass('popup__frame');

    const $loader = $(
      '<div class="preloader-overlay" style="display: block"><div class="preloader-block"> <div class="preloader-block__circle_01"></div> <div class="preloader-block__circle_02"></div> <div class="preloader-block__circle_03"></div> <div class="preloader-block__circle_04"></div> <div class="preloader-block__circle_05"></div> <div class="preloader-block__circle_06"></div> <div class="preloader-block__circle_07"></div> <div class="preloader-block__circle_08"></div> <div class="preloader-block__circle_09"></div> <div class="preloader-block__circle_10"></div> <div class="preloader-block__circle_11"></div> <div class="preloader-block__circle_12"></div> </div> </div> ',
    );
    $popup.append($loader);
    $popup.append('<a href="#" class="popup__close icon-close-popup js-close-wnd"></a>');
    $popup.append($frame);

    $frame.on('load', function() {
      $loader.remove();
      $frame.removeClass('phide').addClass('pshow');
    });

    this.showOverlay(function() {
      that.$popup.append($popup);
    });
  },

  hide: function() {
    if (this.popupMode === 'id') {
      if (this.$popup) {
        this.$popup
          .find('.popup__box')
          .removeClass('pshow')
          .addClass('phide')
          .appendTo($('body'));
        this.$popup.find('.popup__box').remove();
      }
    } else if (this.popupMode === 'ajax') {
      if (this.$popup) {
        this.$popup.find('.popup__box').remove();
      }
    }

    this.hideOverlay();
    $('body').removeClass('popup-opened');
  },

  bindEvents: function() {
    const that = this;

    $('body')
      .on('click', '[data-popup-ajax]:not([data-popup-auto=0])', function() {
        if (window.innerWidth < 768) {
          that.bodyScroll = $(window).scrollTop();
        }
        $('body').addClass('popup-opened');
        Popups.open($(this).data('popup-ajax'));
        return false;
      })
      .on('click', '[data-popup-frame]:not([data-popup-auto=0])', function() {
        if (window.innerWidth < 768) {
          that.bodyScroll = $(window).scrollTop();
        }
        $('body').addClass('popup-opened');
        Popups.openFrame($(this).data('popup-frame'), $(this).data('frame-width'), $(this).data('frame-height'));
        return false;
      })
      .on('click', '[data-popup]:not([data-popup-auto=0])', function() {
        if (window.innerWidth < 768) {
          that.bodyScroll = $(window).scrollTop();
        }
        $('body').addClass('popup-opened');
        Popups.openById($(this).data('popup'));
        return false;
      });
  },

  addBeforeListener: function(popupId, callback) {
    this.beforeListeners[popupId] = callback;
  },

  addListener: function(popupId, callback) {
    if (popupId in this.listeners === false) {
      this.listeners[popupId] = [];
    }

    this.listeners[popupId].push(callback);
  },

  Init: function() {
    this.bindEvents();
  },

  Disable: function() {
    this.disabled = true;
  },
};

window.Popups = Popups;

Popups.Init();
