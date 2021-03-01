class Popup {
  constructor(nodeElement) {
    this.eventHandlers = {};

    this.nodeElement = nodeElement;
    this.id = nodeElement.dataset.popupId;

    this.init();
  }

  off(event) {
    if (event in this.eventHandlers) {
      delete this.eventHandlers[event];
    }
  }

  on(event, callback) {
    if (!(event in this.eventHandlers)) {
      this.eventHandlers[event] = [];
    }

    for (let i = 0; i < this.eventHandlers[event]; i++) {
      if (this.eventHandlers[event][i] === callback) {
        return;
      }
    }

    this.eventHandlers[event].push(callback);
  }

  trigger(event, eventParams = {}) {
    if (!(event in this.eventHandlers)) {
      return;
    }

    this.eventHandlers[event].forEach(handler => handler(eventParams));
  }

  getId() {
    return this.id;
  }

  onCloseClick(e) {
    e.preventDefault();
    this.close();
  }

  init() {
    this.nodeElement.querySelectorAll('.js-popup-close')
      .forEach(element => element.addEventListener('click', this.onCloseClick.bind(this)));
  }

  close(instantClose = false) {
    if (instantClose) {
      this.nodeElement.classList.add('instant');
    }

    this.nodeElement.classList.remove('opened');

    if (instantClose) {
      setTimeout(() => {
        this.nodeElement.classList.remove('instant');
      });
    }

    setTimeout(() => {
      this.trigger('closed');
    }, 0);
  }

  open(instantOpen = false) {
    if (instantOpen) {
      this.nodeElement.classList.add('instant');
    }

    this.nodeElement.classList.add('opened');

    if (instantOpen) {
      setTimeout(() => {
        this.nodeElement.classList.remove('instant');
      });
    }
  }
}


class PopupManager {
  constructor() {
    this.popups = {};

    this.visiblePopup = null;
  }

  add(nodeElement) {
    const popup = new Popup(nodeElement);

    this.popups[popup.getId()] = popup;

    document.querySelectorAll('.js-popup-open[data-popup="' + popup.getId() + '"]').forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        this.open(e.target.dataset.popup);
      });
    });
  }

  open(popupId) {
    if (!(popupId in this.popups)) {
      throw new Error('popup not found');
    }

    if (this.visiblePopup && this.visiblePopup.getId() === popupId) {
      return;
    }

    this.createOverlay();

    if (this.visiblePopup) {
      this.visiblePopup.close(true);
    }

    const popup = this.popups[popupId];
    popup.open(this.visiblePopup !== null);

    this.visiblePopup = popup;

    popup.on('closed', () => {
      popup.off('closed');

      if (this.visiblePopup === popup) {
        this.visiblePopup = null;
        this.hideOverlay();
      }
    });
  }

  createOverlay() {
    if (this.overlay) {
      this.overlay.classList.remove('not-visible');
      return;
    }

    this.overlay = document.createElement('div');
    this.overlay.classList.add('popup-overlay');
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', () => {
      if (this.visiblePopup) {
        this.visiblePopup.close();
      }
    });
  }

  hideOverlay() {
    if (this.overlay) {
      const overlay = this.overlay;
      this.overlay.classList.add('not-visible');

      this.overlay.addEventListener('transitionend', () => {
        overlay.remove();
      });

      this.overlay = null;
    }
  }

  init() {
    document.querySelectorAll('.js-popup').forEach(popup => manager.add(popup));
  }
}

const manager = new PopupManager();
manager.init();
window.PopupManager = manager;
