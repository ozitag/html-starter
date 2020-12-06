class UiToolkitHeader {
    constructor(element, selector, options) {
        this.element = this.isElement(element);
        this.selector = this.isSelector(selector);
        this.config = {
            position: 3,
            ...options
        };

        this.events();
    }

    events() {
        window.addEventListener('DOMContentLoaded', this.updateScrollTopPosition.bind(this));
        window.addEventListener('scroll', this.updateScrollTopPosition.bind(this));
        this.initScrollEvents();
    }

    updateScrollTopPosition() {
        this.scrollTop = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) || 0;
    }

    initScrollEvents() {
        window.addEventListener('DOMContentLoaded', this.onScrollEvents.bind(this));
        window.addEventListener('scroll', this.onScrollEvents.bind(this));
    }

    onScrollEvents() {
        const SELECTOR_FIXED = `${this.selector}--fixed`;

        if (this.scrollTop > this.config.position) {
            this.element.classList.add(SELECTOR_FIXED);
        } else {
            this.element.classList.remove(SELECTOR_FIXED);
        }
    }

    isElement(element) {
        if (element && element instanceof HTMLElement) {
            return element;
        } else {
            throw new Error(`Widget "ui toolkit header": Missing required attribute: target element (DOM node) must be provided`);
        }
    }

    isSelector(selector) {
        return selector ? (selector.substr(0, 1) === '.' ? selector.substr(1) : selector) : null;
    }

    static init(element, selector) {
        element && new UiToolkitHeader(element, selector);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-ui-toolkit-header').forEach((element) => UiToolkitHeader.init(element, 'js-ui-toolkit-header'));
});