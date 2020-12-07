class Autogenerator {
  constructor(element, options) {
    this.element = element;

    const defaults = {
      selector: '',
    };

    this.config = Object.assign({}, defaults, options);
    this.insertAdjacentElement = document.querySelector(`${this.config.selector}-append`);

    let html = '';
    this.element.querySelectorAll(`${this.config.selector}-title`).forEach((title) => {
      const sectionElement = title.parentElement.parentElement;

      html += `
        <li>
          <a class="uikit-aside__link" href="#" data-id="${sectionElement.id}">${title.textContent}</a>
      `;

      const subtitles = sectionElement.querySelectorAll(`${this.config.selector}-subtitle`);

      if (subtitles.length) {
        html += `
          <ul>
        `;

        subtitles.forEach((subtitle) => {
          html += `
            <li>
              <a class="uikit-aside__sublink" href="#" data-id="${subtitle.parentElement.id}">${subtitle.textContent}</a>
            </li>
          `;
        });

        html += `
        </ul>
      `;
      }

      html += `
        </li>
      `;
    });

    this.insertAdjacentElement.insertAdjacentHTML('beforeend', html);
  }

  static init(element, options) {
    element && new Autogenerator(element, options);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const selector = '.js-uikit-autogenerator';
  document.querySelectorAll(selector).forEach((element) => Autogenerator.init(element, { selector }));

  $('.uikit-aside__nav a[href="#"][data-id]').on('click', function (event) {
    event.preventDefault();
    const id = $(this).data('id');

    $('html, body').animate({
      scrollTop: $(`#${id}`).offset().top - 70,
    }, 600);
  });
});