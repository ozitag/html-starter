module.exports = () => {
  $.gulp.task('meta', () => {
    return $.gulp.src(`${$.config.sourcePath}/${$.config.metaPath}/*`)
      .pipe($.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }))
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.metaPath}`));
  });
};
