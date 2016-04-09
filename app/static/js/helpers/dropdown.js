(function () {
    "use strict";

    function Dropdown($elem, options) {
        var that = this;
        this.$elem = $elem;

        this.prefix = 'prefix' in options ? options.prefix : '';

        this.$container = null;
        this.$cityLabel = null;
        this.$dropDown = null;

        this.options = {};

        this.activeValue = null;
        this.activeLabel = null;

        var dropdownOpened = false;

        this.buildHtml = function () {
            this.$container = $('<div>').addClass('dropdown-container').height(that.$elem.height());

            var $header = $('<div>').addClass('dropdown-header').text(that.prefix ? that.prefix + ' ' : '');
            $header.append('<a href="#" class="dropdown-arrow"></a>');
            this.$cityLabel = $('<span>').appendTo($header);

            this.$dropDown = $('<div>').addClass('dropdown-box');

            this.$elem.find('option').each(function () {
                that.options[$(this).val()] = $(this).text();
                that.$dropDown.append('<span><a href="#" data-value="' + $(this).val() + '">' + $(this).text() + '</a></span>');
            });

            this.$container.append($header);
            this.$container.append(this.$dropDown);

            this.$elem.hide();

            this.$container.insertAfter(this.$elem);
        };


        this.setActiveValue = function (value) {
            this.activeValue = value;
            this.activeLabel = this.options[value];

            this.$cityLabel.text(this.activeLabel);
            this.$elem.val(this.activeValue).trigger('change');
        };

        this.showDropdown = function () {
            this.$dropDown.show();
            this.$container.addClass('dropdown-opened');
            dropdownOpened = true;
        };

        this.hideDropdown = function () {
            this.$dropDown.hide();
            this.$container.removeClass('dropdown-opened');
            dropdownOpened = false;
        };

        this.bindEvents = function () {

            this.$container.find('.dropdown-header span, .dropdown-arrow').on('click', function () {
                if (dropdownOpened === false) {
                    that.showDropdown();
                }
                else {
                    that.hideDropdown();
                }
                return false;
            });

            $(document).on('click', function (e) {
                if (!dropdownOpened) {
                    return;
                }

                var $target = $(e.target);

                if ($target.hasClass('dropdown-box') || $target.parents('.dropdown-box').length) {
                    return;
                }

                that.hideDropdown();
            });

            this.$dropDown.find('a').on('click', function () {
                that.setActiveValue($(this).data('value'));
                that.hideDropdown();

                return false;
            });
        };

        this.buildHtml();
        this.bindEvents();

        this.setActiveValue(this.$elem.find('option').first().val());
    }

    $.fn.dropdown = function (options) {
        $(this).each(function () {
            new Dropdown($(this), options);
        });
    };
})();