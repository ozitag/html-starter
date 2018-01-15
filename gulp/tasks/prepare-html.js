module.exports = () => {
    $.gulp.task('prepareHtml', function () {
        const files = $.fs.readdirSync($.config.sourcePath + '/' + $.config.metaPath);
        const templates = $.fs.readdirSync($.config.sourcePath + '/' + $.config.hbsPath);
        const tmpFiles = $.fs.readdirSync($.config.tmpPath + '/html');

        let html = "";

        const pageNames = {};

        for (let i = 0; i < templates.length; i++) {
            const templateName = templates[i].substring(templates[i], templates[i].lastIndexOf('.'));

            if (templates[i] === 'ajax' ||
                templates[i] === 'layouts' ||
                templates[i] === 'partials' ||
                templates[i] === 'index' ||
                templates[i] === '.DS_Store') {
                continue;
            }

            const file = $.fs.readFileSync($.config.sourcePath + '/' + $.config.hbsPath + '/' + templateName + '.hbs').toString();

            if (file.indexOf('{{!') !== -1) {
                pageNames[templateName] = file.substring(3, file.indexOf("}}"));
            }
        }

        for (let k = 0; k < tmpFiles.length; k++) {
            const tpmTemplateName = tmpFiles[k].substring(tmpFiles[k], tmpFiles[k].lastIndexOf('.'));

            if (tpmTemplateName === 'index') {
                continue;
            }

            const hbs = $.fs.readFileSync($.config.tmpPath + '/html/' + tpmTemplateName + '.html').toString();
            $.fs.writeFileSync($.config.tmpPath + '/html/' + tpmTemplateName + '.html', hbs.replace(/<title>(.*)/, '<title>' + pageNames[tpmTemplateName] + '</title>'));
        }

        for (let j = 0; j < files.length; j++) {
            if (files[j] === '.gitkeep') {
                continue;
            }

            const desc = item.substring(item.indexOf('_') + 1, item.lastIndexOf('.'));
            const pageName = pageNames[desc];

            html += '<div class="col-md-3 col-sm-4 col-xs-12"> ' +
                '<div class="page-default__item_title">' + pageName + '</div>' +
                '<a class="page-default__item js-hover-item" title="' + pageName + '" href="' + desc + '.html" style="background: url(../' + $.config.metaPath + '/' + item +')no-repeat top center;"></a>' +
                ' </div>';
        }

        const templateFile = $.fs.readFileSync('./config/template.html').toString();
        $.fs.writeFileSync($.config.tmpPath + '/' + 'html/index.html', templateFile.replace('{{items}}', html).replace(/{{siteName}}/g, $.config.siteName));

        return $.gulp.src($.config.tmpPath + '/html/**/*.html')
            .pipe($.gulpPlugin.cheerio({
                run: jQuery => {
                    jQuery('script').each(function () {
                        var src = jQuery(this).attr('src');
                        if (src !== undefined && src.substr(0, 5) !== 'http:' && src.substr(0, 6) !== 'https:') {
                            src = '../' + $.config.scriptsPath + '/' + src;
                        }

                        jQuery(this).attr('src', src);
                    });
                },
                parserOptions: {
                    decodeEntities: false
                }
            }))
            .pipe($.gulp.dest($.config.tmpPath + '/html/'))
            .pipe($.bs.reload({stream: true}));
    });
};