module.exports = () => {
    $.gulp.task('serve', function () {
        console.log($.gulpPlugin);

        $.bs.init({
            notify: false,
            logPrefix: 'WSK',
            logFileChanges: false,
            server: [$.config.tmpPath, $.config.sourcePath],
            startPath: '/html/',
            logSnippet: false
        });
    });
};