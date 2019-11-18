module.exports = () => {
  $.gulp.task('serve', () => {
    $.bs.init({
      notify: false,
      logPrefix: 'WSK',
      logFileChanges: false,
      server: [$.config.tmpPath, $.config.sourcePath],
      startPath: '/html/',
      logSnippet: false,
    });
  });
}