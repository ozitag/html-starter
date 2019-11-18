module.exports = () => {
  $.gulp.task('ftp', () => {
    const ftpConfig = 'ftp' in $.config ? $.config.ftp : null

    if (ftpConfig === null || ftpConfig.enabled === false) {
      return
    }

    return $.combiner(
      $.gulp.src([$.config.destPath + '/**/*', '!**/.git/**'], { dot: true }),
      $.gulpPlugin.ftp({
        host: ftpConfig.host,
        user: ftpConfig.login,
        pass: ftpConfig.password,
        remotePath: ftpConfig.remotePath,
      }),
      $.gulpPlugin.util.noop(),
    )
  })

  $.gulp.task('sftp', () => {
    const ftpConfig = 'sftp' in $.config ? $.config.sftp : null

    if (ftpConfig === null || ftpConfig.enabled === false) {
      return false
    }

    return $.combiner(
      $.gulp.src([$.config.destPath + '/**/*', '!**/.git/**'], { dot: true }),
      $.gulpPlugin.sftpFix({
        host: ftpConfig.host,
        user: ftpConfig.login,
        pass: ftpConfig.password,
        remotePath: ftpConfig.remotePath,
      }),
      $.gulpPlugin.util.noop(),
    )
  })
}