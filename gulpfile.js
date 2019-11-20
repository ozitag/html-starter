'use strict'

global.$ = {
  gulp: require('gulp'),
  gulpPlugin: require('gulp-load-plugins')(),
  bs: require('browser-sync'),
  fs: require('fs'),
  del: require('del'),
  path: require('path'),
  tasks: require('./gulp/tasks.js'),
  merge: require('merge-stream'),
  argv: require('yargs').argv,
  tildeImporter: require('node-sass-tilde-importer'),
  webpack: require('webpack'),
  webpackStream: require('webpack-stream'),
}

$.config = JSON.parse(
  $.fs.readFileSync('./config/config.json'),
)
$.config.outputPath = $.argv._[0] === 'build' ?
  $.config.destPath : $.config.tmpPath

if ($.config.criticalCss) {
  $.critical = require('critical').stream
}

$.tasks.forEach((taskPath) => {
  require(taskPath)()
})

$.gulp.task('dev', done => {
  $.gulp.series('clean',
    $.gulp.parallel('styles', 'scripts'),
    $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images', 'content'),
    $.gulp.parallel('prepareHtmlDev'),
    $.gulp.parallel('watch', 'serve'),
  )(done)
})

$.gulp.task('build', done => {
  $.gulp.series('clean',
    $.gulp.parallel('styles', 'scripts'),
    $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images'),
    $.gulp.parallel('prepareHtmlBuild'),
    $.gulp.parallel('content', 'copyMetaFiles'),
    $.gulp.parallel('imagemin:meta', 'imagemin:content', 'criticalCss'),
    $.gulp.parallel('replaceHtml'),
  )(done)
})
