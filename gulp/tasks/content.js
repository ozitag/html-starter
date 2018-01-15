module.exports = () => {
    $.gulp.task('content', function () {
        return $.gulp.src($.config.sourcePath + '/' + $.config.contentPath + '/**/*')
            .pipe($.gulp.dest($.config.destPath + '/' + $.config.contentPath));
    });
};