module.exports = () => {
  $.gulp.task('criticalCss', () => {
    if ($.config.criticalCss) {
      return $.combiner(
        $.gulp.src($.config.destPath + '/html/**/*.html'),
        $.critical({
          inline: false,
          base: 'dist/html/',
          minify: true,
          css: ['dist/static/css/main.css'],
          dimensions: [
            {
              height: 480,
              width: 320,
            },
            {
              height: 900,
              width: 1200,
            },
          ],
        }),
        $.gulp.dest($.config.destPath + '/html/critical'),
      ).on('error', function(err) {
        $.gulpPlugin.util.log($.gulpPlugin.util.colors.red(err.message))
      })
    }

    return $.combiner(
      $.gulp.src($.config.destPath + '/html/**/*.html'),
      $.gulp.dest($.config.destPath + '/html/'),
    )
  })
}
