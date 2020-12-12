class CopyToClipboard {
  constructor(item) {
    this.copyText = item;

    this.message = document.querySelector('.js-copy-message');

    this.addEvents();
  }

  addEvents() {
    this.copyText.addEventListener('click', (e) => {
      if (this.copyText.querySelector('.uikit-colors__item')) {
        this.textCopy(this.copyText.nextElementSibling.textContent);
      } else {
        this.textCopy(this.copyText.textContent);
      }

      this.setActive(this.message);

      setTimeout(() => this.removeActive(this.message), 800);
      return false;
    });
  }

  textCopy(text) {
    const target = document.createElement('textarea');
    target.style.position = 'absolute';
    target.textContent = text;
    this.copyText.appendChild(target);
    target.focus();
    target.setSelectionRange(0, target.value.length);

    try {
      document.execCommand('copy');
      target.remove();
    } catch (e) {
    }
  }

  setActive(elem) {
    elem.classList.add('active');
  }

  removeActive(elem) {
    elem.classList.remove('active');
  }

  static init(elem) {
    new CopyToClipboard(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const copyText = document.querySelectorAll('.js-copy-to-clipboard');
  copyText.forEach(item => {
    CopyToClipboard.init(item);
  });
});
