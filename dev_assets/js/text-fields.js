class TextFields {
  static onFocus(parent) {
    parent.classList.add('active');
    if (!parent.classList.contains('filled')) {
      parent.classList.add('filled');
    }
  }

  static onBlur(field, parent) {
    if (field.value === '') {
      parent.classList.remove('filled');
    }
    parent.classList.remove('active');
  }

  static addEvents() {
    ['focus', 'blur'].forEach(item => {
      document.addEventListener(item, e => {
        const { type: eventType, target: field } = e;
        const { parentNode: parent } = field;

        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
          switch (eventType) {
            case 'focus':
              TextFields.onFocus(parent);
              break;
            case 'blur':
              TextFields.onBlur(field, parent);
              break;
          }
        }
      }, true);
    });
  }

  static init() {
    document.addEventListener('DOMContentLoaded', () => {
      const fields = document.querySelectorAll('input, textarea');

      fields.forEach(field => {
        const { parentNode: parent } = field;
        if (field.value !== '') {
          parent.classList.add('filled');
        }
      });

      TextFields.addEvents();
    });
  }
}

TextFields.init();
