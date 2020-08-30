class ExampleWidget extends Widget {
  constructor(node) {
    super(node, 'js-example');   // .js-example

    this.$button = this.$node.querySelector('.btn');            // .js-example__btn
    this.$children = this.$node.querySelectorAll('.children');  // .js-example__children

    this.events();
  }

  events() {
    this.$button.addEventListener('click', this.onButtonClick.bind(this));

    this.$children.forEach(item => item.addEventListener('click', this.onChildClick(item).bind(this)));
  }

  onButtonClick(e) {

  }

  onChildClick(item) {
    return e => {

    };
  }

  static init(el) {
    el && new ExampleWidget(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-example').forEach(item => ExampleWidget.init(item));
});
