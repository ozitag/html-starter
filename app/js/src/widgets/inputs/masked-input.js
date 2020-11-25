class MaskedInput extends Widget {
  constructor(node) {
    super(node, '.js-masked-input');

    const mask = this.$node.dataset.mask;
    if (!mask) {
      return;
    }

    new IMask(this.$node, {
      mask,
    });
  }

  static init(el) {
    new MaskedInput(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-masked-input').forEach(item => MaskedInput.init(item));
});
