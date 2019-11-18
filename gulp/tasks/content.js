module.exports = () => {
  $.gulp.task('content', async () => $.combiner(
    $.gulp.src($.config.sourcePath + '/' + $.config.contentPath + '/**/*'),
    $.gulp.dest($.config.destPath + '/' + $.config.contentPath),
  ));
}