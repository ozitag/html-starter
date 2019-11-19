module.exports = () => {
  $.gulp.task("watch", () => {
    $.gulp.watch(
      [
        $.config.sourcePath +
          "/" +
          $.config.stylesPath +
          "/**/*.{scss, sass, css}"
      ],
      $.gulp.series("styles")
    );
    $.gulp.watch(
      [$.config.sourcePath + "/" + $.config.hbsPath + "/**/*"],
      $.gulp.series(["hbs", "prepareHtmlDev"])
    );
    $.gulp.watch(
      [$.config.sourcePath + "/" + $.config.svgPath + "/*.svg"],
      $.gulp.series("svg")
    );
    $.gulp.watch(
      [$.config.sourcePath + "/" + $.config.svgInlinePath + "/*.svg"],
      $.gulp.series("svgInline")
    );
    $.gulp.watch(
      [$.config.sourcePath + "/" + $.config.scriptsPath + "/**/*.js"],
      $.gulp.series("scripts")
    );
    $.gulp.watch([
      $.config.sourcePath + "/" + $.config.metaPath + "/*.{png,jpg,jpeg}"
    ]);
    $.gulp.watch(
      [$.config.sourcePath + "/" + $.config.pngPath + "/*.png"],
      $.gulp.series("pngSprite")
    );
  });
};
