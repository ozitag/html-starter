module.exports = () => {
    $.gulp.task('tinypng:meta', () => {
        if (!$.config.tinyPng) {
            return $.gulp.src($.config.destPath + '/' + $.config.metaPath + '/*.{png,jpg,gif}')
                .pipe($.gulp.dest($.config.destPath + '/' + $.config.metaPath));
        }

       return $.gulp.src($.config.destPath + '/' + $.config.metaPath + '/*.{png,jpg,gif}')
            .pipe($.gulpPlugin.tinypngNokey())
            .pipe($.gulp.dest($.config.destPath + '/' + $.config.metaPath));
    });

    $.gulp.task('tinypng:content', () => {
        if (!$.config.tinyPng) {
            return $.gulp.src($.config.destPath + '/' + $.config.contentPath + '/images/**/*.{png,jpg,gif}')
                .pipe($.gulp.dest($.config.destPath + '/' + $.config.contentPath + '/images'));
        }

        return $.gulp.src($.config.destPath + '/' + $.config.contentPath + '/images/**/*.{png,jpg,gif}')
            .pipe($.gulpPlugin.tinypngNokey())
            .pipe($.gulp.dest($.config.destPath + '/' + $.config.contentPath + '/images'));
    });
};