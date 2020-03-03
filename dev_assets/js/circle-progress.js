function circleProgress (container) {
  const circle = container.querySelector('circle:last-child');
  let value = container.dataset.value;

  let r = circle.getAttribute('r');
  let c = Math.PI * (r * 2);

  if (value < 0) {
    value = 0;
  }
  if (value > 100) {
    value = 100;
  }

  circle.setAttribute('stroke-dashoffset', `${((100 - value) / 100) * c}`);
}