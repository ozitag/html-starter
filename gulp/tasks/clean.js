module.exports = () => {
  $.gulp.task('clean',
    $.del.bind(null, [$.config.tmpPath, $.config.destPath], { dot: true }),
  );
};