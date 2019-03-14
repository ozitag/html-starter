(function (global) {
  'use strict';

  const Popups = {
    $body: $('body'),
    $overlay: null,
    $popup: null,
    popupMode: null,
    listeners: {},
    beforeListeners: {},
    popupsOpened: [],
    disabled: false,
    bodyScroll: null,
    $loader: $('<div class="loader" style="display: block"><div class="loader__circle"></div></div>'),
    $closeBtn: $('<a href="#" class="popup__close icon-close-popup js-close-wnd"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.446 10L20 18.554L18.553 20L10 11.446L1.446 20L0 18.554L8.553 10L0 1.446L1.446 0L10 8.554L18.553 0L20 1.446L11.446 10Z" fill="#D1D1D1"/></svg></a>'),

    createOverlay: function () {
      const that = this;

      if (this.$overlay !== null) {
        return false;
      }

      this.$overlay = $('<div/>').addClass('popup').css('display', 'none').appendTo(that.$body);

      this.$overlay.on('click', function (e) {
        const target = $(e.target);

        if (target.hasClass('popup') || target.closest('.js-close-wnd').length) {
          that.hide();

          return false;
        }
      });
    },

    showOverlay: function (callback) {
      this.$overlay.fadeIn(callback);
    },

    hideOverlay: function () {
      this.$overlay.fadeOut();
    },

    open: function () {
      if (window.innerWidth < 768) {
        this.bodyScroll = $(window).scrollTop();
      }

      this.$body.addClass('popup-opened');
    },

    openById: function (id, callback) {
      const that = this;
      const $popup = $('#' + id);

      if ($popup.length === 0) return;

      if (this.$popup && this.$popup.length) {
        that.hide();
      }

      that.popupMode = 'id';

      const popupId = $popup.data('popup-id');

      if (popupId in that.beforeListeners) {
        that.beforeListeners[popupId]($popup);
      }

      that.showOverlay(function () {
        $popup.removeClass('phide').addClass('pshow');

        that.$popup = that.$overlay;
        that.$popup.append($popup);

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
    },

    openAjax: function (url, callback) {
      const that = this;

      if (this.$popup && this.$popup.length) {
        that.hide();
      }

      const $popup = $('<div/>').addClass('popup__box popup__ajax phide');
      $popup.append(that.$closeBtn);

      that.$overlay.append(that.$loader);

      that.popupMode = 'ajax';

      this.showOverlay(function () {
        that.$popup = that.$overlay;

        if (that.$popup.length === 1) {
          that.$loader.remove();
        }

        $.get(url, function (response) {
          $popup.append(response).removeClass('phide').addClass('pshow');
          that.$popup.append($popup);

          const popupId = that.$popup.find('[data-popup-id]').data('popup-id');

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

    openFrame: function (url, width, height) {
      const that = this;

      if (this.$popup && this.$popup.length) {
        that.hide();
      }

      that.popupMode = 'frame';

      const $frame = $('<iframe/>').hide();
      $frame.attr({
        src: url,
        width: '100%',
        height: '100%',
        border: 0,
        style: 'border: 0'
      });

      const popupWidth = width ? width : 300;
      const popupHeight = height ? height : 300;

      const $popup = $('<div/>').addClass('popup__box').css({
        width: popupWidth + 'px',
        height: popupHeight + 'px'
      }).addClass('popup__frame');

      that.$overlay.append(that.$loader);

      $popup.append(that.$closeBtn, $frame);

      $frame.on('load', function () {
        that.$loader.remove();
        $frame.show();
        $popup.addClass('pshow');
      });

      this.showOverlay(function () {
        that.$popup = that.$overlay;

        that.$popup.append($popup);
      });
    },

    hide: function () {
      const that = this;

      if (window.innerWidth < 768) {
        window.scrollBy(0, that.bodyScroll);
      }

      that.$body.removeClass('popup-opened');

      if (this.popupMode === 'id') {
        if (this.$popup) {
          this.$popup.find('.popup__box').removeClass('pshow').addClass('phide').appendTo(that.$body);
          this.$popup.find('.popup__box').remove();
        }
      }

      if (this.popupMode === 'ajax') {
        if (this.$popup) {
          this.$popup.empty();
        }
      }

      if (this.popupMode === 'frame') {
        if (this.$popup) {
          this.$popup.find('.popup__box').remove();
        }
      }

      that.$popup = null;
      this.hideOverlay();
    },

    bindEvents: function () {
      const that = this;

      that.$body.on('click', '[data-popup-ajax]:not([data-popup-auto=0])', function () {
        if (this.disabled) return;

        that.open();
        Popups.openAjax($(this).data('popup-ajax'));

        return false;
      }).on('click', '[data-popup-frame]:not([data-popup-auto=0])', function () {
        if (this.disabled) return;

        that.open();
        Popups.openFrame($(this).data('popup-frame'), $(this).data('frame-width'), $(this).data('frame-height'));

        return false;
      }).on('click', '[data-popup]:not([data-popup-auto=0])', function () {
        if (this.disabled) return;

        that.open();
        Popups.openById($(this).data('popup'));

        return false;
      });
    },

    addBeforeListener: function (popupId, callback) {
      this.beforeListeners[popupId] = callback;
    },

    addListener: function (popupId, callback) {
      if (popupId in this.listeners === false) {
        this.listeners[popupId] = [];
      }

      this.listeners[popupId].push(callback);
    },

    Init: function () {
      this.createOverlay();
      this.bindEvents();
    },

    Disable: function () {
      this.disabled = true;
    }
  };

  global.Popups = Popups;

  Popups.Init();
})(window);
