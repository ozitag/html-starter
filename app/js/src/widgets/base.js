class Widget {
  constructor(node, selector) {
    this.$node = node;

    this.selector = selector;
  }

  /**
   * @param selector
   * @returns Node
   */
  queryElement(selector) {
    let $node = null;

    if (selector) {
      if (selector[0] === '.') {
        $node = this.$node.querySelector('.' + this.selector + '__' + selector.substr(1));
        if (!$node) {
          $node = this.$node.querySelector(selector);
        }
      } else {
        $node = this.$node.querySelector(selector);
      }
    }

    if (!$node) {
      throw new Error(`Widget "${this.selector}" Error: Child element (selector "${selector}") not found`);
    }

    return $node;
  }

  /**
   * @param selector
   * @returns Node[]
   */
  queryElements(selector) {
    let $nodes = null;

    if (selector) {
      if (selector[0] === '.') {
        $nodes = this.$node.querySelectorAll('.' + this.selector + '__' + selector.substr(1));
        if (!$nodes) {
          $nodes = this.$node.querySelectorAll(selector);
        }
      } else {
        $nodes = this.$node.querySelectorAll(selector);
      }
    }

    return $nodes;
  }
}

window.Widget = Widget;
