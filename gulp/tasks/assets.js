module.exports = () => {
  $.gulp.task('assets', () => {
    return $.gulp.src([
      `${$.config.sourcePath}/${$.config.assetsPath}/**/*`,
      `!${$.config.sourcePath}/${$.config.assetsPath}/svg`,
      `!${$.config.sourcePath}/${$.config.assetsPath}/svg/**/*`,
    ]).pipe($.gulp.dest(`${$.config.outputPath}/${$.config.assetsPath}`)).pipe($.bs.reload({ stream: true }));
  });
};