module.exports = () => {
  $.gulp.task('copyMetaFiles', () => $.combiner(
    $.gulp.src($.config.sourcePath + '/' + $.config.metaPath + '/*'),
    $.gulp.dest($.config.destPath + '/' + $.config.metaPath),
  ));
}