class MobileDebug {
  static log(message) {

    if (isLocalhost() === false) {
      return;
    }

    let node = document.querySelector('.mobile-debug');
    if (!node) {
      node = document.createElement('div');
      node.classList.add('mobile-debug');
      document.body.append(node);
    }

    const messageNode = document.createElement('p');
    messageNode.innerHTML = message;
    node.prepend(messageNode);
  }
}

window.MobileDebug = MobileDebug;
