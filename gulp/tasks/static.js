module.exports = () => {
  $.gulp.task('static:fonts', () => $.combiner(
    $.gulp.src('./' + $.config.sourcePath + '/' + $.config.staticPath + '/fonts/**/*'),
    $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/fonts'),
    $.bs.reload({ stream: true })
  ));

  $.gulp.task('static:images', () => $.combiner(
    $.gulp.src('./' + $.config.sourcePath + '/' + $.config.staticPath + '/images/**/*'),
    $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/images'),
    $.bs.reload({ stream: true })
  ));

  $.gulp.task('static:videos', () => $.combiner(
    $.gulp.src('./' + $.config.sourcePath + '/' + $.config.staticPath + '/videos/**/*'),
    $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/videos'),
    $.bs.reload({ stream: true })
  ));
}