module.exports = () => {
  $.gulp.task('replaceHtml', () => {
    if ($.config.concatScripts) {
      return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
        .pipe($.gulpPlugin.htmlReplace({
          scripts: `../${$.config.scriptsPath}/all.min.js`,
        }))
        .pipe($.gulp.dest(`${$.config.outputPath}/html/`))
    }

    return $.gulp.src(`${$.config.outputPath}/html/**/*.html`)
      .pipe($.gulp.dest(`${$.config.outputPath}/html/`))
  })
}