module.exports = () => {
  $.gulp.task('svgSprite', () => {
    return $.gulp.src(`${$.config.sourcePath}/${$.config.svgPath}/**/*.svg`)
      .pipe($.gulpPlugin.svgmin())
      .pipe($.gulpPlugin.svgSprite({
        mode: {
          css: {
            'spacing': {
              'padding': 5,
            },
            layout: 'diagonal',
            dest: './',
            sprite: `${$.config.outputPath}/${$.config.imagesPath}/sprite.svg`,
            bust: false,
            render: {
              'scss': {
                'dest': `${$.config.sourcePath}/${$.config.stylesPath}/core/svg/_sprite.scss`,
                'template': `./config/sprite-template.scss`,
              },
            },
          },
        },
      }))
      .pipe($.gulp.dest('./'));
  });

  $.gulp.task('svgInline', () => {
    return $.gulp.src(`${$.config.sourcePath}/${$.config.svgInlinePath}/**/*.svg`)
      .pipe($.gulpPlugin.svgmin({
        js2svg: {
          pretty: true,
        },
      }))
      .pipe($.gulpPlugin.cheerio({
        run: function($) {
          $('title').remove();
          $('style').remove();
        },
        parserOptions: { xmlMode: true },
      }))
      .pipe($.gulpPlugin.replace('&gt;', '>'))
      .pipe($.gulpPlugin.svgSprite({
        mode: {
          symbol: {
            dest: './',
            example: false,
            bust: false,
            sprite: `${$.config.outputPath}/${$.config.imagesPath}/spriteInline.svg`,
            inline: false,
            render: {
              scss: {
                dest: `${$.config.sourcePath}/${$.config.stylesPath}/core/svg/_spriteInline.scss`,
                template: `./config/sprite-template-inline.scss`,
              },
            },
          },
        },
      }))
      .pipe($.gulp.dest('./'));
  });
};
