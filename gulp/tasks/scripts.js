module.exports = () => {
  const sourcePath = `${$.config.sourcePath}/${$.config.staticPath}/js`
  const destPath = `${$.config.outputPath}/${$.config.staticPath}/js`
  const outputFileName = $.config.buildMode === 'prod' ? '[name]' : '[name].js'

  const sourceMapConfig = {
    filename: `${outputFileName}.map`,
    exclude: /(libs\.js)/,
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
    output: {
      filename: `${outputFileName}`,
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

  switch ($.config.buildMode) {
    case 'dev':
      config.mode = 'development'
      config.entry = getStaticEntry()
      config.module.rules.push(
        babelConfig,
      )
      config.plugins.push(
        new $.webpack.SourceMapDevToolPlugin(sourceMapConfig),
      )
      minifyConfig.test = /(libs\.js)/
      config.optimization.minimize = true
      config.optimization.minimizer.push(
        new $.wpTerserPlugin(minifyConfig),
      )
      break
    case 'prod':
      config.mode = 'production'
      config.entry = getDynamicEntry()

      if ($.config.babel) {
        config.module.rules.push(
          babelConfig,
        )
      }

      if ($.config.jsMin) {
        minifyConfig.test = /\.js$/
      } else {
        minifyConfig.test = /(libs\.js)/
      }
      config.optimization.minimize = true
      config.optimization.minimizer.push(
        new $.wpTerserPlugin(minifyConfig),
      )
  }

  $.gulp.task('scripts', async () => {
    return $.gulp.src(`${sourcePath}/**`)
      .pipe($.webpackStream(
        config, $.webpack,
      ))
      .pipe($.gulp.dest(`${destPath}/`))
      .pipe($.bs.reload({ stream: true }))
  })

  function getDynamicEntry() {
    return $.glob.sync(
      `${sourcePath}/**/*`, {
        ignore: [`${sourcePath}/main.js`, `${sourcePath}/poly.js`],
        nodir: true,
      },
    ).reduce((acc, path) => {
      const entryPath = path.match(/([\w\d-_]+)\.js$/i)[0]
      acc[entryPath] = $.path.resolve(path)
      return acc
    }, {})
  }

  function getStaticEntry() {
    return {
      libs: $.path.resolve(`${sourcePath}/libs.js`),
      main: $.path.resolve(`${sourcePath}/main.js`),
    }
  }
}
