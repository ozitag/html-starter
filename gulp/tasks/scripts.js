module.exports = () => {
  const sourceJsPath = `${$.config.sourcePath}/${$.config.staticPath}/js`
  const destJsPath = `${$.config.tmpPath}/${$.config.staticPath}/js`
  const config = {
    entry: {
      vendors: [
        $.path.resolve('node_modules/html5shiv/dist/html5shiv.js'),
        $.path.resolve('node_modules/jquery/dist/jquery.js'),
        $.path.resolve('node_modules/svg4everybody/dist/svg4everybody.js'),
      ],
      polyfills: $.path.resolve(`${sourceJsPath}/helpers/polyfills.js`),
      preloader: $.path.resolve(`${sourceJsPath}/helpers/preloader.js`),
      scrollControl: $.path.resolve(`${sourceJsPath}/helpers/scroll-control.js`),
      ui: $.path.resolve(`${sourceJsPath}/ui.js`),
    },
    output: {
      filename: '[name].js',
      path: $.path.resolve(`${destJsPath}/`),
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }],
    },
    plugins: [],
  }

  if ($.argv._[0] === 'build') {
    config.mode = 'production'
  } else {
    config.mode = 'development'
    config.plugins.push(
      new $.webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        exclude: ['vendors.js'],
      }),
    )
  }

  $.gulp.task('scripts', () => new Promise(resolve => {
    $.gulp.src(`${sourceJsPath}/**`)
      .pipe($.webpackStream(config, $.webpack))
      .pipe($.gulp.dest(`${destJsPath}/`))
      .pipe($.bs.reload({ stream: true }))
      .pipe(resolve())
  }))
}
