let busy = false;

class Accord {
  constructor (item) {
    this.accord = item;
    this.addEvents();
  }

  addEvents () {
    this.accord.addEventListener('click', () => {
      if (busy) return false;
      busy = true;

      if (this.accord.classList.contains('active')) {
        Accord.collapse(this.accord.nextElementSibling);
        Accord.removeActive(this.accord);
      } else {
        const container = this.accord.closest('.js-accords');
        const currActive = container.querySelector('.js-accord.active');

        if (currActive) {
          Accord.collapse(currActive.nextElementSibling);
          Accord.removeActive(currActive);
        }

        Accord.setActive(this.accord);
        Accord.expand(this.accord.nextElementSibling);
      }
    });
  }

  static collapse (elem) {
    const height = {
      from: elem.scrollHeight,
      to: 0,
    };

    Accord.animate(elem, height);
  }

  static expand (elem) {
    const height = {
      from: 0,
      to: elem.scrollHeight,
    };

    Accord.animate(elem, height);
  }

  static animate (elem, height) {
    const handler = e => {
      if (e.target !== e.currentTarget) return false;
      elem.removeEventListener(endEvents.transition, handler);
      elem.classList.remove('animate');
      elem.style.height = '';
      busy = false;
    };
    elem.addEventListener(endEvents.transition, handler);

    elem.classList.add('animate');
    elem.style.height = `${height.from}px`;
    raf2x(() => {
      elem.style.height = `${height.to}px`;
    });
  }

  static setActive (elem) {
    elem.classList.add('active');
  }

  static removeActive (elem) {
    elem.classList.remove('active');
  }

  static init (elem) {
    new Accord(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const accords = document.querySelectorAll('.js-accord');
  accords.forEach(item => {
    Accord.init(item);
  });
});
