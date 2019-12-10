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

  $.gulp.task('imageMin:content', () => {
    if (!$.config.imageMin) {
      return $.gulp.src(`${$.config.outputPath}/${$.config.contentPath}/images/**/*.{png,jpg,gif}`)
        .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.contentPath}/images`));
    }

    return $.gulp.src(`${$.config.outputPath}/${$.config.contentPath}/images/**/*.{png,jpg,gif}`)
      .pipe($.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }))
      .pipe($.gulp.dest(`${$.config.outputPath}/${$.config.contentPath}/images`));
  });
};