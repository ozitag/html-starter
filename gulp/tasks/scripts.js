module.exports = () => {
  const sourcePath = `${$.config.sourcePath}/${$.config.staticPath}/js`;
  const destPath = `${$.config.outputPath}/${$.config.staticPath}/js`;

  const sourceMapConfig = {
    filename: '[name].map',
    exclude: /vendors\.js/,
  };
  const minifyConfig = {
    parallel: true,
    terserOptions: {
      output: {
        comments: false,
      },
    },
    extractComments: false,
  };
  const babelConfig = {
    test: /\.js$/,
    exclude: [/node_modules[\/\\](?!(swiper|dom7)[\/\\])/],
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'entry',
              corejs: 3,
              modules: false,
              exclude: ['transform-typeof-symbol'],
            },
          ],
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
        ],
      },
    },
  };

  const config = {
    entry: {
      main: $.path.resolve(`${sourcePath}/main.js`),
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/static/js/',
      path: $.path.resolve(`${destPath}/`),
    },
    module: {
      rules: [],
    },
    plugins: [],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            name: 'vendors',
            enforce: true
          },
        }
      },
      minimizer: [],
    },
    stats: 'errors-warnings',
  };

  switch ($.config.buildMode) {
    case 'dev':
      config.mode = 'development';
      config.module.rules.push(
        babelConfig,
      );
      config.plugins.push(
        new $.webpack.SourceMapDevToolPlugin(sourceMapConfig),
      );
      minifyConfig.test = /vendors\.js/;
      config.optimization.minimize = true;
      config.optimization.minimizer.push(
        new $.wpTerserPlugin(minifyConfig),
      );
      break;
    case 'prod':
      config.mode = 'production';

      if ($.config.babel) {
        config.module.rules.push(
          babelConfig,
        );
      }

      if ($.config.jsMin) {
        minifyConfig.test = /\.js$/;
      } else {
        minifyConfig.test = /vendors\.js/;
      }
      config.optimization.minimize = true;
      config.optimization.minimizer.push(
        new $.wpTerserPlugin(minifyConfig),
      );
  }

  $.gulp.task('scripts', done => {
    return $.gulp.src(`${sourcePath}/**`).
      pipe($.webpackStream(config, $.webpack)).
      pipe($.gulp.dest(`${destPath}/`)).
      pipe($.bs.reload({ stream: true })).
      on('end', done);
  });
};
