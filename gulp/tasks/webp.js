module.exports = () => {
  $.gulp.task('webp', () => {
    if (!$.config.buildWebp) return $.gulp.src('.').pipe($.nop());
    return $.gulp.src([
      `${$.config.sourcePath}/${$.config.assetsPath}/images/**/*`,
    ]).pipe($.webp({quality: 100})).pipe($.gulp.dest(`${$.config.destPath}/${$.config.assetsPath}/images`));
  });
};
