module.exports = () => {
    $.gulp.task('ftp', function () {
        const ftpConfig = 'ftp' in $.config ? $.config.ftp : null;

        if (ftpConfig === null || ftpConfig.enabled === false) {
            return;
        }

        return gulp.src([$.config.destPath + '/**/*', '!**/.git/**'], {dot: true})
            .pipe($.gulpPlugin.ftp({
                host: ftpConfig.host,
                user: ftpConfig.login,
                pass: ftpConfig.password,
                remotePath: ftpConfig.remotePath
            }))
            .pipe($.gulpPlugin.util.noop());
    });

    $.gulp.task('sftp', function () {
        const ftpConfig = 'sftp' in $.config ? $.config.sftp : null;

        if (ftpConfig === null || ftpConfig.enabled === false) {
            return;
        }

        return $.gulp.src([$.config.destPath + '/**/*', '!**/.git/**'], {dot: true})
            .pipe($.gulpPlugin.sftpFix({
                host: ftpConfig.host,
                user: ftpConfig.login,
                pass: ftpConfig.password,
                remotePath: ftpConfig.remotePath
            }))
            .pipe($.gulpPlugin.util.noop());
    });
};