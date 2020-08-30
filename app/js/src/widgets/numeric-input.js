class NumericInput {
  constructor(node) {
    this.$node = node;

    if (typeof setInputFilter === 'undefined') {
      throw new Error('Please, include input-filter.js');
    }

    setInputFilter(this.$node, value => {
      return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });
  }

  static init(el) {
    new NumericInput(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-numeric-input').forEach(item => NumericInput.init(item));
});
