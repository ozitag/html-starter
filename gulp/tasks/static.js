module.exports = () => {
    $.gulp.task('static:fonts', function () {
        return $.gulp.src('./' + $.config.sourcePath + '/' + $.config.staticPath + '/fonts/**/*')
            .pipe($.gulp.dest('./' + $.config.tmpPath + '/' + $.config.staticPath + '/fonts'))
            .pipe($.bs.reload({stream: true}));
    });

    $.gulp.task('static:images', function () {
        return $.gulp.src('./' + $.config.sourcePath + '/' + $.config.staticPath + '/images/**/*')
            .pipe($.gulp.dest('./' + $.config.tmpPath + '/' + $.config.staticPath + '/images'))
            .pipe($.bs.reload({stream: true}));
    });
};