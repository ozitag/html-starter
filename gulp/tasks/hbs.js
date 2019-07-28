module.exports = () => {
    $.gulp.task('hbs', function () {
        const data = {
                j_title: ''
            },
            options = {
                ignorePartials: true,
                batch: [
                    $.config.sourcePath + '/' + $.config.hbsPath + '/layouts',
                    $.config.sourcePath + '/' + $.config.hbsPath + '/partials'
                ],
                helpers: {
                    times: function (n, block) {
                        var accum = '';
                        for (var i = 0; i < n; ++i)
                            accum += block.fn(i + 1);
                        return accum;
                    },
                    ifCond: function (v1, v2, options) {
                        if (v1 === v2) {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    }
                }
            };


        return $.gulp.src([
            $.config.sourcePath + '/' + $.config.hbsPath + '/**/*.hbs',
            '!' + $.config.sourcePath + '/' + $.config.hbsPath + '/layouts/**/*.hbs',
            '!' + $.config.sourcePath + '/' + $.config.hbsPath + '/partials/**/*.hbs'
        ])
            .pipe($.gulpPlugin.plumber())
            .pipe($.gulpPlugin.compileHandlebars(data, options))
            .pipe($.gulpPlugin.rename(path => {
                path.extname = ".html"
            }))
            .pipe($.gulpPlugin.trim())
            .pipe($.gulp.dest($.config.tmpPath + '/html'))
            .pipe($.bs.reload({stream: true}))
    });
};