const locale = {
  searchPlaceholder: 'Search...',
  notFoundMessage: 'Not Found',
};

class Select extends Widget {
  constructor(node) {
    super(node, 'js-select');

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.$container = this.$node.parentNode;

    this.withSearch = !!this.$node.dataset.search;
    this.placeholder = this.$node.dataset.placeholder;

    this.init();
  }

  onChange(e) {
    if (e.target.value) {
      this.setAsSelected();
    } else {
      this.setAsNotSelected();
    }
  }

  onFocus() {
    this.$container.classList.add('focus');
  }

  onBlur() {
    this.$container.classList.remove('focus');
  }

  enableMobileMode() {
    this.$node.addEventListener('change', this.onChange);
    this.$node.addEventListener('focus', this.onFocus);
    this.$node.addEventListener('blur', this.onBlur);

    const optionSelected = this.$node.querySelector('option[selected]');
    const hasInitialValue = !this.placeholder || (optionSelected && optionSelected.innerText.length > 0);

    this.$node.classList.remove('visually-hidden');
    this.$container.classList.add('mobile');

    if (this.placeholder && hasInitialValue === false) {
      const $mobilePlaceholder = document.createElement('span');
      $mobilePlaceholder.classList.add('select-placeholder');
      $mobilePlaceholder.innerText = this.placeholder;
      this.$container.append($mobilePlaceholder);
    }

    if (hasInitialValue) {
      this.setAsSelected();
    } else {
      this.setAsNotSelected();
    }
  }

  initSelect2(placeholder) {
    $(this.$node).select2({
      minimumResultsForSearch: -1,
      placeholder: placeholder,
      language: {
        noResults: () => locale.notFoundMessage,
      },
    }).on('select2:open', () => {
      const $selectDropdown = document.querySelector('.select2-dropdown');
      const $selectOptions = document.querySelector('.select2-results__options');

      if (this.withSearch) {
        $selectDropdown.classList.add('select2-with-search');
      }

      const width = parseInt($selectDropdown.style.width);
      $selectDropdown.style.minWidth = width + 'px';

      new PerfectScrollbar($selectOptions, {
        minScrollbarLength: 20,
      });

      $(this.$node).data('select2').$dropdown.find(':input.select2-search__field').attr('placeholder', locale.searchPlaceholder);
    }).on('change', this.onChange);
  }

  enableDesktopMode() {
    const optionSelected = this.$node.querySelector('option[selected]');
    const options = this.$node.querySelectorAll('option');
    const hasInitialValue = (optionSelected && optionSelected.innerText.length > 0) ||
      (!this.placeholder && options.length > 0 && options[0].innerText.length > 0);

    if (this.placeholder && hasInitialValue === false) {
      $(this.$node).prepend('<option selected></option>');
    }

    this.initSelect2(hasInitialValue ? this.placeholder : null);

    if (hasInitialValue) {
      this.setAsSelected();
    } else {
      this.setAsNotSelected();
    }
  }

  build() {
    if (isMobileOrTablet() && this.withSearch === false) {
      this.enableMobileMode();
    } else {
      this.enableDesktopMode();
    }
  }

  setAsSelected() {
    this.$node.parentNode.classList.add('selected');
  }

  setAsNotSelected() {
    this.$node.parentNode.classList.remove('selected');
  }

  static init(el) {
    new Select(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-select').forEach(item => Select.init(item));
});
