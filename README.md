# HTML Starter

## Важно!!!
Если в проекте будет задача сделать critical css то для начала нужно установать модуль. Я не стал вносить его в devDependencies.
Ибо он качает Chromium который весит 80mb и если его ставить как зависимость в каждый проект то это будет беда. 

```
npm install critical
```

## Разработка проекта
```
npm run start || gulp dev
```

## Сборка проекта

```
npm run build || gulp build
```

## Из чего состоит HTML Starter?

В основном работа проходит в 2-х местах

1. Файлик config/config.json
1. Папка app

### config/config.json

Файлик служит для настройки проекта.

1. Пути до файлов
1. Сжатие css
1. Сжатие js
1. Сжатие кртанок
1. Вспомогательные либы js

```
{
  "appName": "APP_NAME",
  "siteName": "Site name",
  "tmpPath": ".tmp",
  "sourcePath": "app",
  "destPath": "dist",
  "hbsPath": "templates",
  "staticPath": "static",
  "stylesPath": "static/css",
  "scriptsPath": "static/js",
  "imagesPath": "static/images",
  "pngPath": "static/png",
  "fontsPath": "static/fonts",
  "svgPath": "static/svg/sprite",
  "svgInlinePath": "static/svg/inline",
  "contentPath": "content",
  "metaPath": ".meta",
  "concatScripts": false,
  "cssMin": false,
  "tinyPng": true,
  "criticalCss": false,
  "supportJsLibs": [
    "./node_modules/html5shiv/dist/html5shiv.min.js",
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/svg4everybody/dist/svg4everybody.min.js"
  ],
  "ftp": {
    "enabled": true,
    "host": "FTP.ozis.by",
    "login": "ozisby",
    "password": "Kee6ohmo",
    "remotePath": "/projects/diold.ozis.by"
  },
  "sftp": {
    "enabled": true,
    "host": "46.101.113.218",
    "login": "root",
    "password": "7196706932f21ff9bb2f89064e4",
    "remotePath": "/var/www/html/testProject"
  }
}
```

### app

Собственно большая часть разработки проходит тут. Папка состоит из 4 основных разделов.

1. meta - папка для загрузки скриншотов, которые вдальнейшем будут отображаться в index.html.
index.html генерируется сам, исходя из скриншотов в папке.
1. content - папка для контентной части сайта, тот котнтент который будет заливаться из админки (картинки, иконки, видео и т.п.)
1. static - папка для работы, заглянув в нее сразу станет понятно. Подробнее что в ней и куда распишу далее.
1. templates - папка для работы с html. Мы используем препроцессор handlebars (hbs). Собственно далее тоже распишу что к чему.
```
├── .meta
├── content
├── static
└── templates
```

### .meta

В папке лежет скрины каждой страницы в формате 00_ui-toolkit.
Скрин обезятельно должен начинаться с номера, далее после номере идет нижнее подчеркивание _ и только потом название скрина, 
которое в свою очеред должно соответсвовать названию странцы из папки templates.

Например
```
├── .meta
    ├── 00_ui-toolkit.png
    └── 01_home.png
└── templates
    ├── home.hbs
    └── ui-toolkit.hbs
```

### content

В папке лежит контентные файлы сайта, те которые в дальнейшем будут заливаться из админки. Изначально в content лежит 2 папки

1. icons
1. images

icons - хранит иконки сайта
images - хранит картинки сайта.

папки разделены потому что, при build и соответсвующих флагов в config.json будет сжатие кратинок.

### static

Основная папка для разработки проекта. Все чудеса будут твориться тут.
Структура папки. Далее про каждую папку подробнее.

```
└── static
    ├── css
    ├── fonts
    ├── images
    ├── js
    ├── png
    └── svg
```

Как видно из структуры каждая папка говорит сама за себя. Единственное что может быть не понятно, это папки png и images.
1. png - сюда складываем иконки которые в дальнейшем будут генериться в sprite.png их можно будет подключать соответсвующим mixin spritePng.
1. images - сюда складываем картинки которые будем вешать на беграундах и т.п. Не иконки!

### static/css

```
├── static
    ├── css
        ├── _common.scss
        ├── _imports.scss
        ├── _typography.scss
        ├── blocks
        │   └── btn-list.scss
        ├── components
        │   ├── checkbox.scss
        │   ├── dropdown.scss
        │   ├── loader.scss
        │   └── radio.scss
        ├── config
        │   ├── fonts.scss
        │   ├── options.scss
        │   └── variables.scss
        ├── layout
        │   ├── breadcrumbs.scss
        │   ├── footer.scss
        │   ├── header.scss
        │   ├── popup.scss
        │   └── wrapper.scss
        ├── libs
        │   ├── grid.scss
        │   ├── nomolize.scss
        │   └── slick.scss
        ├── main.scss
        ├── mixins
        │   └── mixins.scss
        ├── pages
        │   ├── home.scss
        │   └── ui-toolkit.scss
        ├── png
        │   ├── _mixins.scss
        │   └── png-sprite.scss
        ├── svg
        │   ├── _mixins.scss
        │   ├── _sprite.scss
        │   ├── _spriteInline.scss
        │   └── svg.scss
        └── ui
            ├── buttons.scss
            └── form.scss
```

Пойдем по порядку. Постараюсь описать что происходит в каждом файле. Тут есть даже файлы которые никтогда не трогают)

1. _сommon.scss - общие стили сайта. Обнуление тех или иных тегов, написане глобальных классов и т.п.
1. _typography.scss - общие стили для типографики сайта.
1. _imports.scss - сюда вы почти не заглядываете, если только иногда надо отключить grid system, то просто комментим строку с ее подключением.
1. main.scss - тут идет подключение всех файлов. Импортировать желательно группами (Блоки, Компоненты, Страницы, и т.д.)
1. blocks - тут для каждого блока создается файл *.scss. И в нем идет описание блока.
1. components - сюда складываем компоненты.
1. config - css настроки (переменные, опции, шрифты).
1. layout - layout страниц.
1. libs - стороние css либы.
1. mixins - понятно из названия. Каждый миксин описывать нет смысла. Можно открыть и поглядеть что там есть.
1. png & svg - в этим папки мы не лезем, так как они все делают автоматом. Можно только посмотреть что делают их mixins.
1. pages - сюда складываем стили для определенных странци типа (404, static, и т.п.)

### static/fonts

В папку складываем шрифты. Каждое семейсво шрифтов это отдельныя папка. Пример будет ниже.
Суть в том что, наприме вы хотите подключить шрифт Roboto. И вам нужны будет несколько типов этого шрифта (bold, regular, medium).
Допустим дизайнер вам передал только файлы формата *.ttf. Тогда, мы заходим на [сайт](https://transfonter.org/) для генерации шрифтов.
Нам нужны 2 формата шрифтов (woff, woff2). Далее складываем в папку с семейством шрифта.

```
├── fonts
    └── Roboto
        ├── Bold.woff
        ├── Bold.woff2
        ├── Light.woff
        ├── Light.woff2
        ├── Medium.woff
        ├── Medium.woff2
        ├── Regular.woff
        └── Regular.woff2
```

Тепер нужно их подключить. Для этого есть готовый миксин.
Подключение происходит в css/config/fonts.scss

```scss
@include font("Roboto/Light", "Roboto-Light");
@mixin light() {
  @include font-mixin("Roboto-Light");
}
```

Далее для того чтобы использовать этот шрифт достаточно написать в нужном месте @include light;

### static/js

```
├── js
    ├── helpers
    │   ├── dropdown.js
    │   ├── layout.js
    │   ├── load-more.js
    │   ├── popups.js
    │   ├── share.js
    │   └── tabs.js
    ├── libs
    │   ├── html5shiv.js
    │   ├── jquery-ui.min.js
    │   ├── jquery.min.js
    │   ├── slick.js
    │   └── svg4body.js
    └── ui.js
```

Из структуры видно что к чему.

1. ui.js - тут пишем js для всего сайта.
1. helpers - наши компоненты. Каждый файлик описывать лень) Можно будет спросить непосредсвтвенно перед началом работы.
1. libs - стороние либы, можно сюда докидывать если понадобиться что то еще.

Так же, если во время разработки нажно будет написать как либо виджет, то в папке js создается еще одна папка js/widgets.
В которую потом добавляется файл с вашим виджетом.

### static/svg
```
└── svg
    ├── inline
    └── sprite
```

1. inline - svg которые будут подключаться непосредственно в html. В templates/partials/ui/svg.hbs уже лежит готовый 
способ для их подключения.
1. sprite - svg которые будут подключаться из css. Для этого есть mixin sprite('icon-btn').

### templates

Про работу handlebars можно почитать на [оф.сайте]( http://handlebarsjs.com/).
Так же загялнуть [сюда](http://handlebarsjs.com/block_helpers.html).

```
└── templates
    ├── ajax
    ├── home.hbs
    ├── layouts
    ├── partials
    └── ui-toolkit.hbs
```

В корень папки складываются страницы сайта.

1. ajax - в основном служит для того чтобы подтягивать какой либо контент html.
1. layouts - папка для плагина. Ее не трогаеем и не удаляем.
1. partials - папка где творятся чудеса) 

### templates/partials

```
├── partials
    ├── blocks
    │   ├── ui-section-end.hbs
    │   └── ui-section-start.hbs
    ├── layout
    │   ├── bottom.hbs
    │   ├── footer.hbs
    │   ├── head.hbs
    │   └── header.hbs
    ├── popups
    │   └── example.hbs
    └── ui
        ├── checkbox.hbs
        ├── input.hbs
        ├── radio.hbs
        └── svg.hbs
```

1. blocks - складываем блоки сайта, если они много раз переиспользуются.
1. layout - layout сайта (header, footer и т.п.)
1. popups - сюда складываем попапы
1. ui - тут лежат ui элементы сайта