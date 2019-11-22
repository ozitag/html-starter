module.exports = () => {
  const db = {
    config: {},
    data: null,
  }
  db.config.cache = randomIntNum(1, 5000)
  db.config.buildMode = $.config.buildMode === 'build' ?
    'prod' : 'dev'

  const options = {
    ignorePartials: true,
    batch: [
      `${$.config.sourcePath}/${$.config.hbsPath}/layouts`,
      `${$.config.sourcePath}/${$.config.hbsPath}/partials`,
    ],
    helpers: {
      times: function(n, block) {
        let accum = ''
        for (let i = 0; i < n; ++i)
          accum += block.fn(i + 1)
        return accum
      },
      ifCond: function(v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this)
        }
        return options.inverse(this)
      },
    },
  }

  $.gulp.task('hbs', () => {
    db.data = JSON.parse(
      $.fs.readFileSync(`${$.config.sourcePath}/${$.config.dbPath}/db.json`),
    )

    return $.gulp.src([
      `${$.config.sourcePath}/${$.config.hbsPath}/**/*.hbs`,
      `!${$.config.sourcePath}/${$.config.hbsPath}/layouts/**/*.hbs`,
      `!${$.config.sourcePath}/${$.config.hbsPath}/partials/**/*.hbs`,
    ])
      .pipe($.gulpPlugin.plumber())
      .pipe($.gulpPlugin.compileHandlebars(db, options))
      .pipe($.gulpPlugin.rename(path => {
        path.extname = '.html'
      }))
      .pipe($.gulpPlugin.trim())
      .pipe($.gulp.dest(`${$.config.outputPath}/html`))
      .pipe($.bs.reload({ stream: true }),
      )
  })

  function randomIntNum(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
  }
}