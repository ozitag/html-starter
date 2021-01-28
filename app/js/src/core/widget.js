class Widget {
  constructor(node, selector, breakpoint = null) {
    this.$node = node;
    if (!this.$node) {
      return;
    }

    this.selector = selector ? (selector.substr(0, 1) === '.' ? selector.substr(1) : selector) : null;

    this.breakpoint = breakpoint;
    this.breakpointStatus = null;

    this.inited = false;
  }

  init() {
    if (this.inited) {
      this.updateBreakpointCache();
      return;
    }

    if (this.breakpoint) {
      onResize(this.updateBreakpointCache.bind(this));
      this.updateBreakpointCache();
    } else {
      this.build();
    }

    this.inited = true;
  }

  checkBreakpoint() {
    switch (this.breakpoint) {
      case null:
        return true;
      case 'mobile':
        return isMobileLayout();
      case 'mobile up':
        return !isMobileLayout();
      case 'tablet':
        return isTabletLayout();
      case 'tablet up':
        return !isTabletLayout();
      case 'tablet-mobile':
        return isMobileLayout() || isTabletLayout();
      case 'smallTablet-mobile':
        return isMobileLayout() || (isTabletLayout() && !isBigTabletLayout());
      case 'laptop':
        return isLaptopLayout();
      case 'desktop':
        return isDesktopLayout();
      case 'no-desktop':
        return !isDesktopLayout();
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
   * @param required
   * @returns Node
   */
  queryElement(selector, required = true) {
    if (!this.$node) return null;

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

    if (!$node && required) {
      throw new Error(`Widget "${this.selector}" Error: Child element (selector "${selector}") not found`);
    }

    return $node;
  }

  /**
   * @param selector
   * @returns Node[]
   */
  queryElements(selector) {
    if (!this.$node) return null;

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
