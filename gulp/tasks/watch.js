module.exports = () => {
  $.gulp.task('watch', () => {
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.stylesPath}/**/*.{scss, sass, css}`,
      ],
      $.gulp.series('styles'),
    );
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.scriptsPath}/**/*.js`,
      ],
      $.gulp.series('scripts'),
    );
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.hbsPath}/**/*`,
        `${$.config.sourcePath}/${$.config.dbPath}/db.json`,
      ],
      $.gulp.series(['hbs', 'prepareHtmlDev']),
    );
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.svgPath}/*.svg`,
      ],
      $.gulp.series('svgSprite'),
    );
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.svgInlinePath}/*.svg`,
      ],
      $.gulp.series('svgInline'),
    );
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.pngPath}/*.png`,
      ],
      $.gulp.series('pngSprite'),
    );
    $.gulp.watch([
        `${$.config.sourcePath}/${$.config.assetsPath}/**/*`,
        `!${$.config.sourcePath}/${$.config.assetsPath}/svg`,
        `!${$.config.sourcePath}/${$.config.assetsPath}/svg/**/*`,
      ],
      $.gulp.series('assets'),
    );
  });
};