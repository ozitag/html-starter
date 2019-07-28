module.exports = () => {
    $.gulp.task('dist', function () {
        return $.gulp.src([
            $.config.tmpPath + '/**/*',
            '!' + $.config.tmpPath + '/' + $.config.scriptsPath + '/**/*'
        ]).pipe($.gulp.dest($.config.destPath + '/'));
    });
};