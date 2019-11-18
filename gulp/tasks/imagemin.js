module.exports = () => {
  $.gulp.task('imagemin:meta', () => {
    if (!$.config.imagemin) {
      return $.combiner(
        $.gulp.src($.config.destPath + '/' + $.config.metaPath + '/*.{png,jpg,gif}'),
        $.gulp.dest($.config.destPath + '/' + $.config.metaPath),
      )
    }

    return $.combiner(
      $.gulp.src($.config.destPath + '/' + $.config.metaPath + '/*.{png,jpg,gif}'),
      $.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }),
      $.gulp.dest($.config.destPath + '/' + $.config.metaPath),
    )
  })

  $.gulp.task('imagemin:content', () => {
    if (!$.config.imagemin) {
      return $.combiner(
        $.gulp.src($.config.destPath + '/' + $.config.contentPath + '/images/**/*.{png,jpg,gif}'),
        $.gulp.dest($.config.destPath + '/' + $.config.contentPath + '/images'),
      )
    }

    return $.combiner(
      $.gulp.src($.config.destPath + '/' + $.config.contentPath + '/images/**/*.{png,jpg,gif}'),
      $.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }),
      $.gulp.dest($.config.destPath + '/' + $.config.contentPath + '/images'),
    )
  })
}