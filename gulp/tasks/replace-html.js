module.exports = () => {
    $.gulp.task('replaceHtml', () => {
        if ($.config.concatScripts) {
            return $.gulp.src($.config.destPath + '/html/**/*.html')
                .pipe($.gulpPlugin.htmlReplace({
                    scripts: '../' + $.config.scriptsPath + '/all.min.js'
                }))
                .pipe($.gulp.dest($.config.destPath + '/html/'));
        }

        return $.gulp.src($.config.destPath + '/html/**/*.html')
            .pipe($.gulp.dest($.config.destPath + '/html/'));
    });
};