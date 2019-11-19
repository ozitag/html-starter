'use strict'

global.$ = {
  gulp: require('gulp'),
  gulpPlugin: require('gulp-load-plugins')(),
  bs: require('browser-sync'),
  fs: require('fs-extra'),
  path: require('path'),
  tasks: require('./gulp/tasks.js'),
  config: require('./config/config.json'),
  merge: require('merge-stream'),
  argv: require('yargs').argv,
  tildeImporter: require('node-sass-tilde-importer'),
  webpack: require('webpack'),
  webpackStream: require('webpack-stream'),
}

if ($.config.criticalCss) {
  $.critical = require('critical').stream
}

$.tasks.forEach((taskPath) => {
  require(taskPath)();
})

$.gulp.task('dev', $.gulp.series(
  $.gulp.parallel('clean'),
  $.gulp.parallel('styles', 'scripts'),
  $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images', 'content'),
  $.gulp.parallel('prepareHtmlDev'),
  $.gulp.parallel('watch', 'serve'),
))

$.gulp.task('build', $.gulp.series(
  $.gulp.parallel('clean'),
  $.gulp.parallel('styles', 'scripts'),
  $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images'),
  $.gulp.parallel('prepareHtmlBuild'),
  $.gulp.parallel('dist', 'content', 'copyMetaFiles'),
  $.gulp.parallel('imagemin:meta', 'imagemin:content', 'criticalCss'),
  $.gulp.parallel('replaceHtml'),
))
