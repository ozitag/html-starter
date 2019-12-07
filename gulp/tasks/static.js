module.exports = () => {
  $.gulp.task('static:fonts', () => {
    return $.gulp.src(`./${$.config.sourcePath}/${$.config.staticPath}/fonts/**/*`)
      .pipe($.gulp.dest(`./${$.config.outputPath}/${$.config.staticPath}/fonts`))
      .pipe($.bs.reload({ stream: true }));
  });

  $.gulp.task('static:images', () => {
    return $.gulp.src(`./${$.config.sourcePath}/${$.config.staticPath}/images/**/*`)
      .pipe($.gulp.dest(`./${$.config.outputPath}/${$.config.staticPath}/images`))
      .pipe($.bs.reload({ stream: true }));
  });
};