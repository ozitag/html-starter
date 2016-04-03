/**
 *  @author Vital Ozierski
 *  @copyright BLAKIT
 *  Web Starter Kit
 */
'use strict';

const config = require('./config.json');
const del = require('del');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const gulp = require('gulp');
const size = require('gulp-size');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const compileHandlebars = require('gulp-compile-handlebars');

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
        .pipe(gulp.dest(config.tmpPath + '/static/css'))
        .pipe(size({title: 'styles'}));
});

gulp.task('static', function () {
    return gulp.src([
        '!./' + config.sourcePath + '/' + config.staticPath + '/css',
        '!./' + config.sourcePath + '/' + config.staticPath + '/css/**',
        './' + config.sourcePath + '/' + config.staticPath + '/**'
    ]).pipe(gulp.dest('./' + config.tmpPath + '/static/'));
});

gulp.task('hbs', function () {
    const data = {
            title: config.appName
        },
        options = {
            ignorePartials: true,
            batch: [
                config.sourcePath + '/' + config.hbsPath + '/layouts',
                config.sourcePath + '/' + config.hbsPath + '/partials'
            ],
            helpers: {
                times: function (n, block) {
                    var accum = '';
                    for (var i = 0; i < n; ++i)
                        accum += block.fn(i);
                    return accum;
                },
                ifCond: function (v1, v2, options) {
                    if (v1 === v2) {
                        return options.fn(this);
                    }
                    return options.inverse(this);
                }
            }
        };

    return gulp.src([
            config.sourcePath + '/' + config.hbsPath + '/**/*.hbs',
            '!' + config.sourcePath + '/' + config.hbsPath + '/layouts/**/*.hbs',
            '!' + config.sourcePath + '/' + config.hbsPath + '/partials/**/*.hbs'
        ])
        .pipe(plumber())
        .pipe(compileHandlebars(data, options))
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(gulp.dest(config.tmpPath + '/html'))
});

gulp.task('serve', ['hbs', 'static', 'styles'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        browser: "Google Chrome Canary",
        server: [config.tmpPath, config.sourcePath]
    });

    gulp.watch([config.sourcePath + '/' + config.stylesPath + '/**/*.{scss, sass, css}'], ['styles']);
});

/*
gulp.task('watch:styles', function (cb) {
    runSequence('styles', 'csslint', cb);
});
*/