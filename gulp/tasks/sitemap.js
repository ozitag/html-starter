const gulp = require('gulp');
const sitemap = require('gulp-sitemap');
const save = require('gulp-save');

module.exports = () => {
  $.gulp.task('sitemap', () => {
    return gulp.src([
      'dist/**/*.html',
      '!dist/404/index.html',
    ], {
      read: false,
    }).pipe(save('before-sitemap'))
      .pipe(sitemap({
        siteUrl: $.config.siteUrl,
      }))
      .pipe(gulp.dest('./dist'))
      .pipe(save.restore('before-sitemap'));
  });
};
