module.exports = () => {
  $.gulp.task('content', () => $.combiner(
    $.gulp.src('./' + $.config.sourcePath + '/' + $.config.contentPath + '/**/*'),
    $.gulp.dest($.config.tmpPath + '/' + $.config.contentPath),
  ));
}