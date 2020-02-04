module.exports = () => {
  $.gulp.task('fonts', () => {
    return $.gulp.src(`./${$.config.sourcePath}/${$.config.fontsPath}/**/*`)
      .pipe($.gulp.dest(`./${$.config.outputPath}/${$.config.fontsPath}`))
      .pipe($.bs.reload({ stream: true }));
  });
};