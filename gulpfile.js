'use strict'

global.$ = {
  gulp: require('gulp'),
  gulpPlugin: require('gulp-load-plugins')(),
  bs: require('browser-sync'),
  fs: require('fs-extra'),
  tasks: require('./gulp/tasks.js'),
  config: require('./config/config.json'),
  combiner: require('stream-combiner2'),
  webpack: require('webpack-stream'),
  tildeImporter: require('node-sass-tilde-importer'),
  argv: require('yargs').argv,
  uglifyEs: require('gulp-uglify-es'),
}

if ($.config.criticalCss) {
  $.critical = require('critical').stream
}

$.tasks.forEach(task => require(task)());

$.gulp.task('dev', $.gulp.series(
  $.gulp.parallel('clean'),
  $.gulp.parallel('hbs', 'styles', 'scripts', 'scripts:libs', 'hbs', 'svg', 'svgInline', 'pngSprite'),
  $.gulp.parallel('prepareHtmlDev'),
  $.gulp.parallel('watch', 'serve'),
))

$.gulp.task('build', $.gulp.series(
  $.gulp.parallel('clean'),
  $.gulp.parallel('styles', 'scripts:libs', 'scripts'),
  $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images', 'static:videos'),
  $.gulp.parallel('prepareHtmlBuild'),
  $.gulp.parallel('dist', 'content', 'copyMetaFiles'),
  $.gulp.parallel('imagemin:meta', 'imagemin:content', 'prepareJs', 'criticalCss'),
  $.gulp.parallel('replaceHtml'),
))
