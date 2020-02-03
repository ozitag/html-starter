function dropdown ($elem, options) {
  const that = this;

  const hasScroll = $elem.attr('data-scroll');

  this.$elem = $elem;

  this.prefix = 'prefix' in options ? options.prefix : '';
  this.placeholder = 'placeholder' in options ? options.placeholder : $elem.data('placeholder');
  this.scroll = 'scroll' in options ? options.scroll : $elem.data('scroll');
  this.className = 'class' in options ? options.className : $elem.data('class');
  this.selectionMode = 'selection' in options ? options.selection : $elem.data('selection');

  this.$container = null;
  this.$header = null;
  this.$headerLabel = null;
  this.$dropdown = null;
  this.$dropdownInner = null;

  this.options = {};

  this.activeValue = null;
  this.activeLabel = null;

  let isDropdownOpened = false;

  this.buildHtml = function() {
    if (this.$container) {
      this.$container.remove();
    }

    this.$container = $(`<div>`).addClass('dropdown');
    this.$header = $(`<div>`).addClass('dropdown__header').text(that.prefix ? that.prefix + ' ' : '');
    this.$dropdown = $(`<div>`).addClass('dropdown__box');
    this.$dropdownInner = $(`<div>`).addClass('dropdown__content').appendTo(this.$dropdown);

    this.$headerLabel = $('<span class="dropdown__label">').appendTo(this.$header);
    this.$headerArrow = $(`<span class="dropdown__arrow">`).appendTo(this.$header);
    this.$dropdownScroll = $(`<div class="dropdown__scroll"></div>`).appendTo(this.$dropdownInner);
    this.$dropdownList = $(`<div class="dropdown__list"></div>`).appendTo(this.$dropdownScroll);

    if (this.$elem.find('optgroup').length !== 0) {
      this.$elem.find('optgroup').each(function() {
        const label = $(this).attr('label');
        that.$dropdownList.append(`<div class="group-label">${label}</div>`);

        $(this).find('option').each(function() {
          const option = this;
          that.options[$(option).val()] = $(option).text();
          that.$dropdownList.append(
            `<a class="dropdown__item" data-value="${$(option).val()}">
               <span class="dropdown__item-text">${$(option).text()}</span>
             </a>`,
          );
        });
      });
    } else {
      this.$elem.find('option').each(function() {
        const option = this;
        that.options[$(option).val()] = $(option).text();
        that.$dropdownList.append(
          `<a class="dropdown__item" data-value="${$(option).val()}">
             <span class="dropdown__item-text">${$(option).text()}</span>
           </a>`,
        );
      });
    }

    this.$container.append(this.$header);
    this.$container.append(this.$dropdown);
    this.$elem.addClass('visually-hidden');
    this.$container.insertAfter(this.$elem);
  };

  this.setActiveValue = function(value) {
    this.$header.removeClass(`dropdown__header--placeholder`);

    this.activeLabel = this.activeValue = this.options[value];
    this.$headerLabel.text(this.activeLabel);

    this.$elem[0].value = value;
    this.$elem[0].dispatchEvent(createEvent('change'));
  };

  this.setActiveItem = function(value) {
    const target = this.$dropdown.find(`a[data-value="${value}"]`);

    switch (this.selectionMode) {
      case 'highlight':
        this.$dropdown.find(`a.highlight`).removeClass('highlight');
        $(target).addClass('highlight');
        break;
      case 'hide':
      default:
        this.$dropdown.find(`a.hide`).removeClass('hide');
        $(target).addClass('hide');
        break;
    }
  };

  this.showDropdown = function() {
    this.$container.addClass('opened');
    isDropdownOpened = true;

    if (hasScroll) this.$dropdown.addClass(this.scroll);
    that.pageScrollControl('hide');
  };

  this.hideDropdown = function() {
    this.$container.removeClass('opened');
    isDropdownOpened = false;

    that.pageScrollControl('show');
  };

  this.pageScrollControl = function(action) {
    if (isTabletLayout())
      switch (action) {
        case 'show':
          showScrollbar();
          break;
        case 'hide':
          hideScrollbar();
          break;
      }
  };

  this.bindEvents = function() {
    $(document).on('click', function(e) {
      const $target = $(e.target);
      if ($target.closest('.dropdown__list').length) return;

      const $trigger = $target.closest('.dropdown')[0];
      if (isDropdownOpened) {
        that.hideDropdown();
      } else if (that.$container[0] === $trigger) {
        that.showDropdown();
      }
    });

    this.$dropdown.find('a').on('click', function() {
      const value = $(this).data('value');
      if (!that.options[value]) return;
      that.setActiveValue(value);
      that.setActiveItem(value);
      that.hideDropdown();

      return false;
    });

    this.$elem.on('change', function({originalEvent: e}) {
      if (e.target === e.currentTarget && !e.isTrusted) return;

      const value = $(this).val();
      if (!that.options[value]) return;
      that.setActiveValue(value);
      that.setActiveItem(value);
    });
  };

  this.buildHtml();
  this.bindEvents();

  if (this.placeholder && !$elem.find('option:selected').attr('selected')) {
    this.activeLabel = this.placeholder;
    this.$headerLabel.text(this.activeLabel);
    this.$header.addClass('dropdown__header--placeholder');
  } else {
    const value = this.$elem.val() ?
      this.$elem.val() : this.$elem.find('option').first().val();
    this.setActiveValue(value);
    this.setActiveItem(value);
  }

  if ($elem.attr('data-class')) {
    this.$container.addClass(this.className);
  }

  this.update = function() {
    that.buildHtml();
    that.bindEvents();

    if (that.placeholder) {
      that.activeLabel = that.placeholder;
      that.$headerLabel.text(that.activeLabel);
      that.$header.addClass(`dropdown__header--placeholder`);
    } else {
      const value = that.$elem.val() ?
        that.$elem.val() : that.$elem.find('option').first().val();
      that.setActiveValue(value);
      that.setActiveItem(value);
    }
  };

  return this;
}

const dropdowns = [];
$.fn.dropdown = function(options) {
  if (typeof options === 'string') {
    const dropdownId = $(this).data('dropdown-guid');
    if (dropdownId in dropdowns) {
      const dropdown = dropdowns[dropdownId];
      dropdown[options]();
    }
    return;
  }

  $(this).each(function() {
    const dropdownId =
      Math.floor((1 + Math.random()) * 0x10000).toString(16) +
      Math.floor((1 + Math.random()) * 0x10000).toString(16) +
      Math.floor((1 + Math.random()) * 0x10000).toString(16);
    dropdowns[dropdownId] = new dropdown($(this), options);
    $(this).data('dropdown-guid', dropdownId);
  });
};

$('.js-dropdown-box').each(function() {
  $(this).dropdown({
    prefix: $(this).data('prefix'),
  });
});
