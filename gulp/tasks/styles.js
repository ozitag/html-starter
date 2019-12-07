module.exports = () => {
  $.gulp.task('styles', () => {
    if ($.config.cssMin) {
      return $.gulp.src(`./${$.config.sourcePath}/${$.config.stylesPath}/main.scss`)
        .pipe($.gulpPlugin.sass({
          importer: $.tildeImporter,
        }).on('error', $.gulpPlugin.sass.logError))
        .pipe($.gulpPlugin.autoprefixer())
        .pipe($.gulpPlugin.csso())
        .pipe($.gulpPlugin.cssmin())
        .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.staticPath}/css`))
        .pipe($.bs.reload({ stream: true }));
    }

    return $.gulp.src(`./${$.config.sourcePath}/${$.config.stylesPath}/main.scss`)
      .pipe($.gulpPlugin.sourcemaps.init())
      .pipe($.gulpPlugin.sass({
        importer: $.tildeImporter,
      }).on('error', $.gulpPlugin.sass.logError))
      .pipe($.gulpPlugin.autoprefixer())
      .pipe($.gulpPlugin.csso())
      .pipe($.gulpPlugin.sourcemaps.write())
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.staticPath}/css`))
      .pipe($.gulpPlugin.csslint('./config/.csslintrc'))
      .pipe($.bs.reload({ stream: true }));
  });
};
