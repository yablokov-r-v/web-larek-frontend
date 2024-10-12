# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код
1.	Класс Api обеспечивает взаимодействие с API. Его функции: выполнение GET, POST, PUT и DELETE запросов, обработка ответов от сервера.
2.	Класс EventEmitter обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.
3.	Класс Component - базовый класс для всех компонентов. Его функции: работа с DOM элементами.
4.	Класс Model - базовая модель данных. Его функции: управление состоянием модели.

## Компоненты
1.	Компонент Page отвечает за отображение страницы. Его функции: управление отображением каталога и корзины.
2.	Компонент Card отвечает за отображение карточек товаров. Его функции: отображение информации о товаре.
3.	Компонент Basket отвечает за отображение корзины. Его функции: отображение списка товаров и общей стоимости.
4.	Компонент Order отвечает за работу с формой заказа. Его функции: ввод контактной информации и подтверждение заказа.
5.	Компонент Form отвечает за работу с формами. Его функции: валидация и обработка ошибок.
6.	Компонент Modal отвечает за работу с модальными окнами. Его функции: открытие и закрытие модальных окон.
7.	Компонент Success отвечает за отображение успешного оформления заказа. Его функции: отображение сообщения об успешном оформлении заказа.

## Модель данных
1.	Класс AppState управляет состоянием приложения. Его функции: управление каталогом товаров и корзиной.
2.	Класс ProductItem - модель данных для товара. Его функции: хранение информации о товаре.

