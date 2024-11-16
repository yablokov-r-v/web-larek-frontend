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
Поля:
    baseUrl: string — базовый URL API
    options: RequestInit — настройки запросов
Методы:
    constructor(baseUrl: string, options: RequestInit = {}) — инициализация API
        Параметры:
            baseUrl: string — базовый URL API
            options: RequestInit — настройки запросов (по умолчанию пустой объект)
    handleResponse(response: Response): Promise<object> — обработка ответа от сервера
    get(uri: string): Promise<object> — выполнение GET запроса
    post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> — выполнение POST запроса

2.	Класс EventEmitter обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.
Поля:
    events: Map<EventName, Set<Subscriber>> — хранит подписчиков событий
Методы:
    constructor() - инициализация слушателя
    on<T>(eventName: EventName, callback: (event: T) => void): void — установить обработчик на событие
    off(eventName: EventName, callback: Subscriber): void — снять обработчик с события
    emit<T>(eventName: string, data?: T): void — инициировать событие с данными
    onAll(callback: (event: EmitterEvent) => void): void — слушать все события
    offAll(): void — сбросить все обработчики
    trigger<T>(eventName: string, context?: Partial<T>): void — сделать коллбек триггер, генерирующий событие при вызове

3.	Класс Component - базовый класс для всех компонентов. Его функции: работа с DOM элементами.
Поля:
    container: HTMLElement — контейнер компонента
Методы:
    constructor(container: HTMLElement) — инициализация компонента
        Параметры:
            container: HTMLElement — контейнер компонента
    toggleClass(element: HTMLElement, className: string, force?: boolean): void — переключить класс
    setText(element: HTMLElement, value: unknown): void — установить текстовое содержимое
    setDisabled(element: HTMLElement, state: boolean): void — сменить статус блокировки
    setHidden(element: HTMLElement): void — скрыть элемент
    setVisible(element: HTMLElement): void — показать элемент
    setImage(element: HTMLImageElement, src: string, alt?: string): void — установить изображение
    render(data?: Partial<T>): HTMLElement — вернуть корневой DOM-элемент

4.	Класс Model - базовая модель данных. Его функции: управление состоянием модели.
Поля:
    events: IEvents — объект для управления событиями
Методы:
    constructor(data: Partial<T>, events: IEvents) — инициализация модели
        Параметры:
            data: Partial<T> — начальные данные модели.
            events: IEvents — объект для управления событиями.
    emitChanges(event: string, payload?: object): void — сообщить всем что модель поменялась

## Компоненты
1.	Компонент Page отвечает за отображение страницы. Его функции: управление отображением каталога и корзины.
Поля:
    counter: HTMLElement — элемент счётчика товаров в корзине
    catalog: HTMLElement — элемент каталога товаров
    wrapper: HTMLElement — обёртка страницы
    basket: HTMLElement — элемент корзины
Методы:
    constructor(container: HTMLElement, events: IEvents) — инициализация компонента
        Параметры:
            container: HTMLElement — контейнер компонента
            events: IEvents — объект для управления событиями
    set counter(value: number): void — установка значения счётчика
    set catalog(items: HTMLElement[]): void — установка элементов каталога
    set locked(value: boolean): void — блокировка/разблокировка страницы.

2.	Компонент Card отвечает за отображение карточек товаров. Его функции: отображение информации о товаре.
Поля:
    title: HTMLElement — заголовок карточки
    image: HTMLImageElement — изображение товара
    description: HTMLElement — описание товара
    category: HTMLElement — категория товара
    price: HTMLElement — цена товара
    button: HTMLButtonElement — кнопка действия
Методы:
    constructor(container: HTMLElement, actions?: ICardActions) — инициализация компонента
        Параметры:
            container: HTMLElement — контейнер компонента
            actions?: ICardActions — объект с действиями для кнопки действия
    set title(value: string): void — установка заголовка
    set image(value: string): void — установка изображения
    set description(value: string): void — установка описания
    set category(value: string): void — установка категории
    set price(value: number): void — установка цены

3.	Компонент Basket отвечает за отображение корзины. Его функции: отображение списка товаров и общей стоимости.
Поля:
    list: HTMLElement — список товаров в корзине
    total: HTMLElement — общая стоимость товаров
    button: HTMLElement — кнопка оформления заказа
    <!-- deleteButton: HTMLElement — кнопка удаления товара -->
Методы:
    constructor(container: HTMLElement, events: EventEmitter) — инициализация компонента
        Параметры:
            container: HTMLElement — контейнер компонента
            events: EventEmitter — объект для управления событиями
    set items(items: HTMLElement[]): void — установка списка товаров
    set total(total: number): void — установка общей стоимости

4.	Компонент Order отвечает за работу с формой заказа. Его функции: ввод контактной информации и подтверждение заказа.
Поля:
    phone: HTMLInputElement — поле ввода телефона
    email: HTMLInputElement — поле ввода электронной почты
    address: HTMLInputElement — поле ввода адреса
    paymentMethod: HTMLSelectElement — выбор способа оплаты
Методы:
    constructor(container: HTMLFormElement, events: IEvents) — инициализация компонента
        Параметры:
            container: HTMLFormElement — контейнер формы
            events: IEvents — объект для управления событиями
    set phone(value: string): void — установка телефона
    set email(value: string): void — установка электронной почты
    set address(value: string): void — установка адреса
    set paymentMethod(value: 'online' | 'upon_receipt'): void — установка способа оплаты

5.	Компонент Form отвечает за работу с формами. Его функции: валидация и обработка ошибок.
Поля:
    submit: HTMLButtonElement — кнопка отправки формы
    errors: HTMLElement — элемент для отображения ошибок
Методы:
    constructor(container: HTMLFormElement, events: IEvents) — инициализация компонента
        Параметры:
            container: HTMLFormElement — контейнер формы
            events: IEvents — объект для управления событиями
    onInputChange(field: keyof T, value: string): void — обработка изменения поля ввода
    set valid(value: boolean): void — установка состояния валидации
    set errors(value: string): void — установка ошибок
    render(state: Partial<T> & IFormState): HTMLElement — рендеринг формы

6.	Компонент Modal отвечает за работу с модальными окнами. Его функции: открытие и закрытие модальных окон.
Поля:
    closeButton: HTMLButtonElement — кнопка закрытия модального окна
    content: HTMLElement — содержимое модального окна
Методы:
    constructor(container: HTMLElement, events: IEvents) — инициализация компонента
        Параметры:
            container: HTMLElement — контейнер модального окна
            events: IEvents — объект для управления событиями
    set content(value: HTMLElement): void — установка содержимого
    open(): void — открытие модального окна
    close(): void — закрытие модального окна
    render(data: IModalData): HTMLElement — рендеринг модального окна

7.	Компонент Success отвечает за отображение успешного оформления заказа. Его функции: отображение сообщения об успешном оформлении заказа.
Поля:
    close: HTMLElement — кнопка закрытия сообщения
Методы:
    constructor(container: HTMLElement, actions: ISuccessActions) — инициализация компонента
        Параметры:
            container: HTMLElement — контейнер сообщения
            actions: ISuccessActions — объект с действиями для кнопки закрытия
    render(data: ISuccess): HTMLElement — рендеринг сообщения

## Модель данных
1.	Класс AppState управляет состоянием приложения. Его функции: управление каталогом товаров и корзиной.
Поля:
    basket: string[] — список идентификаторов товаров в корзине
    catalog: ProductItem[] — список товаров в каталоге
    loading: boolean — флаг загрузки данных
    order: IOrder — текущий заказ
    preview: string | null — идентификатор товара для предпросмотра
    formErrors: FormErrors — ошибки формы
Методы:
    constructor(data: Partial<IAppState>, events: IEvents) — инициализация состояния приложения
        Параметры:
            data: Partial<IAppState> — начальные данные состояния приложения
            events: IEvents — объект для управления событиями
    toggleOrderedProduct(id: string, isIncluded: boolean): void — добавление/удаление товара из заказа
    clearBasket(): void — очистка корзины
    getTotal(): number — получение общей стоимости товаров в корзине
    setCatalog(items: IProduct[]): void — установка каталога товаров
    setPreview(item: ProductItem): void — установка товара для предпросмотра
    getAvailableProducts(): ProductItem[] — получение доступных товаров
    setOrderField(field: keyof IOrderForm, value: string): void — установка поля заказа
    validateOrder(): boolean — валидация заказа

2.	Класс ProductItem - модель данных для товара. Его функции: хранение информации о товаре.
Поля:
    id: string — уникальный идентификатор товара
    title: string — название товара
    description: string — описание товара
    image: string — URL изображения товара
    category: string — категория товара
    price: number — цена товара
Методы:
    constructor(data: Partial<IProduct>, events: IEvents) — инициализация товара
        Параметры:
            data: Partial<IProduct> — начальные данные товара
            events: IEvents — объект для управления событиями
    Наследуются от Model

## Типы данных
ProductCategory: Тип для категорий продуктов (другое, софт-скил, дополнительное, кнопка, хард-скил)
IProduct: Интерфейс для товара
IOrderForm: Интерфейс для формы заказа
IOrder: Интерфейс для заказа
IOrderResult: Интерфейс для результата заказа
FormErrors: Тип для ошибок формы
IAppState: Интерфейс для состояния приложения

## Основные события и их генерация
items:changed — изменение элементов каталога.
    Генерируется при изменении каталога товаров.
    Вызывается метод setCatalog класса AppState, который вызывает emit для события items:changed.
order:submit — отправка формы заказа.
    Генерируется при отправке формы заказа.
    Вызывается метод submitOrder класса Order, который вызывает emit для события order:submit.
formErrors:change — изменение состояния валидации формы.
    Генерируется при изменении состояния валидации формы.
    Вызывается метод validateOrder класса AppState, который вызывает emit для события formErrors:change.
order:open — открытие формы заказа.
    Генерируется при открытии формы заказа.
    Вызывается метод openOrderForm класса Modal, который вызывает emit для события order:open.
contacts:open — открытие формы контактов.
    Генерируется при открытии формы контактов.
    Вызывается метод openContactsForm класса Modal, который вызывает emit для события contacts:open.
basket:open — открытие корзины.
    Генерируется при открытии корзины.
    Вызывается метод openBasket класса Modal, который вызывает emit для события basket:open.
catalog:changed — изменение каталога.
    Генерируется при изменении каталога товаров.
    Вызывается метод setCatalog класса AppState, который вызывает emit для события catalog:changed.
card:select — выбор товара.
    Генерируется при выборе товара.
    Вызывается метод selectCard класса Page, который вызывает emit для события card:select.
preview:changed — изменение выбранного товара.
    Генерируется при изменении выбранного товара.
    Вызывается метод setPreview класса AppState, который вызывает emit для события preview:changed.
modal:open — открытие модального окна.
    Генерируется при открытии модального окна.
    Вызывается метод open класса Modal, который вызывает emit для события modal:open.
modal:close — закрытие модального окна.
    Генерируется при закрытии модального окна.
    Вызывается метод close класса Modal, который вызывает emit для события modal:close.


## Примеры взаимодействия между классами
Пример 1: Выбор товара и отображение его деталей.
Пользователь кликает по карточке товара в галерее. Обработчик события клика вызывает метод emit класса EventEmitter, который вызывает обработчик события card:select, передавая данные о товаре. Обработчик card:select вызывает метод модели setPreview, который вызывает метод emit для события preview:change, передавая данные о товаре. Обработчик события preview:change вызывает методы класса Modal для отображения модального окна с данными о товаре.

Пример 2: Открытие корзины.
Пользователь кликает по значку корзины. Обработчик события клика вызывает метод emit класса EventEmitter, который вызывает обработчик события basket:open. Обработчик basket:open вызывает метод open класса Modal, который вызывает метод render для отображения содержимого корзины.

Пример 3: Отправка формы заказа.
Пользователь заполняет форму заказа и нажимает кнопку “Оформить”. Обработчик события клика вызывает метод submitOrder класса Order, который вызывает метод emit для события order:submit. Обработчик order:submit вызывает метод orderProducts класса Api, который отправляет данные заказа на сервер. После успешного ответа от сервера вызывается метод emit для события catalog:changed, чтобы обновить каталог товаров.

Пример 4: Валидация формы заказа.
Пользователь заполняет поля формы заказа. Обработчик события изменения поля вызывает метод setOrderField класса AppState, который вызывает метод validateOrder. Метод validateOrder проверяет корректность данных и вызывает метод emit для события formErrors:change, если найдены ошибки.
