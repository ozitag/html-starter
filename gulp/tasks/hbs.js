module.exports = () => {
  $.gulp.task('hbs', () => {
    const data = {
        j_title: '',
      },
      options = {
        ignorePartials: true,
        batch: [
          $.config.sourcePath + '/' + $.config.hbsPath + '/layouts',
          $.config.sourcePath + '/' + $.config.hbsPath + '/partials',
        ],
        helpers: {
          times: (n, block) => {
            var accum = ''
            for (var i = 0; i < n; ++i)
              accum += block.fn(i + 1)
            return accum
          },
          ifCond: (v1, v2, options) => {
            if (v1 === v2) {
              return options.fn(this)
            }
            return options.inverse(this)
          },
        },
      }


    return $.combiner(
      $.gulp.src([
        $.config.sourcePath + '/' + $.config.hbsPath + '/**/*.hbs',
        '!' + $.config.sourcePath + '/' + $.config.hbsPath + '/layouts/**/*.hbs',
        '!' + $.config.sourcePath + '/' + $.config.hbsPath + '/partials/**/*.hbs',
      ]),
      $.gulpPlugin.compileHandlebars(data, options),
      $.gulpPlugin.rename(path => {
        path.extname = '.html'
      }),
      $.gulpPlugin.trim(),
      $.gulp.dest($.config.tmpPath + '/html'),
      $.bs.reload({ stream: true }),
    )
  })
}