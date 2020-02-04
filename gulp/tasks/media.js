module.exports = () => {
  $.gulp.task('media', () => {
    return $.gulp.src(`./${$.config.sourcePath}/${$.config.mediaPath}/**/*`).
      pipe($.gulp.dest(`./${$.config.outputPath}/${$.config.mediaPath}`)).
      pipe($.bs.reload({ stream: true }));
  });
};