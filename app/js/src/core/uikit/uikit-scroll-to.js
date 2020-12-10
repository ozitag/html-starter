class UikitScrollTo {
  static startAnimation(targetElem, noAnimate) {
    let targetPos = targetElem.getBoundingClientRect().top - 70;

    if ('scrollBehavior' in document.body.style) {
      UikitScrollTo.respond(targetElem);
      return scrollBy({
        top: targetPos,
        behavior: 'smooth',
      });
    }

    const duration = 1200;
    const startPos = getScrollPos();
    const startTime = performance.now();

    raf(animation);

    function animation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const nextStep = UikitScrollTo.timingFunction(
        elapsedTime, startPos, targetPos, duration,
      );

      scrollTo(0, nextStep);

      if (elapsedTime < duration) raf(animation);
      else UikitScrollTo.respond(targetElem);
    }
  }

  static timingFunction(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  static respond(targetElem) {
    const event = new CustomEvent(
      'endScroll', {
        detail: { targetElem },
      });

    document.dispatchEvent(event);
  }
}

window.startUikitScrollTo = UikitScrollTo.startAnimation;
