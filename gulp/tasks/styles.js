module.exports = () => {
  $.gulp.task('styles', () => {
    if ($.config.cssMin) {
      return $.combiner(
        $.gulp.src('./' + $.config.sourcePath + '/' + $.config.stylesPath + '/main.scss'),
        $.gulpPlugin.sass({
          importer: $.tildeImporter,
        }),
        $.gulpPlugin.autoprefixer(),
        $.gulpPlugin.csso(),
        $.gulpPlugin.cssmin(),
        $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/css'),
        $.bs.reload({ stream: true }),
      );
    }

    return $.combiner(
      $.gulp.src('./' + $.config.sourcePath + '/' + $.config.stylesPath + '/main.scss'),
      $.gulpPlugin.sourcemaps.init(),
      $.gulpPlugin.sass({
        importer: $.tildeImporter,
      }),
      $.gulpPlugin.autoprefixer(),
      $.gulpPlugin.csso(),
      $.gulpPlugin.sourcemaps.write(),
      $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/css'),
      $.gulpPlugin.csslint('./config/.csslintrc'),
      $.bs.reload({ stream: true }),
    );
  })
}
