module.exports = () => {
  $.gulp.task('screens', () => {
    return $.gulp.src(`${$.config.outputPath}/html/*.html`)
      .pipe($.gulpPlugin.webshot({
        dest: `${$.config.outputPath}/screens/`,
        root: `${$.config.outputPath}`,
      }));
  });
};