const CLASS_NAME_DRAWER = 'js-drawer';
const CLASS_NAME_DRAWER_EMBED_CONTAINER = 'js-drawer-embed-container';
const CLASS_NAME_DRAWER_CONTAINER = 'js-drawer-container';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_OPEN = 'open';
const CLASS_NAME_CLOSED = 'closed';
const CLASS_NAME_NO_SCROLL = `${CLASS_NAME_DRAWER}-no-scroll`;

const SELECTOR_DRAWER_CONTAINER = `.${CLASS_NAME_DRAWER_CONTAINER}`;

const defaults = {
    position: 'left',
    height: '100%',
    width: '250px',
    startOpen: true,
    closeable: true,
    minClosedSize: 0,
    toggleButton: '',
    embed: false,
    navigationItemWidth: '0px',
    navigationItemHeight: '0px',
    autoclose: false,
    autocloseDelay: 5000,
    clickOutsideToClose: true,
    nameOfStore: 'target-drawer',
};

class Drawer {
    constructor(element, options) {
        this.config = { ...defaults, ...options };

        if (!element) {
            throw new Error('Missing required attribute: target element (css selector or DOM node) must be provided');
        } else if (this.__isString(element)) {
            this.targetElement = document.querySelector(element);
        } else if (this.__isDOMElement(element)) {
            this.targetElement = element;
        } else {
            throw new Error('Incorrect type: target element must be DOM node or string css selector');
        }
        this.targetElement.classList.add(CLASS_NAME_DRAWER);
        if (this.config.embed) {
            this.targetElement.parentElement.classList.add(CLASS_NAME_DRAWER_EMBED_CONTAINER);
        }
        this.containerElement = this.targetElement.querySelector(SELECTOR_DRAWER_CONTAINER);
        this.toggleButtonElement = document.querySelector(this.config.toggleButton);
        this.__applyConfig(this.config);
        this.__attachEventListeners();
    }

    setPosition(position) {
        this.targetElement.classList.add(`${CLASS_NAME_DRAWER}-${position}`);
    }

    setHeight(height) {
        this.targetElement.style.height = height;
    }

    setWidth(width) {
        this.targetElement.style.width = width;
    }

    setAutoClose(delay) {
        if (this.autocloseTimeout) {
            clearTimeout(this.autocloseTimeout);
        }
        this.autocloseTimeout = setTimeout(this.close.bind(this), delay);
    }

    open() {
        this.fire('beforeOpen', [this.targetElement]);
        document.body.classList.add(CLASS_NAME_NO_SCROLL);
        if (this.toggleButtonElement) {
            this.toggleButtonElement.classList.add(CLASS_NAME_OPEN);
        }
        this.targetElement.classList.remove(CLASS_NAME_CLOSED);
        this.targetElement.classList.add(CLASS_NAME_OPEN);
        this.__updateEmbeding();
        if (window.localStorage) {
            window.localStorage.setItem(this.config.nameOfStore, JSON.stringify(true));
        }
        this.fire('afterOpen', [this.targetElement]);
    }

    close() {
        this.fire('beforeClose', [this.targetElement]);
        document.body.classList.remove(CLASS_NAME_NO_SCROLL);
        if (this.toggleButtonElement) {
            this.toggleButtonElement.classList.remove(CLASS_NAME_OPEN);
        }
        this.targetElement.classList.remove(CLASS_NAME_OPEN);
        this.targetElement.classList.add(CLASS_NAME_CLOSED);
        this.__updateEmbeding();
        if (window.localStorage) {
            window.localStorage.setItem(this.config.nameOfStore, JSON.stringify(false));
        }
        this.fire('afterClose', [this.targetElement]);
    }

    isOpen() {
        return this.targetElement.classList.contains(CLASS_NAME_OPEN);
    }

    isActive(target) {
        if (this.__isString(target)) {
            target = document.getElementById(target);
        } else if (this.__isDOMElement(target)) {
        } else {
            return false;
        }

        return target.classList.contains(CLASS_NAME_ACTIVE);
    }

    __isStart(value) {
        if (this.__isBoolean(value)) {
            this.config.startOpen ? this.open() : this.close();
        } else if (this.__isString(value) && value === 'save' && window.localStorage && window.localStorage.getItem(this.config.nameOfStore) !== null) {
            if (JSON.parse(window.localStorage.getItem(this.config.nameOfStore)) === true) {
                this.open();
            } else {
                this.close();
            }
        } else {
            this.close();
        }
    }

    __applyConfig(config) {
        this.setPosition(config.position);
        this.__isStart(config.startOpen);
        this.setWidth(config.width);
        this.setHeight(config.height);
        this.__updateEmbeding();
        if (config.autoclose) {
            this.setAutoClose();
        }
    }

    __attachEventListeners() {
        if (this.autocloseTimeout) {
            this.containerElement.addEventListener('mouseover', this.onMouseOver.bind(this));
            this.containerElement.addEventListener('mouseout', this.onMouseOut.bind(this));
        }
        if (this.config.clickOutsideToClose) {
            document.addEventListener('click', this.onDocumentClick.bind(this), false);
        }
        if (this.config.toggleButton && this.toggleButtonElement) {
            this.toggleButtonElement.addEventListener('click', this.onToggleButtonClick.bind(this));
        }
    }

    __updateEmbeding() {
        if (!this.config.embed) return;

        if (this.config.position === 'left') {
            this.targetElement.parentElement.style.marginLeft = this.isOpen()
                ? `calc(${this.config.width} - ${this.config.navigationItemWidth})`
                : `${this.config.minClosedSize}px`;
        } else if (this.config.position === 'right') {
            this.targetElement.parentElement.style.marginRight = this.isOpen()
                ? `calc(${this.config.width} - ${this.config.navigationItemWidth})`
                : `${this.config.minClosedSize}px`;
            this.targetElement.parentElement.style.marginLeft = this.isOpen()
                ? `calc(-${this.config.width} + ${this.config.navigationItemWidth})`
                : `${this.config.minClosedSize}px`;
        } else if (this.config.position === 'top') {
            this.targetElement.parentElement.style.marginTop = this.isOpen()
                ? `calc(${this.config.height} - ${this.config.navigationItemHeight})`
                : `${this.config.minClosedSize}px`;
        } else if (this.config.position === 'bottom') {
            this.targetElement.parentElement.style.marginBottom = this.isOpen()
                ? `calc(${this.config.height} - ${this.config.navigationItemHeight})`
                : `${this.config.minClosedSize}px`;
        }
    }

    onMouseOver() {
        clearTimeout(this.autocloseTimeout);
    }

    onMouseOut() {
        this.setAutoClose(this.config.autocloseDelay);
    }

    onDocumentClick(event) {
        if (
            !this.targetElement.contains(event.target) &&
            !(
                this.toggleButtonElement &&
                this.toggleButtonElement.contains(event.target)
            )
        ) {
            this.close();
        }
    }

    onToggleButtonClick() {
        if (!this.isOpen()) {
            this.open();
        } else {
            this.close();
        }
    }

    fire(eventName, args) {
        if (!this.config.listeners || !this.config.listeners[eventName]) {
            return;
        }
        this.config.listeners[eventName].apply(this, args);
    }

    __isDOMElement(target) {
        return target && (target.nodeType === document.ELEMENT_NODE || target.nodeType === document.DOCUMENT_FRAGMENT_NODE);
    }

    __isString(value) {
        return typeof value === 'string';
    }

    __isBoolean(value) {
        return value === true || value === false || typeof value === 'boolean';
    }

    static init(element, options) {
        element && new Drawer(element, options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const options = {
        toggleButton: '.js-drawer-toggle',
        startOpen: 'save',
        embed: true,
        clickOutsideToClose: false,
    };

    document.querySelectorAll('.js-drawer').forEach((element) => Drawer.init(element, options));
});
