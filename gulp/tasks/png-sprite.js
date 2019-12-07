module.exports = () => {
  $.gulp.task('pngSprite', () => {
    const spriteData =
      $.gulp.src(`${$.config.sourcePath}/${$.config.pngPath}/*.png`)
        .pipe($.gulpPlugin.spritesmith({
          imgName: 'sprite.png',
          cssName: 'png-sprite.scss',
          cssFormat: 'scss',
          algorithm: 'binary-tree',
          cssTemplate: './config/png-sprite-temp.scss',
          cssVarMap: function(sprite) {
            sprite.name = 'icon-' + sprite.name;
          },
        }));

    const destImg =
      spriteData.img.pipe($.gulp.dest(`${$.config.outputPath}/${$.config.pngPath}`));
    const destCss =
      spriteData.css.pipe($.gulp.dest(`${$.config.sourcePath}/${$.config.stylesPath}/png`));

    return $.merge(destImg, destCss);
  });
};