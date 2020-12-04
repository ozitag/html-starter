const CLASS_NAME_DRAWER = 'js-drawer';
const CLASS_NAME_DRAWER_EMBED_CONTAINER = 'js-drawer-embed-container';
const CLASS_NAME_DRAWER_CONTAINER = 'js-drawer-container';
const CLASS_NAME_DRAWER_NAV = 'js-drawer-nav';
const CLASS_NAME_DRAWER_NAV_ITEM = 'js-drawer-nav-item';
const CLASS_NAME_DRAWER_CONTENT = 'js-drawer-content';
const CLASS_NAME_DRAWER_CONTENT_ITEM = 'js-drawer-content-item';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_OPEN = 'open';
const CLASS_NAME_CLOSED = 'closed';

const SELECTOR_DRAWER = `.${CLASS_NAME_DRAWER}`;
const SELECTOR_DRAWER_EMBED_CONTAINER = `.${CLASS_NAME_DRAWER_EMBED_CONTAINER}`;
const SELECTOR_DRAWER_CONTAINER = `.${CLASS_NAME_DRAWER_CONTAINER}`;
const SELECTOR_DRAWER_NAV = `.${CLASS_NAME_DRAWER_NAV}`;
const SELECTOR_DRAWER_NAV_ITEM = `.${CLASS_NAME_DRAWER_NAV_ITEM}`;
const SELECTOR_DRAWER_CONTENT = `.${CLASS_NAME_DRAWER_CONTENT}`;
const SELECTOR_DRAWER_CONTENT_ITEM = `.${CLASS_NAME_DRAWER_CONTENT_ITEM}`;

const defaults = {
    position: 'left',
    height: '100%',
    width: '250px',
    startOpen: true,
    closeable: true,
    minClosedSize: 0,
    toggleButton: '',
    embed: false,
    navigationItemWidth: '50px',
    navigationItemHeight: '50px',
    autoclose: false,
    autocloseDelay: 5000,
    clickOutsideToClose: true,
    animations: {
        replace: 'crossfade 0.5s ease-in-out',
        toggle: 'slide 0.5s ease',
    }
};

class Drawer {
    constructor(target, options) {
        this.config = {...defaults, ...options};

        if (!target) {
            throw new Error('Missing required attribute: target element (css selector or DOM node) must be provided');
        } else if (this.__isString(target)) {
            this.targetElement = document.querySelector(target);
        } else if (this.__isDOMElement(target)) {
            this.targetElement = target;
        } else {
            throw new Error('Incorrect type: target element must be DOM node or string css selector');
        }
        this.targetElement.classList.add(CLASS_NAME_DRAWER);
        if (this.config.embed) {
            this.targetElement.parentElement.classList.add(CLASS_NAME_DRAWER_EMBED_CONTAINER);
        }
        this.containerElement = this.targetElement.querySelector(SELECTOR_DRAWER_CONTAINER);
        this.contentElement = this.targetElement.querySelector(SELECTOR_DRAWER_CONTENT);
        this.navElement = this.targetElement.querySelector(SELECTOR_DRAWER_NAV);
        this.__applyConfig(this.config);
        this.__attachEventListeners();
    }

    setPosition(position) {
        this.targetElement.classList.add(`${CLASS_NAME_DRAWER}-${position}`);
    }

    setHeight(height) {
        this.targetElement.style.height = height;
        if (this.config.position === 'top' || this.config.position === 'bottom') {
            this.containerElement.style.height = `calc(100% - ${this.navElement.clientHeight}px)`;
        }
    }

    setWidth(width) {
        this.targetElement.style.width = width;
        if (this.config.position === 'left' || this.config.position === 'right') {
            this.containerElement.style.width = `calc(100% - ${this.navElement.clientWidth}px)`;
        }
    }

    setNavigationSize(width, height) {
        if (this.config.position === 'left' || this.config.position === 'right') {
            this.navElement.style.width = width;
        }
        if (this.config.position === 'top' || this.config.position === 'bottom') {
            this.navElement.style.height = height;
        }
        const navItems = this.navElement.querySelectorAll(SELECTOR_DRAWER_NAV_ITEM);
        let l = navItems.length;

        while (l--) {
            navItems[l].style.width = width;
            navItems[l].style.height = height;
        }
    }

    setAutoClose(delay) {
        if (this.autocloseTimeout) {
            clearTimeout(this.autocloseTimeout);
        }
        this.autocloseTimeout = setTimeout(this.close.bind(this), delay);
    }

    setActiveById(panel) {
        let id;
        const previousActivePanel = this.targetElement.querySelector(`${SELECTOR_DRAWER_CONTENT_ITEM}.${CLASS_NAME_ACTIVE}`);

        if (this.__isDOMElement(panel)) {
            id = panel.id;
        } else if (this.__isString(panel)) {
            id = panel;
        } else {
            return;
        }

        if (previousActivePanel && id === previousActivePanel.id) {
            return;
        }

        this.fire('beforeToggle', [previousActivePanel, currentActivePanel]);
        const activeNavButton = this.targetElement.querySelector(`${SELECTOR_DRAWER_NAV_ITEM}[data-drawer-target="${id}"]`);
        const currentActivePanel = id ? this.targetElement.querySelector(`#${id}`) : null;

        this.__deactivateAll();
        currentActivePanel && currentActivePanel.classList.add(CLASS_NAME_ACTIVE);
        activeNavButton && activeNavButton.classList.add(CLASS_NAME_ACTIVE);
        this.fire('afterToggle', [previousActivePanel, currentActivePanel]);
    }

    setActiveByIndex(index) {
        const allPanels = this.contentElement && this.contentElement.children;
        this.setActiveById(allPanels[index] && allPanels[index].id);
    }

    open() {
        this.fire('beforeOpen', [this.targetElement]);
        if (this.toggleButtonElement) {
            this.toggleButtonElement.classList.add(CLASS_NAME_OPEN);
        }
        this.targetElement.classList.remove(CLASS_NAME_CLOSED);
        this.targetElement.classList.add(CLASS_NAME_OPEN);
        this.containerElement.style.left = '';
        this.__updateEmbeding();
        this.fire('afterOpen', [this.targetElement]);
    }

    close() {
        this.fire('beforeClose', [this.targetElement]);
        if (this.toggleButtonElement) {
            this.toggleButtonElement.classList.remove(CLASS_NAME_OPEN);
        }
        this.targetElement.classList.remove(CLASS_NAME_OPEN);
        this.targetElement.classList.add(CLASS_NAME_CLOSED);
        this.containerElement.style.left = `${this.config.minClosedSize}px`;
        this.__updateEmbeding();
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

    __applyConfig(config) {
        this.setPosition(config.position);
        config.startOpen ? this.open() : this.close();
        this.setNavigationSize(
            config.navigationItemWidth,
            config.navigationItemHeight
        );

        this.setWidth(config.width);
        this.setHeight(config.height);
        this.__updateEmbeding();
        if (config.autoclose) {
            this.setAutoClose();
        }
        this.__setAnimations(config.animations);
        this.setActiveById(this.config.activePanel || this.__getContentPanel(0));
    }

    __attachEventListeners() {
        const navButtons = this.navElement.children;
        let l = navButtons.length;

        while (l--) {
            navButtons[l].onclick = this.onNavButtonClick.bind(this);
        }

        if (this.autocloseTimeout) {
            this.containerElement.addEventListener('mouseover', this.onMouseOver.bind(this));
            this.containerElement.addEventListener('mouseout', this.onMouseOut.bind(this));
        }
        if (this.config.clickOutsideToClose) {
            document.addEventListener('click', this.onDocumentClick.bind(this), false);
        }
        if (this.config.toggleButton) {
            this.toggleButtonElement = document.querySelector(this.config.toggleButton);
            if (this.toggleButtonElement) {
                this.toggleButtonElement.addEventListener('click', this.onToggleButtonClick.bind(this));
            }
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

    __setAnimations(animations) {
        if (!animations || !Object.keys(animations).length) {
            return;
        }

        if (animations.replace) {
            const animation = this.__getAnimationFromString(animations.replace);
            const allContentPanels = this.contentElement.children;
            let l = allContentPanels.length;
            while (l--) {
                this.__setVendorStyleProperty(
                    allContentPanels[l],
                    'transition',
                    this.__getTransitionFromAnimation(animation)
                );
                allContentPanels[l].classList.add(animation.type);
            }
        }
        if (animations.toggle) {
            const animation = this.__getAnimationFromString(animations.toggle);
            this.__setVendorStyleProperty(
                this.targetElement,
                'transition',
                this.__getTransitionFromAnimation(animation)
            );
        }
    }

    onNavButtonClick(event) {
        if (!this.isOpen()) {
            this.open();
        } else if (this.isActive(event.currentTarget) && this.config.closeable) {
            this.close();
        }

        this.setActiveById(event.currentTarget.getAttribute('data-drawer-target'));
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

    __deactivateAll() {
        const allPanels = this.contentElement && this.contentElement.children;
        const allNavButtons = this.navElement && this.navElement.children;
        let l = allPanels.length;
        let ll = allNavButtons.length;
        while (l--) {
            allPanels[l].classList.remove(CLASS_NAME_ACTIVE);
        }
        while (ll--) {
            allNavButtons[ll].classList.remove(CLASS_NAME_ACTIVE);
        }
    }

    __getContentPanel(index) {
        return this.contentElement && this.contentElement.children && this.contentElement.children[index];
    }

    __isDOMElement(target) {
        return target && (target.nodeType === document.ELEMENT_NODE || target.nodeType === document.DOCUMENT_FRAGMENT_NODE);
    }

    __isString(target) {
        return typeof target === 'string';
    }

    __getAnimationFromString(input) {
        const animationOptions = input.split(' ');
        return {
            type: animationOptions[0],
            speed: animationOptions[1],
            easing: animationOptions[2]
        };
    }

    __getTransitionFromAnimation(animation) {
        let transitionString = '';
        if (animation.type === 'slide') {
            transitionString += 'transform ' + animation.speed + ' ' + animation.easing;
        } else if (animation.type === 'crossfade') {
            transitionString += 'opacity ' + animation.speed + ' ' + animation.easing;
        } else if (animation.type === 'slidefade') {
            transitionString += 'opacity ' + animation.speed + ' ' + animation.easing + ', ';
            transitionString += 'transform ' + animation.speed + ' ' + animation.easing;
        }
        return transitionString;
    }

    __setVendorStyleProperty(target, propertyName, value) {
        const capitalizedPropertyName = this.__capitalizeFirstLetter(propertyName);
        target.style['webkit' + capitalizedPropertyName] = value;
        target.style['Moz' + capitalizedPropertyName] = value;
        target.style['ms' + capitalizedPropertyName] = value;
        target.style['O' + capitalizedPropertyName] = value;
        target.style[propertyName] = value;
    }

    __capitalizeFirstLetter(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    static init(element, options) {
        element && new Drawer(element, options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const options = {
        toggleButton: '.js-drawer-toggle',
        startOpen: true,
        embed: true,
        clickOutsideToClose: false,
    };

    document.querySelectorAll('.js-drawer').forEach((element) => Drawer.init(element, options));
});
