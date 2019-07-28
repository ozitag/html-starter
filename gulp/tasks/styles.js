module.exports = () => {
  $.gulp.task('styles', function() {
    if ($.config.cssMin) {
      return $.gulp
        .src('./' + $.config.sourcePath + '/' + $.config.stylesPath + '/main.scss')
        .pipe($.gulpPlugin.sass().on('error', $.gulpPlugin.sass.logError))
        .pipe(
          $.gulpPlugin.autoprefixer({
            browsers: ['last 10 versions'],
            cascade: 1,
          }),
        )
        .pipe($.gulpPlugin.csso())
        .pipe($.gulpPlugin.cssmin())
        .pipe($.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/css'))
        .pipe($.bs.reload({ stream: true }))
    }

    return $.gulp
      .src('./' + $.config.sourcePath + '/' + $.config.stylesPath + '/main.scss')
      .pipe($.gulpPlugin.sourcemaps.init())
      .pipe($.gulpPlugin.sass().on('error', $.gulpPlugin.sass.logError))
      .pipe(
        $.gulpPlugin.autoprefixer({
          browsers: ['last 10 versions'],
          cascade: 1,
        }),
      )
      .pipe($.gulpPlugin.csso())
      .pipe($.gulpPlugin.sourcemaps.write())
      .pipe($.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/css'))
      .pipe($.gulpPlugin.csslint('./config/.csslintrc'))
      .pipe($.bs.reload({ stream: true }))
  })
}
