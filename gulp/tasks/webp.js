module.exports = () => {
  $.gulp.task('webp', () => {
    if (!$.config.buildWebp) return false;
    return $.gulp.src([
      `${$.config.sourcePath}/${$.config.assetsPath}/images/**/*`,
    ]).pipe($.webp()).pipe($.gulp.dest(`${$.config.destPath}/${$.config.assetsPath}/images`));
  });
};
