module.exports = () => {
  $.gulp.task('prepareHtmlBuild', () => {
    // Формируем исходные данные
    const metaImages = $.fs.readdirSync(`${$.config.sourcePath}/${$.config.metaPath}`); // имена файлов в папке meta
    const templates = $.fs.readdirSync(`${$.config.sourcePath}/${$.config.hbsPath}/pages`)
      .concat([`ui-toolkit.hbs`]); // имена шаблонов страниц
    const outputHtmlFiles = $.fs.readdirSync(`${$.config.outputPath}/html`); // имена созданных html страниц

    const html = []; // массив для генерируемых элементов
    const pageNames = {}; // имена страниц

    // Получаем имена из шаблонов
    for (const template of templates) {
      if (template === 'index' || template === '.DS_Store') continue;

      const templateName = template.substring(0, template.lastIndexOf('.')); // получаем имя шаблона
      console.log('templateName: ',templateName);

      const file = $.fs
        .readFileSync(
          `${$.config.sourcePath}/${$.config.hbsPath}/${templateName === 'ui-toolkit' ? '' : 'pages'}/${templateName}.hbs`,
        )
        .toString(); // получаем шаблон

      if (file.indexOf('{{!') !== -1) pageNames[templateName] = file.substring(3, file.indexOf('}}')); // генерируем значение поля

      const hbs = $.fs
        .readFileSync(`${$.config.outputPath}/html/${templateName}.html`)
        .toString();

      $.fs.writeFileSync(`${$.config.outputPath}/html/${templateName}.html`,
        hbs.replace(
          /<title>(.*)/,
          '<title>' + pageNames[templateName] + '</title>'),
      );
      console.log('pageNames[templateName]: ',pageNames[templateName]);
    }

    // Получаем meta-изображения и подготавливаем превью для страниц
    for (const meta of metaImages) {
      if (meta === '.gitkeep' || meta === '.DS_Store') continue;

      const desc = meta.substring(
        meta.indexOf('_') + 1,
        meta.lastIndexOf('.'),
      );
      const pageName = pageNames[desc];

      html.push(`
        <li class="main__item">
          <article class="main__article">
            <h2 class="main__title">${pageName}</h2>
            <a class="main__link js-hover-item" href="${desc}.html" title="${pageName}" aria-label="Link to internal page.">
              <img class="main__image" src="../${$.config.metaPath}/${meta}" alt="Preview image." loading="lazy">
            </a>
          </article>
        </li>`); // генерируем строку в цикле
    }

    // получаем время сборки
    const sourceTemplate = $.fs.readFileSync('./config/template-build.html').toString(); // берем шаблон и приводим его к строке
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'Europe/Moscow',
      hour: 'numeric',
      minute: 'numeric',
    };

    // Подставляем полученные данные и генерируем билд
    $.fs.writeFileSync(
      `${$.config.outputPath}/html/index.html`,
      sourceTemplate
        .replace('{{items}}', `${html.join('')}`)
        .replace(/{{siteName}}/g, $.config.siteName)
        .replace('{{buildDate}}', new Date().toLocaleString('ru', options)),
    );

    return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
      .pipe($.gulpPlugin.cheerio({
        run: jQuery => {
          jQuery('script').each(function() {
            let src = jQuery(this).attr('src');

            if (src !== undefined &&
              src.substr(0, 5) !== 'http:' &&
              src.substr(0, 6) !== 'https:') src = `../${$.config.scriptsPath}/${src}`;

            jQuery(this).attr('src', src);
          });
        },
        parserOptions: { decodeEntities: false, },
      }))
      .pipe($.gulp.dest(`${$.config.outputPath}/html/`))
      .pipe($.bs.reload({ stream: true }));
  });
};
