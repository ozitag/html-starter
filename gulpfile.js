"use strict";

global.$ = {
    gulp: require('gulp'),
    gulpPlugin: require('gulp-load-plugins')(),
    bs: require('browser-sync'),
    fs: require('fs'),
    del: require('del'),
    tasks: require('./gulp/tasks.js'),
    config: require('./config/config.json'),
    merge: require('merge-stream'),
    argv: require('yargs').argv
};

if ($.config.criticalCss) {
    $.critical = require('critical').stream
}

$.tasks.forEach(taskPath => {
    require(taskPath)()
});

$.gulp.task('dev', $.gulp.series(
    $.gulp.parallel('clean'),
    $.gulp.parallel('hbs', 'styles', 'scripts', 'scripts:libs','hbs', 'svg', 'svgInline', 'pngSprite'),
    $.gulp.parallel('prepareHtml'),
    $.gulp.parallel('watch', 'serve')
));

$.gulp.task('build', $.gulp.series(
    $.gulp.parallel('clean'),
    $.gulp.parallel('styles', 'scripts', 'scripts:libs'),
    $.gulp.parallel('hbs', 'svg', 'svgInline', 'pngSprite'),
    $.gulp.parallel('prepareHtml'),
    $.gulp.parallel('dist', 'content', 'copyMetaFiles'),
    $.gulp.parallel('tinypng:meta', 'tinypng:content', 'prepareJs', 'replaceHtml', 'criticalCss'),
));