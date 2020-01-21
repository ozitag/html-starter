function Dropdown ($elem, options) {
  const that = this;

  const hasScroll = $elem.attr('data-scroll');

  this.$elem = $elem;

  this.prefix = 'prefix' in options ? options.prefix : '';
  this.placeholder = 'placeholder' in options ? options.placeholder : $elem.data('placeholder');
  this.scroll = 'scroll' in options ? options.scroll : $elem.data('scroll');
  this.className = 'class' in options ? options.className : $elem.data('class');
  this.selectionMod = 'selection' in options ? options.selection : $elem.data('selection');

  this.$container = null;
  this.$header = null;
  this.$headerLabel = null;
  this.$dropDown = null;
  this.$dropDownInner = null;

  this.options = {};

  this.activeValue = null;
  this.activeLabel = null;

  let dropdownOpened = false;

  this.$elem.on('change', function() {
    that.setActiveValue($(this).val(), false);
  });

  this.buildHtml = function() {
    if (this.$container) {
      this.$container.remove();
    }

    this.$container = $(`<div>`).addClass('dropdown');
    this.$header = $(`<div>`).addClass('dropdown__header').text(that.prefix ? that.prefix + ' ' : '');
    this.$headerLabel = $(`<span class="dropdown__text">`).appendTo(this.$header);
    this.$arrow = $(`<span class="dropdown__arrow">`).appendTo(this.$header);

    this.$dropDown = $(`<div>`).addClass('dropdown__box');
    this.$dropDownScroll = $(`<div class="dropdown__scroll"></div>`).
      appendTo(this.$dropDown);
    this.$dropDownInner = $(`<div class="dropdown__list"></div>`).
      appendTo(this.$dropDownScroll);

    if (this.$elem.find('optgroup').length !== 0) {
      this.$elem.find('optgroup').each(function() {
        const label = $(this).attr('label');
        that.$dropDownInner.append(`<div class="group-label">${label}</div>`);

        $(this).find('option').each(function() {
          const option = this;
          that.options[$(option).val()] = $(option).text();
          that.$dropDownInner.append(
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
        that.$dropDownInner.append(
          `<a class="dropdown__item" data-value="${$(option).val()}">
             <span class="dropdown__item-text">${$(option).text()}</span>
           </a>`,
        );
      });
    }

    this.$container.append(this.$header);
    this.$container.append(this.$dropDown);

    this.$elem.hide();

    this.$container.insertAfter(this.$elem);
  };

  this.setActiveValue = function(value) {
    this.$header.removeClass(`dropdown__header--placeholder`);

    this.activeLabel = this.activeValue = this.options[value];
    this.$headerLabel.text(this.activeLabel);

    this.$elem.find(`option[selected]`).removeAttr('selected');
    this.$elem.find(`option[value="${value}"]`).attr('selected', 'selected');
  };

  this.setActiveItem = function(value) {
    const target = this.$dropDown.find(`a[data-value="${value}"]`);

    switch (this.selectionMod) {
      case 'highlight':
        this.$dropDown.find(`a.highlight`).removeClass('highlight');
        $(target).addClass('highlight');
        break;
      case 'hide':
      default:
        this.$dropDown.find(`a.hide`).removeClass('hide');
        $(target).addClass('hide');
        break;
    }
  };

  this.showDropdown = function() {
    this.$dropDown.show();
    this.$container.addClass('opened');
    dropdownOpened = true;

    if (hasScroll) {
      this.$dropDown.addClass(this.scroll);
    }
  };

  this.hideDropdown = function() {
    this.$dropDown.hide();
    this.$container.removeClass('opened');
    dropdownOpened = false;
  };

  this.bindEvents = function() {
    $(document).on('click', function(e) {
      const $target = $(e.target);

      if ($target.closest('.dropdown__box').length) return;

      const $trigger = $target.closest('.dropdown')[0];

      if (dropdownOpened) {
        that.hideDropdown();
      } else if (that.$container[0] === $trigger) {
        that.showDropdown();
      }
    });

    this.$dropDown.find('a').on('click', function() {
      const value = $(this).data('value');
      that.setActiveValue(value);
      that.setActiveItem(value);
      that.hideDropdown();

      return false;
    });
  };

  this.buildHtml();
  this.bindEvents();

  if (this.placeholder && !$elem.find('option:selected').attr('selected')) {
    this.activeLabel = this.placeholder;
    this.$headerLabel.text(this.activeLabel);
    this.$header.addClass('dropdown__header--placeholder');
  } else {
    const value = this.$elem.val() ? this.$elem.val() : this.$elem.find('option').first().val();
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
      const value = that.$elem.val() ? that.$elem.val() : that.$elem.find('option').first().val();
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
    dropdowns[dropdownId] = new Dropdown($(this), options);
    $(this).data('dropdown-guid', dropdownId);
  });
};
