module.exports = () => {
  $.gulp.task('prepareHtmlDev', () => {
    const templates = $.fs.readdirSync(`${$.config.sourcePath}/${$.config.hbsPath}/pages`).concat(['ui-toolkit.hbs']);
    const html = [];
    const pages = {};

    for (const template of templates) {
      if (template === 'index' || template === '.DS_Store') continue;

      const pageName = template.substring(0, template.lastIndexOf('.'));

      if (pages[pageName] === undefined) pages[pageName] = {};

      const file = $.fs
        .readFileSync(
          `${$.config.sourcePath}/${$.config.hbsPath}/${pageName === 'ui-toolkit' ?
            pageName : 'pages/' + pageName}.hbs`,
        ).toString();

      if (file.indexOf('{{!') !== -1) pages[pageName].title = file.substring(3, file.indexOf('}}'));

      html.push(`<li><a href="${pageName}.html">${pages[pageName].title}</a></li>`);
    }

    const templateFile = $.fs
      .readFileSync('./config/template-dev.html')
      .toString();

    $.fs.writeFileSync(
      `${$.config.outputPath}/html/index.html`,
      templateFile
        .replace('{{items}}', `${html.join('')}`)
        .replace(/{{siteName}}/g, $.config.siteName),
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
            ) src = `../${$.config.scriptsPath}/${src}`;

            jQuery(this).attr('src', src);
          });
          jQuery('a').each(function () {
            const href = jQuery(this).attr('href');

            if (!href || href.substr(0, 1) === '#' ||
              href.substr(0, 4) === 'tel:' ||
              href.substr(0, 4) === 'ftp:' ||
              href.substr(0, 5) === 'file:' ||
              href.substr(0, 5) === 'http:' ||
              href.substr(0, 6) === 'https:' ||
              href.substr(0, 7) === 'mailto:') {
              return;
            }

            if (href.substr(0, 6) === '/html/') return;

            let newHref = '/html/' + (href[0] === '/' ? href.substr(1) : href);
            if (newHref.substr(-5) !== '.html') {
              newHref = newHref + '.html';
            }

            jQuery(this).attr('href', newHref);
          });
        },
        parserOptions: { decodeEntities: false },
      }))
      .pipe($.gulp.dest($.config.outputPath + '/html/'));
  });
};
