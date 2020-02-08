module.exports = () => {
  $.gulp.task('criticalCss', () => {
    if ($.config.criticalCss) {
      return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
        .pipe($.critical({
          inline: false,
          base: 'dist/html/',
          minify: true,
          css: ['dist/css/main.css'],
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
        }))
        .on('error', function(err) {
          console.error(err);
        })
        .pipe($.gulp.dest($.config.outputPath + '/html/critical'));
    }

    return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
      .pipe($.gulp.dest(`${$.config.outputPath}/html/`));
  });
};
