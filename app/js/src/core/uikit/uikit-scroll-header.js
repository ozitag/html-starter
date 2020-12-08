class UikitScrollHeader {
    constructor(element, selector, options) {
        this.element = this.isElement(element);
        this.selector = this.isSelector(selector);
        this.config = { position: 3, ...options };

        this.events();
    }

    events() {
        document.addEventListener('DOMContentLoaded', this.updateScrollTopPosition.bind(this));
        onScroll(this.updateScrollTopPosition.bind(this));
        this.initScrollEvents();
    }

    updateScrollTopPosition() {
        this.scrollTop = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) || 0;
    }

    initScrollEvents() {
        document.addEventListener('DOMContentLoaded', this.onScrollEvents.bind(this));
        onScroll(this.onScrollEvents.bind(this));
    }

    onScrollEvents() {
        const SELECTOR_BOX_SHADOW = `${this.selector}_box-shadow`;

        if (this.scrollTop > this.config.position) {
            this.element.classList.add(SELECTOR_BOX_SHADOW);
        } else {
            this.element.classList.remove(SELECTOR_BOX_SHADOW);
        }
    }

    isElement(element) {
        if (element && element instanceof HTMLElement) {
            return element;
        } else {
            throw new Error(`Widget "uikit scroll header": Missing required attribute: target element (DOM node) must be provided`);
        }
    }

    isSelector(selector) {
        return selector ? (selector.substr(0, 1) === '.' ? selector.substr(1) : selector) : null;
    }

    static init(element, selector, options) {
        element && new UikitScrollHeader(element, selector, options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-uikit-header').forEach((element) => {
        UikitScrollHeader.init(element, 'uikit-header', {
            position: 0,
        });
    });
});