/**
 *  @author Vital Ozierski
 *  @copyright BLAKIT
 *  Web Starter Kit
 */
'use strict';

const config = require('./config/config.json');
const del = require('del');
const fs = require('fs');
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
const svgSprite = require('gulp-svg-sprite');
const debug = require('gulp-debug');
const svgmin = require('gulp-svgmin');
const imagemin = require('gulp-imagemin');
const w3cjs = require('gulp-w3cjs');
const ftp = require('gulp-ftp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const htmlReplace = require('gulp-html-replace');
const cssmin = require('gulp-cssmin');
const domSrc = require('gulp-dom-src');
const cheerio = require('gulp-cheerio');
const Finder = require('fs-finder');
const trim = require('gulp-trim');
const cssLintReporter = require('gulp-csslint-report');

gulp.task('clean',
    del.bind(null, [config.tmpPath, config.destPath], {dot: true})
);

gulp.task('styles', function () {
    return gulp.src('./' + config.sourcePath + '/' + config.stylesPath + '/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 100 versions'],
            cascade: 1
        }))
        .pipe(gulp.dest(config.tmpPath + '/' + config.staticPath + '/css'))
        .pipe(csslint('./config/.csslintrc'))
        .pipe(cssLintReporter())
        .pipe(reload({stream: true, once: true}))
        .pipe(size({title: 'styles'}));
});

gulp.task('static', function () {
    return gulp.src([
        '!./' + config.sourcePath + '/' + config.staticPath + '/css',
        '!./' + config.sourcePath + '/' + config.staticPath + '/css/**',
        '!./' + config.sourcePath + '/' + config.staticPath + '/js',
        '!./' + config.sourcePath + '/' + config.staticPath + '/js/**',
        '!./' + config.sourcePath + '/' + config.staticPath + '/svg',
        '!./' + config.sourcePath + '/' + config.staticPath + '/svg/**',
        './' + config.sourcePath + '/' + config.staticPath + '/**'
    ])
        .pipe(gulp.dest('./' + config.tmpPath + '/' + config.staticPath + '/'))
        .pipe(reload({stream: true, once: true}));
});

gulp.task('hintjs', function () {
    return gulp.src(['./' + config.sourcePath + '/' + config.staticPath + '/js/**', '!./' + config.sourcePath + '/' + config.staticPath + '/js/libs/**'])
        .pipe(jshint('./config/.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', ['hintjs'], function () {
    return gulp.src(['./' + config.sourcePath + '/' + config.staticPath + '/js/**'])
        .pipe(gulp.dest(config.tmpPath + '/' + config.staticPath + '/js/'))
        .pipe(reload({stream: true, once: true}));
});

gulp.task('fix_js_src', function () {
    return gulp.src(config.tmpPath + '/html/**/*.html')
        .pipe(cheerio({
            run: function ($) {
                $('script').each(function () {
                    var src = $(this).attr('src');
                    if (src !== undefined && src.substr(0, 5) !== 'http:' && src.substr(0, 6) !== 'https:') {
                        src = '../' + config.scriptsPath + '/' + src;
                    }
                    $(this).attr('src', src);
                });
            },
            parserOptions: {
                decodeEntities: false
            }
        }))
        .pipe(gulp.dest(config.tmpPath + '/html/'));
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
                        accum += block.fn(i + 1);
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
        .pipe(htmlhint('./config/.htmlhintrc'))
        .pipe(htmlhint.reporter())
        .pipe(trim())
        .pipe(gulp.dest(config.tmpPath + '/html'))
        .pipe(reload({stream: true, once: true}))
});
gulp.task('build_html', function () {
    runSequence('hbs', 'fix_js_src');
});


gulp.task('content', function () {
    return gulp.src(config.sourcePath + '/' + config.contentPath + '/**/*')
        .pipe(gulp.dest(config.tmpPath + '/html/'));
});

gulp.task('prepare', ['clean'], function () {
    runSequence('hbs', 'fix_js_src', 'static', 'scripts', 'styles', 'svg', 'prepare_meta');
});

gulp.task('serve', ['prepare'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        browser: "Google Chrome Canary",
        server: [config.tmpPath, config.sourcePath],
        startPath: '/html/'
    });

    gulp.watch([config.sourcePath + '/' + config.stylesPath + '/**/*.{scss, sass, css}'], ['styles']);
    gulp.watch([config.sourcePath + '/' + config.scriptsPath + '/**/*.js'], ['scripts']);
    gulp.watch([config.sourcePath + '/' + config.hbsPath + '/**/*'], ['build_html']);
    gulp.watch([config.sourcePath + '/' + config.svgPath + '/*.svg'], ['svg']);
    gulp.watch([config.sourcePath + '/' + config.metaPath + '/*.{png,jpg,jpeg}'], ['prepare_meta']);
});

gulp.task('svg', function () {
    return gulp.src(config.sourcePath + '/' + config.svgPath + '/**/*.svg')
        .pipe(svgmin())
        .pipe(svgSprite({
            mode: {
                css: {
                    "spacing": {
                        "padding": 5
                    },
                    layout: "diagonal",
                    dest: "./",
                    sprite: config.tmpPath + '/' + config.staticPath + '/images/svg/sprite.svg',
                    bust: false,
                    render: {
                        "scss": {
                            "dest": config.sourcePath + '/' + config.stylesPath + "/svg/_sprite.scss",
                            "template": "./config/sprite-template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest("./"));
});

gulp.task('min_images', function () {
    return gulp.src(config.tmpPath + '/' + config.staticPath + '/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(config.tmpPath + '/' + config.staticPath + '/images'));
});

gulp.task('dist', function () {
    return gulp.src([
        config.tmpPath + '/**/*',
        '!' + config.tmpPath + '/' + config.scriptsPath + '/**/*'
    ]).pipe(gulp.dest(config.destPath + '/'));
});

gulp.task('dist_content', function () {
    return gulp.src(config.sourcePath + '/' + config.contentPath + '/**/*')
        .pipe(gulp.dest(config.destPath + '/' + config.contentPath));
});


gulp.task('prepare_js', function () {
    const buildPath = config.destPath + '/' + config.scriptsPath + '/';

    if (config.concatScripts == false) {
        return gulp.src(config.tmpPath + '/' + config.scriptsPath + '/**/*').pipe(gulp.dest(buildPath));
    }
    else {
        return domSrc({file: config.tmpPath + '/html/home.html', selector: 'script', attribute: 'src'})
            .pipe(concat('all.js'))
            .pipe(gulp.dest(buildPath))
            .pipe(uglify())
            .pipe(rename('all.min.js'))
            .pipe(gulp.dest(buildPath));
    }
});

gulp.task('prepare_html', function () {
    var pipe = gulp.src(config.destPath + '/html/**/*.html');
    if (config.concatScripts) {
        pipe.pipe(htmlReplace({
            scripts: '../' + config.scriptsPath + '/all.min.js'
        }))
    }
    pipe.pipe(gulp.dest(config.destPath + '/html/'));
    return pipe;
});

gulp.task('prepare_css', function () {
    return config.cssMin ? gulp.src(config.destPath + '/' + config.stylesPath + '/**/*.css')
        .pipe(cssmin()).pipe(gulp.dest(config.destPath + '/' + config.stylesPath)) :
        gulp.src(config.destPath + '/' + config.stylesPath + '/**/*.css')
        .pipe(gulp.dest(config.destPath + '/' + config.stylesPath))
});

gulp.task('prepare_meta', function () {
    var files = Finder.in('./app/.meta/').findFiles();
    var templates = Finder.in('./app/templates/').findFiles();

    var html = "";

    var pageNames = {};

    for (var i = 0; i < templates.length; i++) {
        var template_path = templates[i];
        var template_p = Math.max(template_path.lastIndexOf("/"), template_path.lastIndexOf("\\"));
        var template_fileName = template_path.substr(template_p + 1);
        var template_desc = template_fileName.substring(template_fileName, template_fileName.lastIndexOf('.'));

        if (template_desc == 'index') {
            continue;
        }

        var file = fs.readFileSync(templates[i]).toString();

        if (file.indexOf('{{!') != -1) {
            pageNames[template_desc] = file.substring(3, file.indexOf("}}"));
        }
    }

    for (var j = 0; j < files.length; j++) {
        var path = files[j];

        var dir = path.indexOf('.meta');
        var dirPath = path.substr(dir);
        var p = path.lastIndexOf("/");
        var fileName = path.substr(p + 1);
        var desc = fileName.substring(fileName.indexOf('_') + 1, fileName.lastIndexOf('.'));
        var htmlPath = desc + '.html';
        var id = pageNames[desc];

        dirPath = dirPath.replace("\\", '/', dirPath);

        html += '<div class="col-md-3 col-sm-4 col-xs-12"> ' +
            '<div class="page-default__item_title">' + id + '</div>' +
            '<a class="page-default__item js-hover-item" title="' + id + '" href="' + htmlPath + '" style="background: url(../' + dirPath + ')no-repeat top center;"></a>' +
            ' </div>';
    }

    var templateFile = fs.readFileSync('./config/template.html').toString();
    fs.writeFile(config.tmpPath + '/' + 'html/index.html', templateFile.replace('{{items}}', html).replace(/{{siteName}}/g, config.siteName));
});

gulp.task('copyMetaFiles', function () {
    return gulp.src(config.sourcePath + '/' + config.metaPath + '/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(config.destPath + '/' + config.metaPath));
});


gulp.task('ftp', function () {
    var ftpConfig = 'ftp' in config ? config.ftp : null;

    if (ftpConfig === null || ftpConfig.enabled == false) {
        return;
    }

    return gulp.src([config.destPath + '/**/*', '!**/.git/**'], {dot: true})
        .pipe(ftp({
            host: ftpConfig.host,
            user: ftpConfig.login,
            pass: ftpConfig.password,
            remotePath: ftpConfig.remotePath
        }))
        .pipe(gutil.noop());
});

gulp.task('build', function () {
    runSequence('clean', 'hbs', 'fix_js_src', 'static', 'scripts', 'styles', 'svg', 'min_images', 'prepare_meta', 'dist', 'dist_content', 'prepare_html', 'prepare_css', 'prepare_js', 'copyMetaFiles');
});

gulp.task('default', function () {
    runSequence('clean', 'hbs', 'fix_js_src', 'static', 'scripts', 'styles', 'svg', 'min_images', 'prepare_meta', 'dist', 'dist_content', 'prepare_html', 'prepare_css', 'prepare_js', 'copyMetaFiles', 'ftp')
});