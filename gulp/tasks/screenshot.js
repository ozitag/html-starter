module.exports = () => {
    $.gulp.task('screens', function () {
        return $.gulp.src($.config.tmpPath + '/html/*.html')
            .pipe($.gulpPlugin.webshot({
                dest: $.config.tmpPath + '/screens/',
                root: $.config.tmpPath
            }));
    });
};