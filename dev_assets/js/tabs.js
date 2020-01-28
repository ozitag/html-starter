class Tabs {
    constructor(nodeElement) {
        this.nodeElement = nodeElement;

        this.activeTab = null;

        this.tabs = [];
        nodeElement.querySelectorAll('.js-tab').forEach(tabItem => {
            const targetSelector = tabItem.dataset.target;
            if (!targetSelector) {
                console.error(`Tab "${tabItem.innerText}" does not have data-target attribute`);
                return;
            }

            const tabContent = this.nodeElement.querySelector(targetSelector);
            if (!tabContent) {
                console.error(`Tab content with selector "${targetSelector}" not found`);
                return;
            }

            const isActive = this.activeTab === null && tabItem.classList.contains('active');

            const tabModel = {
                isActive: isActive,
                tabElement: tabItem,
                tabContentElement: tabContent
            };

            if (isActive) {
                this.activeTab = tabModel;
            }

            this.tabs.push(tabModel);
        });

        if (this.tabs.length === 0) {
            return;
        }

        this.init();
    }

    hideTab(model) {
        model.tabElement.classList.remove('active');
        model.tabContentElement.classList.remove('active');
        model.isActive = false;
    }

    showTab(model) {
        model.tabElement.classList.add('active');
        model.tabContentElement.classList.add('active');
        model.isActive = true;
    }

    setActiveTab(model) {
        if (!model.isActive) {
            this.tabs.forEach(this.hideTab);
        }

        this.showTab(model);
    }

    onTabClick(e, model) {
        e.preventDefault();

        this.setActiveTab(model);
    }

    setDefaults() {
        if (!this.activeTab) {
            this.setActiveTab(this.tabs[0]);
        } else {
            this.setActiveTab(this.activeTab);
        }
    }

    init() {
        this.setDefaults();

        this.tabs.forEach(tabModel => {
            tabModel.tabElement.addEventListener('click', e => this.onTabClick(e, tabModel));
        });
    }
}

class TabsUI {
    static init() {
        document.querySelectorAll('.js-tabs').forEach(element => new Tabs(element));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    TabsUI.init();
});
window.TabsUI = TabsUI;