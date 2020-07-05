module.exports = () => {
  $.gulp.task('prepareHtmlBuild', () => {
    // Получаем исходные данные
    const files = $.fs.readdirSync(`${$.config.sourcePath}/${$.config.metaPath}`); // имена файлов в meta
    const templates = $.fs.readdirSync(`${$.config.sourcePath}/${$.config.hbsPath}/pages`)
      .concat([`ui-toolkit.hbs`]); // имена шаблонов страниц
    const tmpFiles = $.fs.readdirSync(`${$.config.outputPath}/html`); // имена созданных html страниц

    let html = '';
    const pageNames = {};

    // Получаем имена из шаблонов
    for (let i = 0; i < templates.length; i++) {
      const templateName = templates[i].substring(
        templates[i],
        templates[i].lastIndexOf('.'),
      );

      if (templates[i] === 'ajax' ||
          templates[i] === 'layouts' ||
          templates[i] === 'partials' ||
          templates[i] === 'index' ||
          templates[i] === '.DS_Store') continue;

      const file = $.fs
        .readFileSync(
          `${$.config.sourcePath}/${$.config.hbsPath}/${templateName === 'ui-toolkit' ? '' : 'pages'}/${templateName}.hbs`,
        )
        .toString();

      if (file.indexOf('{{!') !== -1) pageNames[templateName] = file.substring(3, file.indexOf('}}'));
    }

    // Вставляем заголовки созданных страниц
    for (let k = 0; k < tmpFiles.length; k++) {
      const tpmTemplateName = tmpFiles[k].substring(
        tmpFiles[k],
        tmpFiles[k].lastIndexOf('.'),
      );

      if (tpmTemplateName === 'index' || tpmTemplateName === '') continue;

      const hbs = $.fs
        .readFileSync(`${$.config.outputPath}/html/${tpmTemplateName}.html`)
        .toString();

      $.fs.writeFileSync(`${$.config.outputPath}/html/${tpmTemplateName}.html`,
        hbs.replace(
          /<title>(.*)/,
          '<title>' + pageNames[tpmTemplateName] + '</title>'),
      );
    }

    // Получаем meta-изображения и подготавливаем превью для страниц
    for (let j = 0; j < files.length; j++) {
      if (files[j] === '.gitkeep' || files[j] === '.DS_Store') continue;

      const desc = files[j].substring(
        files[j].indexOf('_') + 1,
        files[j].lastIndexOf('.'),
      );
      const pageName = pageNames[desc];

      html += `
        <li class="main__item">
          <article class="main__article">
            <h2 class="main__title">${pageName}</h2>
            <a class="main__link js-hover-item" href="${desc}.html" title="${pageName}" aria-label="Link to internal page.">
                <img class="main__image" src="../${$.config.metaPath}/${files[j]}" alt="Preview image." loading="lazy">
             </a>
          </article>
        </li>
        `;
    }

    // Подставляем полученные данные и генерируем билд
    const templateFile = $.fs
      .readFileSync('./config/template-build.html')
      .toString();
    const date = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
    };
    $.fs.writeFileSync(
      `${$.config.outputPath}/html/index.html`,
      templateFile
        .replace('{{items}}', html)
        .replace(/{{siteName}}/g, $.config.siteName)
        .replace('{{buildDate}}', date.toLocaleString('ru', options)),
    );

    return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
      .pipe($.gulpPlugin.cheerio({
        run: jQuery => {
          jQuery('script').each(function() {
            let src = jQuery(this).attr('src');
            if (
              src !== undefined &&
              src.substr(0, 5) !== 'http:' &&
              src.substr(0, 6) !== 'https:'
            ) {
              src = `../${$.config.scriptsPath}/${src}`;
            }

            jQuery(this).attr('src', src);
          });
        },
        parserOptions: {
          decodeEntities: false,
        },
      }))
      .pipe($.gulp.dest(`${$.config.outputPath}/html/`))
      .pipe($.bs.reload({ stream: true }));
  });
};
