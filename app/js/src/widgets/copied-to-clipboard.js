class CopyToClipboard {
  constructor(item) {
    this.copyText = item;

    this.message = document.querySelector('.js-copy-message');

    this.addEvents();
  }

  addEvents() {
    this.copyText.addEventListener('click', (e) => {
      e.preventDefault();

      if (this.copyText.querySelector('.uikit-colors__item')) {
        this.textCopy(this.copyText.nextElementSibling.textContent);
      } else {
        this.textCopy(this.copyText.textContent);
      }

      this.setActive(this.message);

      setTimeout(() => this.removeActive(this.message), 800);
    });
  }

  textCopy(text) {
    const target = document.createElement('textarea');
    target.style.position = 'absolute';
    target.style.left = '-9999px';
    target.style.top = '0';
    target.textContent = text;
    document.body.appendChild(target);
    target.focus();
    target.setSelectionRange(0, target.value.length);

    try {
      document.execCommand('copy');
      target.remove();
      console.log('Copied to clipboard: "' + text + '"');
    } catch (e) {
      console.log('Can\'t copy string on this browser. Try to use Chrome, Firefox or Opera.');
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
  const copyText = document.querySelectorAll('.js-td-copy');
  copyText.forEach(item => {
    CopyToClipboard.init(item);
  });
});
