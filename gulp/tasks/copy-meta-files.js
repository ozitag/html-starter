module.exports = () => {
  $.gulp.task('copyMetaFiles', () => {
    return $.gulp.src(`${$.config.sourcePath}/${$.config.metaPath}/*`)
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.metaPath}`));
  });
};