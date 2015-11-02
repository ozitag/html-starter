/**
 *  @author Vital Ozierski,
 *  @copyright BLAKIT
 *  Web Starter Kit
 */

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    pagespeed = require('psi'),
    reload = browserSync.reload,
    config = require('./config.json');

// Lint HTML
gulp.task('htmlhint', function () {
    return gulp.src(config.tmpPath + '/**/*.html')
        .pipe(reload({stream: true, once: true}))
        // TODO: Исключить проверку doctype для папки ajax
        .pipe($.htmlhint('.htmlhintrc'))
        .pipe($.htmlhint.reporter());
});

// Lint CSS
gulp.task('csslint', function () {
    return gulp.src([
        config.tmpPath + '/' + config.stylesPath + '/**/*.css',
        '!' + config.tmpPath + '/' + config.stylesPath + '/**/*.min.css',
        '!' + config.tmpPath + '/' + config.stylesPath + '/libs/**'
    ])
        .pipe(reload({stream: true, once: true}))
        .pipe($.csslint('.csslintrc'))
        .pipe($.csslint.reporter());
});

// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src([
        config.sourcePath + '/' + config.scriptsPath + '/**/*.js',
        '!' + config.sourcePath + '/' + config.scriptsPath + '/**/*.min.js',
        '!' + config.sourcePath + '/' + config.scriptsPath + '/libs/**/*.js'
    ])
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'));
});

// Optimize images
gulp.task('images', function () {
    return gulp.src([
        config.sourcePath + '/' + config.imagesPath + '/**/*',
        config.sourcePath + '/' + config.contentPath + '/images/*'
    ], {base: config.sourcePath + '/'})
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.destPath + '/'))
        .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
    return gulp.src([
        config.sourcePath + '/*',
        '!' + config.sourcePath + '/*.html',
        '!' + config.sourcePath + '/' + config.hbsPath
    ], {
        dot: true
    })
        .pipe(gulp.dest(config.destPath))
        .pipe($.size({title: 'copy'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
    return gulp.src([config.sourcePath + '/' + config.fontsPath + '/**'])
        .pipe(gulp.dest(config.destPath + '/' + config.fontsPath))
        .pipe($.size({title: 'fonts'}));
});

// Compile hbs files to html files
gulp.task('hbs', function () {
    var data = {
            title: config.appName,
            combinedNameCSS: config.combinedNameCSS,
            combinedNameJS: config.combinedNameJS
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
        .pipe($.plumber())
        .pipe($.compileHandlebars(data, options))
        .pipe($.rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(gulp.dest(config.tmpPath + '/html'))
        .pipe($.size({title: 'hbs'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
    return $.rubySass(config.sourcePath + '/' + config.stylesPath + '/main.scss', config.sassOptions)
        .on('error', function (err) {
            console.error('Sass error:', err.message);
        })
        .pipe($.autoprefixer({browsers: config.autoprefixerBrowsers}))
        .pipe(gulp.dest(config.destPath + '/' + config.stylesPath))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmpPath + '/' + config.stylesPath))
        .pipe($.size({title: 'styles'}));
});

// Compile twbs styles
gulp.task('styles:twbs', function () {

    return $.rubySass(config.sourcePath + '/' + config.stylesPath + '/libs/twbs.scss', config.sassOptions)
        .on('error', function (err) {
            console.error('Sass error:', err.message);
        })
        .pipe($.autoprefixer({browsers: config.autoprefixerBrowsers}))
        .pipe(gulp.dest(config.destPath + '/' + config.stylesPath + '/libs'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmpPath + '/' + config.stylesPath + '/libs'))
        // Minify twbs styles
        .pipe($.if('*.css', $.cssmin(config.cssminOptions)))
        .pipe($.rename(function (path) {
            path.basename += '.min'
        }))
        .pipe(gulp.dest(config.destPath + '/' + config.stylesPath + '/libs'))
        .pipe($.size({title: 'styles:twbs'}));
});

// Scripts task
gulp.task('scripts', function () {
    return gulp.src(config.sourcePath + '/' + config.scriptsPath + '/**/*.js')
        .pipe(gulp.dest(config.destPath + '/' + config.scriptsPath))
        .pipe($.size({title: 'scripts'}));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
    var assets = $.useref.assets({
            searchPath: [
                config.destPath + '/html'
            ],
            noconcat: true
        }),
        srcStyles = [
            '**/' + config.stylesPath + '/**/*.css',
            '!**/' + config.stylesPath + '/**/*.min.css',
            '!**/' + config.stylesPath + '/libs/**/*.css'
        ],
        srcScripts = [
            '**/' + config.scriptsPath + '/**/*.js',
            '!**/' + config.scriptsPath + '/**/*.min.js',
            '!**/' + config.scriptsPath + '/libs/**/*.js'
        ];

    return gulp.src(config.tmpPath + '/**/*.html')
        .pipe($.replace('twbs.css', 'twbs.min.css'))
        .pipe($.replace('bootstrap.js', 'bootstrap.min.js'))
        .pipe(assets)
        .pipe($.dedupe({
            same: false
        }))
        // Remove any unused CSS
        .pipe($.if(config.uncss, $.if(srcStyles, $.uncss(config.uncssOptions))))
        .pipe($.if(srcStyles, $.csso()))
        .pipe($.if(srcScripts, $.uglify(config.uglifyOptions)
        ))
        .pipe($.if(
            '*.css',
            $.concat(config.stylesPath + '/' + config.combinedNameCSS)
        ))
        .pipe($.if(
            '*.js',
            $.concat(config.scriptsPath + '/' + config.combinedNameJS)
        ))
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        // Replace hash name in assets
        .pipe($.revReplace())
        // Minify any HTML
        .pipe($.if(config.htmlmin, $.if('*.html', $.htmlmin(config.htmlminOptions)
        )))
        // Output files
        .pipe(gulp.dest(config.destPath))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.destPath))
        .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, [
        config.tmpPath,
        config.destPath + '/*',
        '!' + config.destPath + '/.git'
    ], {dot: true})
);

// Clear gulp-cache cache
gulp.task('clear', function (done) {
    return $.cache.clearAll(done);
});

// Watch files for changes & reload
gulp.task('serve', ['hbs', 'styles', 'styles:twbs'], function () {
    browserSync({
        notify: false,
        // Customize the BrowserSync console logging prefix
        logPrefix: 'WSK',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        // Open to none default browser
        browser: config.browser,
        server: [config.tmpPath, config.sourcePath]
    });

    gulp.watch([config.sourcePath + '/**/*.html'], ['htmlhint']);
    gulp.watch([config.sourcePath + '/' + config.hbsPath + '/**/*.hbs'], ['watch:hbs']);
    gulp.watch([
        config.sourcePath + '/' + config.stylesPath + '/**/*.{scss, sass, css}',
        '!' + config.sourcePath + '/' + config.stylesPath + '/libs/twbs.scss',
        '!' + config.sourcePath + '/' + config.stylesPath + '/libs/_bootstrap-variables.scss'
    ], ['watch:styles']);
    gulp.watch([
        config.sourcePath + '/' + config.stylesPath + '/libs/twbs.scss',
        config.sourcePath + '/' + config.stylesPath + '/libs/_bootstrap-variables.scss'
    ], ['styles:twbs', reload]);
    gulp.watch([config.sourcePath + '/' + config.scriptsPath + '/**/*.js'], ['jshint']);
    gulp.watch([
        config.sourcePath + '/' + config.imagesPath + '/**/*',
        config.sourcePath + '/' + config.contentPath + '/' + config.imagesPath + '/**/*'
    ], reload);

    gulp.watch([config.sourcePath + '/' + config.imagesPath + '/svg/*.svg'], ['svgSprite']);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        // Open to none default browser
        browser: config.browser,
        server: config.destPath
    });
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
    runSequence('hbs', 'styles', 'styles:twbs', 'scripts', ['lint', 'html', 'images', 'fonts', 'copy'], 'w3cjs', cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', ['default'], function (cb) {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        tunnel: true,
        server: [config.destPath],
        open: false
    }, function (err, bs) {
        config.psiConfig.url = bs.options.getIn(['urls', 'tunnel']);
        console.log('PageSpeed running...');
        pagespeed.output(config.psiConfig.url, config.psiConfig, function (err) {
            console.log('PageSpeed done!');
            browserSync.exit();
        });
    });
});

// Validate HTML
gulp.task('w3cjs', function () {
    return;
    return gulp.src(config.destPath + '/**/*.html')
        .pipe($.w3cjs(config.w3cjsOptions));
});

// Helpers
gulp.task('watch:hbs', function (cb) {
    runSequence('hbs', 'htmlhint', cb);
});

gulp.task('watch:styles', function (cb) {
    runSequence('styles', 'csslint', cb);
});

gulp.task('lint', function (cb) {
    runSequence('htmlhint', 'csslint', 'jshint', cb);
});


gulp.task('svgSprite', function () {
    return gulp.src(config.sourcePath + '/' + config.imagesPath + '/svg/*.svg')
        .pipe($.svgSprite({
            mode: {
                css: {
                    "spacing": {
                        "padding": 5
                    },
                    layout: "diagonal",
                    dest: "./",
                    sprite: config.sourcePath + '/' + config.imagesPath + "/svg/build/sprite.svg",
                    bust: false,
                    render: {
                        "scss": {
                            "dest": config.sourcePath + '/' + config.stylesPath + "/svg/_sprite.scss",
                            "template": config.sourcePath + '/' + config.stylesPath + "/svg/sprite-template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest("./"));
});

gulp.task('sprite', ['svgSprite']);


// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
