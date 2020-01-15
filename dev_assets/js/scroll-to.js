class ScrollTo {
  static startAnimation (targetId) {
    const duration = 1200,
      targetElem = document.querySelector(`[data-id="${targetId}"]`),
      startPos = window.pageYOffset,
      targetPos = targetElem.getBoundingClientRect().top,
      startTime = performance.now();

    raf(animation);

    function animation (currentTime) {
      const
        elapsedTime = currentTime - startTime,
        nextStep = ScrollTo.timingFunction(
          elapsedTime, startPos, targetPos, duration,
        );

      scrollTo(0, nextStep);

      if (elapsedTime < duration) raf(animation);
      else ScrollTo.respond(targetId);
    }
  }

  static timingFunction (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  static respond (targetId) {
    const event = new CustomEvent('endScroll', {
      detail: { targetId },
    });

    document.dispatchEvent(event);
  }
}

window.startScrollTo = ScrollTo.startAnimation;