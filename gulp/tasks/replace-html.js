module.exports = () => {
  $.gulp.task('replaceHtml', () => {
    if ($.config.concatScripts) {
      return $.combiner(
        $.gulp.src($.config.destPath + '/html/**/*.html'),
        $.gulpPlugin.htmlReplace({
          scripts: '../' + $.config.scriptsPath + '/all.min.js',
        }),
        $.gulp.dest($.config.destPath + '/html/'),
      )
    }

    return $.combiner(
      $.gulp.src($.config.destPath + '/html/**/*.html'),
      $.gulp.dest($.config.destPath + '/html/'),
    )
  })
}