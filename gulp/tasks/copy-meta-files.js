module.exports = () => {
    $.gulp.task('copyMetaFiles', function () {
        return $.gulp.src($.config.sourcePath + '/' + $.config.metaPath + '/*')
            .pipe($.gulp.dest($.config.destPath + '/' + $.config.metaPath));
    });
};