module.exports = () => {
  $.gulp.task('criticalCss', function() {
    if ($.config.criticalCss) {
      return $.gulp
        .src($.config.destPath + '/html/**/*.html')
        .pipe(
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
        )
        .on('error', function(err) {
          $.gulpPlugin.util.log($.gulpPlugin.util.colors.red(err.message))
        })
        .pipe($.gulp.dest($.config.destPath + '/html/critical'))
    }

    return $.gulp.src($.config.destPath + '/html/**/*.html').pipe($.gulp.dest($.config.destPath + '/html/'))
  })
}
