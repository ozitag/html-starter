module.exports = () => {
  $.gulp.task('clean', async () => {
    await $.fs.remove($.config.tmpPath);
    await $.fs.remove($.config.destPath);
  })
}