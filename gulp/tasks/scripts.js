module.exports = () => {
  $.gulp.task('scripts:libs', () => $.combiner(
    $.gulp.src($.config.supportJsLibs),
    $.gulpPlugin.concat('support-libs.js'),
    $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/js/'),
  ))

  $.gulp.task('scripts', () => {
    if ($.config.babel && $.argv._[0] === 'build') {
      return $.combiner(
        $.gulp.src(['./' + $.config.sourcePath + '/' + $.config.staticPath + '/js/**']),
        $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/js/'),
        $.bs.reload({ stream: true }),
      ).on('error', function(err) {
        console.log('[Compilation Error]')
        console.log(err.fileName + (err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '))
        console.log('error Babel: ' + err.message + '\n')
        console.log(err.codeFrame)
        this.emit('end')
      })
    }

    return $.combiner(
      $.gulp.src(['./' + $.config.sourcePath + '/' + $.config.staticPath + '/js/**']),
      $.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/js/'),
      $.bs.reload({ stream: true }),
    )
  })

  $.gulp.task('prepareJs', () => {
    const buildPath = $.config.destPath + '/' + $.config.scriptsPath + '/'

    if (!$.config.concatScripts) {
      return $.combiner(
        $.gulp.src($.config.tmpPath + '/' + $.config.scriptsPath + '/**/*'),
        $.gulp.dest(buildPath),
      )
    }

    return $.combiner(
      $.gulpPlugin.domSrc({
        file: $.config.concatFilePath
          ? $.config.tmpPath + '/html/' + $.config.concatFilePath
          : $.config.tmpPath + '/html/home.html',
        selector: 'script',
        attribute: 'src',
      }),
      $.gulpPlugin.concat('all.js'),
      $.gulp.dest(buildPath),
      $.gulpPlugin.uglify(),
      $.gulpPlugin.rename('all.min.js'),
      $.gulp.dest(buildPath),
    )
  })
}
