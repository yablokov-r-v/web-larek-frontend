import './scss/styles.scss';
import { ProductAPI } from './components/ProductAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent, ProductItem } from './components/AppData';
import { Page } from './components/Page';
import { ProductCard } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrderForm, IOrderResult, IProduct } from './types';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

document.addEventListener('DOMContentLoaded', () => {
	const events = new EventEmitter();
	const api = new ProductAPI(CDN_URL, API_URL);

	// Чтобы мониторить все события, для отладки
	events.onAll(({ eventName, data }) => {});

	// Функция для создания шаблона, если он не найден
	const createTemplate = (id: string, content: string) => {
		const template = document.createElement('template');
		template.id = id;
		template.innerHTML = content;
		document.body.appendChild(template);
		return template;
	};

	// Все шаблоны
	const cardCatalogTemplate =
		ensureElement<HTMLTemplateElement>('#card-catalog');
	const cardPreviewTemplate =
		ensureElement<HTMLTemplateElement>('#card-preview');
	const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
	const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
	const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
	const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
	const successTemplate = ensureElement<HTMLTemplateElement>('#success');

	// Проверка наличия элементов и создание их при необходимости
	const catalogItems = document.querySelector<HTMLElement>('.catalog__items');
	if (!catalogItems) {
		const main = document.querySelector('main');
		if (main) {
			const catalog = document.createElement('div');
			catalog.className = 'catalog__items';
			main.appendChild(catalog);
		} else {
			console.error('Main element not found.');
			return;
		}
	}
	const modalContainer =
		document.querySelector<HTMLElement>('#modal-container');
	if (!modalContainer) {
		const body = document.querySelector('body');
		if (body) {
			const modal = document.createElement('div');
			modal.id = 'modal-container';
			modal.className = 'modal';
			body.appendChild(modal);
		} else {
			console.error('Body element not found.');
			return;
		}
	}

	// Модель данных приложения
	const appData = new AppState({}, events);

	// Глобальные контейнеры
	const page = new Page(document.body, events);
	const modal = new Modal(
		ensureElement<HTMLElement>('#modal-container'),
		events
	);

	// Переиспользуемые части интерфейса
	const basket = new Basket(cloneTemplate(basketTemplate), events);
	const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
	const order = new Order(cloneTemplate(orderTemplate), events);

	// Дальше идет бизнес-логика
	// Поймали событие, сделали что нужно
	// Изменились элементы каталога
	events.on<CatalogChangeEvent>('items:changed', () => {
		page.catalog = appData.catalog.map((item) => {
			const card = new ProductCard(cloneTemplate(cardCatalogTemplate), item.category, {
				onClick: () => events.emit('card:select', item),
			});
			return card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
			});
		});
	});

	// Отправлена форма заказа
	events.on('order:submit', () => {
		api
			.orderProducts(appData.order)
			.then((result: IOrderResult) => {
				const success = new Success(cloneTemplate(successTemplate), {
					onClick: () => {
						modal.close();
					},
				});
				modal.render({
					content: success.render({ total: result.total }),
				});
				appData.clearBasket();
				updateBasket();
			})
			.catch((err: any) => {
				console.error(err);
			});
	});

	// Изменилось состояние валидации формы
	events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
		const { email, phone, address, payment } = errors;
		order.valid = !email && !phone && !address && !payment;
		order.errors = Object.values({ phone, email, address, payment })
			.filter((i) => !!i)
			.join('; ');
	});

	// Изменилось одно из полей
	events.on(
		/^order\..*:change/,
		(data: { field: keyof IOrderForm; value: string }) => {
			appData.setOrderField(data.field, data.value);
		}
	);

	// Открыть форму заказа
	events.on('order:open', () => {
		modal.render({
			content: order.render({
				payment: '',
				address: '',
				valid: false,
				errors: [],
			}),
		});
	});

	// Открыть форму контактов
	events.on('contacts:open', () => {
		modal.render({
			content: contacts.render({
				phone: '',
				email: '',
				valid: false,
				errors: [],
			}),
		});
	});

	// Открыть корзину
	events.on('basket:open', () => {
		modal.render({
			content: basket.render(),
		});
	});

	// Изменения в товаре, но лучше все пересчитать
	events.on('catalog:changed', () => {
		basket.items = appData.basket.map((id) => {
			const item = appData.catalog.find((product) => product.id === id);
			const card = new ProductCard(cloneTemplate(cardCatalogTemplate), item.category, {
				onClick: () => events.emit('preview:changed', item),
			});
			return card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
			});
		});
		basket.total = appData.getTotal();
	});

	// Открыть товар
	events.on('card:select', (item: ProductItem) => {
		appData.setPreview(item);
	});

	// Функция, которая отвечает за обновление списка товаров в корзине и пересчет общей стоимости
	function updateBasket() {
		basket.items = appData.order.items.map((id, index) => {
			const item = appData.catalog.find((product) => product.id === id);
			const card = new ProductCard(cloneTemplate(cardBasketTemplate), item.category, {
				onClick: () => {
					appData.toggleOrderedProduct(item.id, false);
					updateBasket();
					page.counter = appData.order.items ? appData.order.items.length : 0;
				},
			});
			
			const renderedCard = card.render({
				title: item.title,
				price:
					item.price !== null
						? ` ${item.price.toString()} синапсов`
						: '0 синапсов',
			});

			const indexElement = renderedCard.querySelector('.basket__item-index');
			indexElement.textContent = (index + 1).toString();
			return renderedCard;

		});
		basket.total = appData.getTotal();
		page.counter = appData.order.items ? appData.order.items.length : 0;
	}

	//    Обработчик для добавления товара в корзину
	events.on('card:addToBasket', (item: ProductItem) => {
		appData.toggleOrderedProduct(item.id, true);
		updateBasket();
		page.counter = appData.order.items ? appData.order.items.length : 0;
	});

	// Изменен открытый выбранный товар
	events.on('preview:changed', (item: ProductItem) => {
		const showItem = (item: ProductItem) => {
			const card = new ProductCard(cloneTemplate(cardPreviewTemplate), item.category, {
				onClick: () => {
					events.emit('card:addToBasket', item);
				},
			});
			modal.render({
				content: card.render({
					title: item.title,
					image: item.image,
					description: item.description,
					category: item.category,
					price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
				}),
			});
		};
		if (item) {
			api
				.getProductItem(item.id)
				.then((result: IProduct) => {
					item.description = result.description;
					showItem(item);
				})
				.catch((err: any) => {
					console.error(err);
				});
		} else {
			modal.close();
		}
	});

	// Блокируем прокрутку страницы если открыта модалка
	events.on('modal:open', () => {
		page.locked = true;
	});

	// ... и разблокируем
	events.on('modal:close', () => {
		page.locked = false;
	});

	// Получаем товары с сервера
	api
		.getProductList()
		.then(appData.setCatalog.bind(appData))
		.catch((err: any) => {
			console.error(err);
		});
});
