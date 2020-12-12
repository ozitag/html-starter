const widgetInstances = new Map();

class Tabs {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;
    this.activeTab = null;
    this.tabs = [];

    this.initTabs();

    if (this.tabs.length > 0) {
      this.build();
    }
  }

  initTabs() {
    this.findTabs().forEach(tabItem => {
      const targetSelector = tabItem.dataset.target;
      if (!targetSelector) {
        console.error(`Tab "${tabItem.innerText}" does not have data-target attribute`);
        return;
      }

      const tabContent = this.nodeElement.querySelector(targetSelector);
      if (!tabContent) {
        console.error(`Tab content with selector "${targetSelector}" not found`);
      }

      const isActive = this.activeTab === null && tabItem.classList.contains('active');

      const tabModel = {
        isActive: isActive,
        tabElement: tabItem,
        tabContentElement: tabContent,
      };

      if (isActive) {
        this.activeTab = tabModel;
      }

      this.tabs.push(tabModel);
    });
  }

  findTabs() {
    const result = [];

    this.nodeElement.querySelectorAll('.js-tab').forEach(item => {
      if (item.closest('.js-tabs') === this.nodeElement) {
        result.push(item);
      }
    });

    return result;
  }

  hideTab(model) {
    model.tabElement.classList.remove('active');

    if (model.tabContentElement) {
      model.tabContentElement.classList.remove('active');
    }

    model.isActive = false;
  }

  showTab(model) {
    model.tabElement.classList.add('active');

    if (model.tabContentElement) {
      model.tabContentElement.classList.add('active');
    }

    model.isActive = true;
  }

  setActiveTab(model) {
    if (!model.isActive) {
      this.tabs.forEach(this.hideTab);
    }

    this.showTab(model);
  }

  setActiveIndex(index) {
    if (index < this.tabs.length) {
      this.setActiveTab(this.tabs[index]);
    }
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

  build() {
    this.setDefaults();

    this.tabs.forEach(tabModel => {
      tabModel.tabElement.addEventListener('click', e => this.onTabClick(e, tabModel));
    });
  }

  static destroy(elem) {
    widgetInstances.get(elem).destroy();
  }

  static init(elem = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new Tabs(elem));
    }

    widgetInstances.get(elem).build();

    return widgetInstances.get(elem);
  }
}

class TabsUI {
  static init() {
    document.querySelectorAll('.js-tabs').forEach(Tabs.init);
  }

  static setActiveTab($container, activeTabIndex) {
    const tabsInstance = widgetInstances.get($container);
    if (tabsInstance) {
      tabsInstance.setActiveIndex(activeTabIndex);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TabsUI.init();
});
window.TabsUI = TabsUI;
