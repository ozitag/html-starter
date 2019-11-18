module.exports = () => {
  $.gulp.task('dist', () => $.combiner(
    $.gulp.src([
      $.config.tmpPath + '/**/*',
      '!' + $.config.tmpPath + '/' + $.config.scriptsPath + '/**/*',
    ]),
    $.gulp.dest($.config.destPath + '/'),
  ))
}