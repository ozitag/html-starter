module.exports = () => {
  const sourceJsPath = `${$.config.sourcePath}/${$.config.staticPath}/js`
  const destJsPath = `${$.config.outputPath}/${$.config.staticPath}/js`
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  const uglifyConfig = {
    test: /\.js$/,
    parallel: true,
    uglifyOptions: {
      output: {
        comments: false,
      },
    },
  }
  const babelConfig = {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  }
  const vendorsConfig = {
    mode: 'production',
    entry: {
      libs: $.path.resolve(`${sourceJsPath}/libs.js`),
    },
    output: {
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'window',
      globalObject: 'this',
      path: $.path.resolve(`${destJsPath}/`),
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin(uglifyConfig),
      ],
    },
  }
  const appConfig = {
    entry: {
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
      rules: [],
    },
    plugins: [],
    optimization: {
      minimizer: [],
    },
  }

  if ($.argv._[0] === 'build') {
    appConfig.mode = 'production'

    if ($.config.babel) {
      appConfig.module.rules.push(
        babelConfig,
      )
    }

    if ($.config.jsMin) {
      appConfig.optimization.minimizer.push(
        new UglifyJsPlugin(uglifyConfig),
      )
    }
  } else {
    appConfig.mode = 'development'
    appConfig.devtool = 'source-map'
    appConfig.watch = true
    appConfig.module.rules.push(
      babelConfig,
    )
  }

  $.gulp.task('scripts', async () => {
    return $.gulp.src(`${sourceJsPath}/**`)
      .pipe($.webpackStream({
        config: [vendorsConfig, appConfig],
      }, $.webpack))
      .pipe($.gulp.dest(`${destJsPath}/`))
  })
}
