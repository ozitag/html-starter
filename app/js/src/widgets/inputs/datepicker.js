/*
const locale = {
  days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вск'],
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  format: 'DD.MM.YYYY'
};
*/

const locale = {
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  format: 'dd/MM/yyyy',
};

class Datepicker extends Widget {
  constructor(node) {
    super(node, '.js-datepicker');

    this.update = this.update.bind(this);

    this.movedToBody = false;

    this.init();
  }

  build() {
    const valueParts = this.$node.value ? this.$node.value.split('.') : null;

    datepicker(this.$node, {
      disableMobile: false,
      customDays: locale.days,
      customMonths: locale.months,
      disableYearOverlay: true,
      position: this.$node.getBoundingClientRect().x > 200 ? 'br' : 'bl',
      dateSelected: valueParts ? new Date(valueParts[2], valueParts[1] - 1, valueParts[0]) : null,
      formatter: (input, date) => {
        input.value = dateHelper.format(date, locale.format);
      },
      onSelect: (instance, date) => {
        if (typeof window.triggerInputChange !== 'undefined') {
          triggerInputChange(this.$node);
        }

        instance.el.value = dateHelper.format(date, locale.format);
      },
      onShow: instance => {
        const instanceRect = instance.el.getBoundingClientRect();
        const top = instanceRect.top + getScrollPos() + this.$node.offsetHeight;
        const left = instanceRect.x < 200 ? instanceRect.left : instanceRect.left + instanceRect.width - 250;
        instance.calendarContainer.style.top = top + 'px';
        instance.calendarContainer.style.left = left + 'px';

        if (!this.movedToBody) {
          document.body.appendChild(instance.calendarContainer);
          this.movedToBody = true;
        }
      },
    });

    this.$node.addEventListener('keydown', e => {
      e.preventDefault();

      if (e.keyCode === 8) {
        this.$node.value = '';
      }
    });

    this.$node.addEventListener('change', e => {
      const value = e.target.value;

      if (value) {
        this.$node.classList.add('filled');
      } else {
        this.$node.classList.remove('filled');
      }

      this.$node.setAttribute('data-value', value.split('-').reverse().join('.'));
    });

    Layout.addListener(this.update);
    this.update();
  }

  update() {
    this.$node.setAttribute('type', Layout.isDesktopLayout() ? 'text' : 'date');
  }

  static init(el) {
    new Datepicker(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-datepicker').forEach(item => Datepicker.init(item));
});
