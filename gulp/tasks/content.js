module.exports = () => {
  $.gulp.task('content', () => {
    return $.gulp.src(`${$.config.sourcePath}/${$.config.contentPath}/**/*`)
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.contentPath}`));
  });
};