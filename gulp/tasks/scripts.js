module.exports = () => {
    $.gulp.task('scripts:libs', () => {
        return $.gulp.src($.config.supportJsLibs)
            .pipe($.gulpPlugin.concat('support-libs.js'))
            .pipe($.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/js/'))
    });

    $.gulp.task('scripts', () => {
        return $.gulp.src(['./' + $.config.sourcePath + '/' + $.config.staticPath + '/js/**'])
            .pipe($.gulpPlugin.babel()).on('error', function(err) {
                console.log('[Compilation Error]');
                console.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
                console.log('error Babel: ' + err.message + '\n');
                console.log(err.codeFrame);

                this.emit('end');
            })
            .pipe($.gulp.dest($.config.tmpPath + '/' + $.config.staticPath + '/js/'))
            .pipe($.bs.reload({stream: true}));
    });

    $.gulp.task('prepareJs', () => {
        const buildPath = $.config.destPath + '/' + $.config.scriptsPath + '/';

        if (!$.config.concatScripts) {
            return $.gulp.src($.config.tmpPath + '/' + $.config.scriptsPath + '/**/*')
                .pipe($.gulp.dest(buildPath));
        }

        return $.gulp.src($.config.tmpPath + '/' + $.config.scriptsPath + '/**/*')
            .pipe($.gulpPlugin.concat('all.js'))
            .pipe($.gulp.dest(buildPath))
            .pipe($.gulpPlugin.uglify())
            .pipe($.gulpPlugin.rename('all.min.js'))
            .pipe($.gulp.dest(buildPath));
    });
};