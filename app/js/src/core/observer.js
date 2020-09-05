class Observer {
  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(_item => _item !== callback);
  }
}

window.Observer = Observer;
