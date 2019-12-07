module.exports = () => {
  $.gulp.task('prepareHtmlDev', () => {
    const templates = $.fs.readdirSync(
      $.config.sourcePath + '/' + $.config.hbsPath,
    );

    let liList = '';

    for (let i = 0; i < templates.length; i++) {
      const templateName = templates[i].substring(
        templates[i],
        templates[i].lastIndexOf('.'),
      );

      if (
        templates[i] === 'ajax' ||
        templates[i] === 'layouts' ||
        templates[i] === 'partials' ||
        templates[i] === 'index' ||
        templates[i] === '.DS_Store'
      ) {
        continue;
      }

      const file = $.fs
        .readFileSync(
          `${$.config.sourcePath}/${$.config.hbsPath}/${templateName}.hbs`,
        )
        .toString();

      if (file.indexOf('{{!') !== -1) {
        const name = file.substring(3, file.indexOf('}}'));
        const liElement = `<li><a href="${templateName}.html">${name}</a></li>`;
        liList += liElement;
      }
    }

    const templateFile = $.fs
      .readFileSync('./config/template-dev.html')
      .toString();

    $.fs.writeFileSync(
      `${$.config.outputPath}/html/index.html`,
      templateFile
        .replace('{{items}}', liList)
        .replace(/{{siteName}}/g, $.config.siteName),
    );

    return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
      .pipe($.gulpPlugin.cheerio({
        run: jQuery => {
          jQuery('script').each(function() {
            var src = jQuery(this).attr('src');
            if (
              src !== undefined &&
              src.substr(0, 5) !== 'http:' &&
              src.substr(0, 6) !== 'https:'
            ) {
              src = '../' + $.config.scriptsPath + '/' + src;
            }

            jQuery(this).attr('src', src);
          });
        },
        parserOptions: {
          decodeEntities: false,
        },
      }))
      .pipe($.gulp.dest($.config.outputPath + '/html/'));
  });
};
