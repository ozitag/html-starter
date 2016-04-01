/**
 *  @author Vital Ozierski
 *  @copyright BLAKIT
 *  Web Starter Kit
 */
'use strict';

var config = require('./config.json');
var del = require('del');
var gulp = require('gulp');
var size = require('gulp-size');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Clean dist and tmp folder
gulp.task('clean',
    del.bind(null, [config.tmpPath, config.destPath], {dot: true})
);

gulp.task('styles', function () {
    return gulp.src('./' + config.sourcePath + '/' + config.stylesPath + '/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 100 versions'],
            cascade: 1
        }))
        .pipe(gulp.dest(config.tmpPath + '/css'))
        .pipe(size({title: 'styles'}));
});