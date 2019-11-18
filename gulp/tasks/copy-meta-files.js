module.exports = () => {
  $.gulp.task('copyMetaFiles', async () => $.combiner(
    $.gulp.src($.config.sourcePath + '/' + $.config.metaPath + '/*'),
    $.gulp.dest($.config.destPath + '/' + $.config.metaPath),
  ));
}