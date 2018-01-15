module.exports = () => {
    $.gulp.task('pngSprite', function () {
        const spriteData = $.gulp.src($.config.sourcePath + '/' + $.config.pngPath + '/*.png') // путь, откуда берем картинки для спрайта
            .pipe($.gulpPlugin.spritesmith({
                imgName: 'sprite.png',
                cssName: 'png-sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                cssTemplate: './config/png-sprite-temp.scss',
                cssVarMap: function (sprite) {
                    sprite.name = 'icon-' + sprite.name
                }
            }));

        const destImg = spriteData.img.pipe($.gulp.dest($.config.tmpPath + '/' + $.config.pngPath));
        const destCss = spriteData.css.pipe($.gulp.dest($.config.sourcePath + '/' + $.config.stylesPath + '/png'));

        return $.merge(destImg, destCss);
    });
};