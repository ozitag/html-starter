# HTML Starter (BLAKIT Edition)

## Разработка проекта
```
gulp dev
```

## Сборка проекта

```
gulp build
```

## Из чего состоит HTML Starter?

В основном работа проходит в 2-х местах

1. файлик config/config.json
1. папка app

### config/config.json

Файли служит для настройки проекта.

1. Пути до файлов
1. Сжатие css
1. Сжатие js
1. Сжатие кртанок
1. Заливка через ftp
1. Заливка через sftp

```
{
  "appName": "blakit:APP_NAME",
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

Собсвенно большая часть разработки проходит тут. Папка состоит из 5 основных разделов.

1. meta - папка для загрузки скриншотов, которые вдальнешем будут отображаться в index.html.
index.html генерируется сам, исходя из скриншотов в папке.
1. content - папка для контентной части сайта, те которые будут заливаться из админки (картинки, иконки, видео и т.п.)
1. static - папка для работы, заглянув в нее сразу станет понятно. Подробнее что в ней и куда разпишу далее.
1. templates - папка для работы с html. Мы используем препроцессор handlebars (hbs). Собственно далее тоже распишу что к чему.
```
├── .meta
├── content
├── static
└── templates
```