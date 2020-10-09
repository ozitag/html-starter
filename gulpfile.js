'use strict';

global.$ = {
  gulp: require('gulp'),
  nop: require('gulp-nop'),
  gulpPlugin: require('gulp-load-plugins')(),
  sass: require('gulp-sass'),
  webp: require('gulp-webp'),
  bs: require('browser-sync'),
  fs: require('fs'),
  glob: require('glob'),
  del: require('del'),
  path: require('path'),
  tasks: require('./gulp/tasks.js'),
  merge: require('merge-stream'),
  argv: require('yargs').argv,
  tildeImporter: require('node-sass-tilde-importer'),
  webpack: require('webpack'),
  webpackStream: require('webpack-stream'),
  wpTerserPlugin: require('terser-webpack-plugin'),
};
$.sass.compiler = require('dart-sass');

$.config = JSON.parse(
  $.fs.readFileSync('./config/config.json'),
);
$.config.buildMode = $.argv._[0].match(/build|build-prod/) ? 'prod' : 'dev';
$.config.outputPath = $.config.buildMode === 'prod' ?
  $.config.destPath : $.config.tmpPath;

if ($.config.criticalCss) {
  $.critical = require('critical').stream;
}

$.tasks.forEach((taskPath) => {
  require(taskPath)();
});

$.gulp.task('dev', done => {
  $.gulp.series('clean',
    $.gulp.parallel('styles', 'scripts'),
    $.gulp.parallel('hbs', 'pngSprite', 'svgSprite', 'svgInline', 'assets'),
    $.gulp.parallel('prepareHtmlDev'),
    $.gulp.parallel('watch', 'serve'),
  )(done);
});

$.gulp.task('build', done => {
  $.gulp.series('clean',
    $.gulp.parallel('styles', 'scripts'),
    $.gulp.parallel('hbs', 'pngSprite', 'svgSprite', 'svgInline', 'assets'),
    $.gulp.parallel('imageMin', 'criticalCss'),
    $.gulp.parallel('prepareHtmlBuild', 'webp'),
    $.gulp.parallel('meta'),
  )(done);
});

$.gulp.task('build-prod', done => {
  $.gulp.series('clean',
    $.gulp.parallel('styles', 'scripts'),
    $.gulp.parallel('hbs-prod', 'svgSprite', 'svgInline', 'pngSprite', 'assets'),
    $.gulp.parallel('prepareHtmlProd', 'webp'),
    $.gulp.parallel('sitemap'),
    $.gulp.parallel('imageMin', 'criticalCss'),
  )(done);
});
