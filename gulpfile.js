/**
 *  @author Vital Ozierski
 *  @copyright BLAKIT
 *  Web Starter Kit
 */
'use strict';

const config = require('./config.json');
const del = require('del');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const runSequence = require('run-sequence');
const gulp = require('gulp');
const size = require('gulp-size');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const compileHandlebars = require('gulp-compile-handlebars');
const jshint = require('gulp-jshint');
const csslint = require('gulp-csslint');
const htmlhint = require('gulp-htmlhint');
const gutil = require('gulp-util');

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
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.reporter())
        .pipe(reload({stream: true, once: true}))
        .pipe(size({title: 'styles'}));
});

gulp.task('static', function () {
    return gulp.src([
        '!./' + config.sourcePath + '/' + config.staticPath + '/css',
        '!./' + config.sourcePath + '/' + config.staticPath + '/css/**',
        '!./' + config.sourcePath + '/' + config.staticPath + '/js',
        '!./' + config.sourcePath + '/' + config.staticPath + '/js/**',
        './' + config.sourcePath + '/' + config.staticPath + '/**'
    ])
        .pipe(gulp.dest('./' + config.tmpPath + '/static/'))
        .pipe(reload({stream: true, once: true}));
});

gulp.task('hintjs', function () {
    return gulp.src(['./' + config.sourcePath + '/' + config.staticPath + '/js/**', '!./' + config.sourcePath + '/' + config.staticPath + '/js/libs/**'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', ['hintjs'], function () {
    return gulp.src(['./' + config.sourcePath + '/' + config.staticPath + '/js/**'])
        .pipe(gulp.dest(config.tmpPath + '/static/js'))
        .pipe(reload({stream: true, once: true}));
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
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter())
        .pipe(gulp.dest(config.tmpPath + '/html'))
        .pipe(reload({stream: true, once: true}))
});

gulp.task('serve', ['hbs', 'static', 'scripts', 'styles'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        browser: "Google Chrome Canary",
        server: [config.tmpPath, config.sourcePath]
    });

    gulp.watch([config.sourcePath + '/' + config.stylesPath + '/**/*.{scss, sass, css}'], ['styles']);
    gulp.watch([config.sourcePath + '/' + config.scriptsPath + '/**/*.js'], ['scripts']);
    gulp.watch([config.sourcePath + '/' + config.hbsPath + '/**/*'], ['hbs']);
});

function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        issues.forEach(function (issue) {
            gutil.log(gutil.colors.cyan('[gulp-htmllint] ') + gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gutil.colors.red('(' + issue.code + ') ' + issue.msg));
        });

        process.exitCode = 1;
    }
}

/*
 gulp.task('watch:styles', function (cb) {
 runSequence('styles', 'csslint', cb);
 });
 */