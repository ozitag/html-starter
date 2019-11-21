module.exports = () => {
  const sourcePath = `${$.config.sourcePath}/${$.config.staticPath}/js`
  const destPath = `${$.config.outputPath}/${$.config.staticPath}/js`

  const sourceMapConfig = {
    filename: '[name].map',
    exclude: /(libs\.js|polyfills\.js)/,
  }
  const minifyConfig = {
    parallel: true,
    terserOptions: {
      output: {
        comments: false,
      },
    },
    extractComments: false,
  }
  const babelConfig = {
    test: /\.js$/,
    exclude: /libs\.js/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  }
  const watchConfig = {
    files: [`${sourcePath}/**/*.js`],
    dirs: [`${sourcePath}`],
  }

  const config = {
    output: {
      filename: '[name]',
      path: $.path.resolve(`${destPath}/`),
    },
    module: {
      rules: [],
    },
    plugins: [],
    optimization: {
      minimizer: [],
    },
    stats: 'errors-warnings',
  }

  if ($.argv._[0] === 'build') {
    config.mode = 'production'

    if ($.config.babel) {
      config.module.rules.push(
        babelConfig,
      )
    }

    if ($.config.jsMin) {
      minifyConfig.test = /\.js$/
    } else {
      minifyConfig.test = /(libs\.js|polyfills\.js)/
    }
    config.optimization.minimize = true
    config.optimization.minimizer.push(
      new $.wpTerserPlugin(minifyConfig),
    )
  } else {
    config.mode = 'development'
    config.watch = true
    config.module.rules.push(
      babelConfig,
    )
    config.plugins.push(
      new $.webpack.SourceMapDevToolPlugin(sourceMapConfig),
    )
    config.plugins.push(
      new $.wpWatchPlugin(watchConfig),
    )
    minifyConfig.test = /(libs\.js|polyfills\.js)/
    config.optimization.minimize = true
    config.optimization.minimizer.push(
      new $.wpTerserPlugin(minifyConfig),
    )
  }

  $.gulp.task('scripts', async () => {
    config.entry = getEntry()

    return $.gulp.src(`${sourcePath}/**`)
      .pipe($.webpackStream(
        config, $.webpack,
      ))
      .pipe($.gulp.dest(`${destPath}/`))
  })

  function getEntry() {
    return $.glob.sync(`${sourcePath}/**/*`, { nodir: true })
      .reduce((acc, path) => {
        const entryPath = path.match(/([\w\d-_]+)\.js$/i)[0]
        acc[entryPath] = $.path.resolve(path)
        return acc
      }, {})
  }
}
