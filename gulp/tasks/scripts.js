module.exports = () => {
  const sourcePath = `${$.config.sourcePath}/${$.config.staticPath}/js`
  const destPath = `${$.config.outputPath}/${$.config.staticPath}/js`
  const modulesPath = `${sourcePath}/modules`

  const vendorsList = {
    libs: $.path.resolve(`${sourcePath}/libs.js`),
    polyfills: $.path.resolve(`${sourcePath}/polyfills.js`),
  }
  const modulesList = parseModulesPaths(
    JSON.parse($.fs.readFileSync(`${modulesPath}/list.json`)),
  )
  const entry = Object.assign({}, vendorsList, modulesList)
  entry.ui = $.path.resolve(`${sourcePath}/ui`)

  const sourceMapConfig = {
    filename: '[name].js.map',
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

  const config = {
    entry,
    output: {
      filename: '[name].js',
      path: $.path.resolve(`${destPath}/`),
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
      new $.terserPlugin(minifyConfig),
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
    minifyConfig.test = /(libs\.js|polyfills\.js)/
    config.optimization.minimize = true
    config.optimization.minimizer.push(
      new $.terserPlugin(minifyConfig),
    )
  }

  $.gulp.task('scripts', async () => {
    return $.gulp.src(`${sourcePath}/**`)
      .pipe($.webpackStream(
        config, $.webpack,
      ))
      .pipe($.gulp.dest(`${destPath}/`))
  })

  function parseModulesPaths(list) {
    for (let key in list) {
      const modulePath = list[key]
      list[key] = $.path.resolve(
        `${modulesPath}/src/${modulePath}`,
      )
    }

    return list
  }
}
