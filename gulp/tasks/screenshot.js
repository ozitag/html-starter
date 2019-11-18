module.exports = () => {
  $.gulp.task('screens', () => $.combiner(
    $.gulp.src($.config.tmpPath + '/html/*.html'),
    $.gulpPlugin.webshot({
      dest: $.config.tmpPath + '/screens/',
      root: $.config.tmpPath,
    }),
  ))
}