module.exports = () => {
    $.gulp.task('replaceHtml', () => {
        return $.gulp.src($.config.destPath + '/html/**/*.html')
            .pipe($.gulpPlugin.htmlReplace({
                scripts: '../' + $.config.scriptsPath + '/all.min.js'
            }))
            .pipe($.gulp.dest($.config.destPath + '/html/'));
    });
};