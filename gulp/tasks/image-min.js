module.exports = () => {
  $.gulp.task('imageMin:meta', () => {
    if (!$.config.imageMin) {
      return $.gulp.src(`${$.config.outputPath}/${$.config.metaPath}/*.{png,jpg,gif}`)
        .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.metaPath}`));
    }

    return $.gulp.src(`${$.config.outputPath}/${$.config.metaPath}/*.{png,jpg,gif}`)
      .pipe($.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }))
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.metaPath}`));
  });

  $.gulp.task('imageMin:media', () => {
    if (!$.config.imageMin) return false;
    return $.gulp.src(`${$.config.outputPath}/${$.config.mediaPath}/${$.config.imagesPath}/**/*.{png,jpg,gif}`)
      .pipe($.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }))
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.mediaPath}/${$.config.imagesPath}`));
  });
};