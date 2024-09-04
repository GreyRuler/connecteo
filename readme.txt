Ипользованный стек: CMS STRAPI, TELEGRAFJS, EXPRESSJS, VUE3

1. Установка CMS STRAPI
npx create-strapi-app@latest my-project

Замена всех файлов в папке src. ( исходники в strapi/src )
Импорт БД: npm run strapi import -- -f EXPORT_FILE
При импорте запрашивается ключ ('q')

Запуск Strapi производится командой 'npm run start'.

2. Установка чат-бота
Выполнить npm i в папке bot
Запустить бот командой node bot.js

3. WebApp
Скомпилированный проект находится в папке dist
Исходники в папке web.

Перекомпилировать проект - npm run build.
