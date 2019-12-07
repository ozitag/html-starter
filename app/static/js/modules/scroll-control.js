class ScrollControl {
  static show() {
    if (!document.body.classList.contains('fixed-scroll')) {
      return false;
    }

    document.body.classList.remove('fixed-scroll');
    document.body.style.paddingRight = ``;

    if (isMobileLayout()) {
      const currYOffset = getComputedStyle(document.body).top;
      document.body.style.top = ``;
      window.scrollTo(0, parseFloat(currYOffset || '0') * -1);
    }
  }

  static hide() {
    if (document.body.classList.contains('fixed-scroll')) {
      return false;
    }

    if (isMobileLayout()) {
      document.body.style.top = `-${window.pageYOffset}px`;
    }

    document.body.classList.add('fixed-scroll');
    document.body.style.paddingRight = ScrollControl._calcScrollbarWidth();
  }

  static _calcScrollbarWidth() {
    const scrollbarMeasure = document.createElement('div');
    scrollbarMeasure.className = 'scroll-measure';

    document.body.appendChild(scrollbarMeasure);

    const offsetWidth = scrollbarMeasure.offsetWidth;
    const clientWidth = scrollbarMeasure.clientWidth;
    const scrollbarWidth = `${offsetWidth - clientWidth}px`;

    document.body.removeChild(scrollbarMeasure);

    return scrollbarWidth;
  }
}

window.showScrollbar = ScrollControl.show;
window.hideScrollbar = ScrollControl.hide;