const polyfills = {
  collection: [
    function endEvents() {
      window.endEvents = {
        transition: {
          'transition': 'transitionend',
          'WebkitTransition': 'webkitTransitionEnd',
          'MozTransition': 'mozTransitionEnd',
          'OTransition': 'oTransitionEnd',
          'msTransition': 'MSTransitionEnd',
        },

        animation: {
          'animation': 'animationend',
          'WebkitAnimation': 'webkitAnimationEnd',
          'MozAnimation': 'mozAnimationEnd',
          'OAnimation': 'oAnimationEnd',
          'msAnimation': 'MSAnimationEnd',
        },
      };

      const elem = document.createElement('div');

      for (let endKey in window.endEvents) {
        const endType = window.endEvents[endKey];

        for (let event in endType) {
          if (event in elem.style) {
            window.endEvents[endKey] = endType[event];
            break;
          }
        }
      }
    },

    function passiveEvent() {
      window.passiveIfSupported = null;

      try {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
          get: function() {
            window.passiveIfSupported = { passive: true };
          },
        }));
      } catch (err) {
        window.passiveIfSupported = false;
      }
    },

    function customEvent() {
      if (typeof window.CustomEvent !== 'function') {
        const CustomEvent = (event, params) => {
          const evt = document.createEvent('CustomEvent');

          params = params || { bubbles: false, cancelable: false, detail: undefined };
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

          return evt;
        };

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
      }
    },

    function raf() {
      window.raf =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    },

    function raf2x() {
      window.raf2x = callback => {
        raf(() => raf(callback));
      };
    },

    function matches() {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.webkitMatchesSelector ||
          Element.prototype.msMatchesSelector;
      }
    },

    function closest() {
      if (!Element.prototype.closest) {
        Element.prototype.closest = function(selector) {
          for (let i = this; i !== document.documentElement; i = i.parentNode) {
            if (i.matches(`${selector}`)) return i;
          }

          return null;
        };
      }
    },

    function webpChecker() {
      const webp = new Image();
      ['load', 'error'].forEach(eventName => {
        webp.addEventListener(eventName, () => {
          webp.height == 2 && document.body.classList.add('webp');
        });
      });
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    },

    function dataset() {
      if (!document.body.dataset) {
        Object.defineProperty(HTMLElement.prototype, 'dataset', {
          get() {
            const elem = this;
            const attrs = elem.attributes;
            const dataAttrs = {};

            for (let attr in attrs) {
              if (attrs.hasOwnProperty(attr) && attrs[attr].name.search('data') === 0) {
                const attrName = attrs[attr].name.slice(5);
                const propName = attrName.replace(/-\w/gi, str => {
                  return str.slice(1).toUpperCase();
                });

                Object.defineProperty(dataAttrs, propName, {
                  get() {
                    return elem.getAttribute(`data-${attrName}`);
                  },
                  set(newValue) {
                    elem.setAttribute(`data-${attrName}`, newValue);
                  },
                });
              }
            }

            return dataAttrs;
          },
        });
      }
    },
  ],

  init() {
    this.collection.forEach(item => item());
  },
};

polyfills.init();