module.exports = () => {
  $.gulp.task('svg', () => $.combiner(
    $.gulp.src($.config.sourcePath + '/' + $.config.svgPath + '/**/*.svg'),
    $.gulpPlugin.svgmin(),
    $.gulpPlugin.svgSprite({
      mode: {
        css: {
          'spacing': {
            'padding': 5,
          },
          layout: 'diagonal',
          dest: './',
          sprite: $.config.tmpPath + '/' + $.config.staticPath + '/images/svg/sprite.svg',
          bust: false,
          render: {
            'scss': {
              'dest': $.config.sourcePath + '/' + $.config.stylesPath + '/svg/_sprite.scss',
              'template': './config/sprite-template.scss',
            },
          },
        },
      },
    }),
    $.gulp.dest('./'),
  ))

  $.gulp.task('svgInline', () => $.combiner(
    $.gulp.src($.config.sourcePath + '/' + $.config.svgInlinePath + '/**/*.svg'),
    $.gulpPlugin.svgmin({
      js2svg: {
        pretty: true,
      },
    }),
    $.gulpPlugin.cheerio({
      run: function($) {
        $('[fill]').removeAttr('fill')
        $('[stroke]').removeAttr('stroke')
        $('[style]').removeAttr('style')
        $('title').remove()
        $('style').remove()
      },
      parserOptions: { xmlMode: true },
    }),
    $.gulpPlugin.replace('&gt;', '>'),
    $.gulpPlugin.svgSprite({
      mode: {
        symbol: {
          dest: './',
          example: false,
          bust: false,
          sprite: $.config.tmpPath + '/' + $.config.staticPath + '/images/svg/spriteInline.svg',
          inline: false,
          render: {
            scss: {
              dest: $.config.sourcePath + '/' + $.config.stylesPath + '/svg/_spriteInline.scss',
              template: './config/sprite-template-inline.scss',
            },
          },
        },
      },
    }),
    $.gulp.dest('./'),
  ))
}