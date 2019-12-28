class HighlightScroll {
  constructor (container, anchors) {
    this.container = container;
    this.anchors = anchors;
    this.busy = false;

    raf(() => this.checkInView());
    this.addEvents();
  }

  addEvents () {
    listenScroll(() => {
      if (this.busy) return false;
      this.checkInView();
    });

    this.container.addEventListener('click', e => {
      if (this.busy || isTabletLayout()) return false;
      this.busy = true;
      const trigger = e.target.closest('[data-anchor]');
      if (!trigger || trigger.classList.contains('active')) {
        return this.busy = false;
      }
      this.checkPrevActive();
      HighlightScroll.setActiveAnchor(trigger);
      this.scrollTo(trigger);
    });

    document.addEventListener('endScroll', e => {
      const targetId = e.detail.targetId;
      const currActive = this.container.querySelector(
        `[data-anchor="${targetId}"].active`,
      );

      if (currActive) {
        this.busy = false;
      }
    });
  }

  checkInView () {
    const containerCords = this.container.getBoundingClientRect();

    if (containerCords.top + 50 < 0 && containerCords.bottom + 50 < 0) {
      return false;
    }

    for (let i = 0; i < this.anchors.length; i++) {
      const anchor = this.anchors[i];
      const targetElem = this.container.querySelector(`[data-id="${anchor.dataset.anchor}"]`);
      const elemCords = targetElem.getBoundingClientRect();

      if (elemCords.top <= 140 && elemCords.bottom > 140) {
        if (targetElem.classList.contains('active')) break;

        this.checkPrevActive();
        HighlightScroll.setActiveAnchor(anchor);
        break;
      }
    }
  }

  scrollTo (anchor) {
    const targetId = anchor.dataset.anchor;
    startScrollTo(targetId);
  }

  checkPrevActive () {
    const prevActive = this.container.querySelector('[data-anchor].active');

    if (prevActive) {
      HighlightScroll.removeActiveAnchor(prevActive);
    }
  }

  static setActiveAnchor (elem) {
    elem.classList.add('active');
  }

  static removeActiveAnchor (elem) {
    elem.classList.remove('active');
  }

  static init () {
    const container = document.querySelector('.js-highlight-scroll');
    if (!container || 'init' in container.dataset) return false;
    container.setAttribute('data-init', true);
    const anchors = container.querySelectorAll('[data-anchor]');
    return new HighlightScroll(container, anchors);
  }
}

window.HighlightScroll = HighlightScroll;