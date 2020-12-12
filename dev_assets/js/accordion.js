class Accordion extends Widget {
  constructor(node) {
    super(node, '.js-accordion');

    this.$items = this.$node.querySelectorAll('.js-accord');
    this.init();
  }

  build() {
    this.$items.forEach(item => {
      const instance = Accord.get(item);
      if (!instance) return;
      instance.on('opening', () => {
        this.$items.forEach(_item => {
          if (_item !== item) {
            Accord.get(_item).close();
          }
        });
      });
    });
  }

  static init(el) {
    el && new Accordion(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-accordion').forEach(Accordion.init);
});
