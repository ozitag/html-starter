module.exports = () => {
    $.gulp.task('imagemin:meta', () => {
        if (!$.config.imagemin) {
            return $.gulp.src($.config.destPath + '/' + $.config.metaPath + '/*.{png,jpg,gif}')
                .pipe($.gulp.dest($.config.destPath + '/' + $.config.metaPath));
        }

       return $.gulp.src($.config.destPath + '/' + $.config.metaPath + '/*.{png,jpg,gif}')
           .pipe($.gulpPlugin.imagemin({
               interlaced: true,
               progressive: true,
               optimizationLevel: 5
           }))
            .pipe($.gulp.dest($.config.destPath + '/' + $.config.metaPath));
    });

    $.gulp.task('imagemin:content', () => {
        if (!$.config.imagemin) {
            return $.gulp.src($.config.destPath + '/' + $.config.contentPath + '/images/**/*.{png,jpg,gif}')
                .pipe($.gulp.dest($.config.destPath + '/' + $.config.contentPath + '/images'));
        }

        return $.gulp.src($.config.destPath + '/' + $.config.contentPath + '/images/**/*.{png,jpg,gif}')
            .pipe($.gulpPlugin.imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 5
            }))
            .pipe($.gulp.dest($.config.destPath + '/' + $.config.contentPath + '/images'));
    });
};