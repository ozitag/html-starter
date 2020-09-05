class Widget {
  constructor(node, selector, breakpoint = null) {
    this.$node = node;

    this.selector = selector ? (selector.substr(0, 1) === '.' ? selector.substr(1) : selector) : null;

    this.breakpoint = breakpoint;
    this.breakpointStatus = null;
  }

  init() {
    if (this.breakpoint) {
      onResize(this.updateBreakpointCache.bind(this));
      this.updateBreakpointCache();
    } else{
      this.build();
    }
  }

  checkBreakpoint() {
    switch (this.breakpoint) {
      case null:
        return true;
      case 'mobile':
        return isMobileLayout();
      case 'tablet':
        return isTabletLayout();
      case 'tablet-mobile':
        return isMobileLayout() || isTabletLayout();
      case 'laptop':
        return isLaptopLayout();
      case 'desktop':
        return isDesktopLayout();
      case 'bigTablet-desktop':
        return isDesktopLayout() || isBigTabletLayout();
      default:
        return true;
    }
  }

  updateBreakpointCache() {
    const check = this.checkBreakpoint();

    if ((this.breakpointStatus === false || this.breakpointStatus === null) && check) {
      this.breakpointStatus = true;
      if (typeof this.build === 'function') {
        this.build();
      }
    } else if (this.breakpointStatus && !check) {
      this.breakpointStatus = false;
      if (typeof this.destroy === 'function') {
        this.destroy();
      }
    }
  }


  build() {

  }

  destroy() {

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
