'use strict'

global.$ = {
  gulp: require('gulp'),
  gulpPlugin: require('gulp-load-plugins')(),
  bs: require('browser-sync'),
  fs: require('fs'),
  del: require('del'),
  tasks: require('./gulp/tasks.js'),
  config: require('./config/config.json'),
  merge: require('merge-stream'),
  argv: require('yargs').argv,
  uglifyEs: require('gulp-uglify-es'),
}

if ($.config.criticalCss) {
  $.critical = require('critical').stream
}

$.tasks.forEach((taskPath) => {
  require(taskPath)()
})

$.gulp.task(
  'dev',
  $.gulp.series(
    $.gulp.parallel('clean'),
    $.gulp.parallel('styles', 'scripts:libs', 'scripts'),
    $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images'),
    $.gulp.parallel('prepareHtmlDev'),
    $.gulp.parallel('content'),
    $.gulp.parallel('watch', 'serve'),
  ),
)

$.gulp.task(
  'build',
  $.gulp.series(
    $.gulp.parallel('clean'),
    $.gulp.parallel('styles', 'scripts:libs', 'scripts'),
    $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite', 'static:fonts', 'static:images'),
    $.gulp.parallel('prepareHtmlBuild'),
    $.gulp.parallel('dist', 'content', 'copyMetaFiles'),
    $.gulp.parallel('imagemin:meta', 'imagemin:content', 'prepareJs', 'criticalCss'),
    $.gulp.parallel('replaceHtml'),
  ),
)
