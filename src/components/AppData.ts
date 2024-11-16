import _ from 'lodash';
import { Model } from './base/Model';
import { IAppState, IProduct, IOrder, IOrderForm, FormErrors } from '../types';
import { IEvents } from './base/events';

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class ProductItem extends Model<IProduct> {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;

	constructor(data: Partial<IProduct>, events: IEvents) {
		super(data, events);
		Object.assign(this, data);
	}
}

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: ProductItem[];
	loading: boolean;
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: '',
		items: [],
	};
	preview: string | null = null;
	formErrors: FormErrors = {};

	// Добавление товара в корзину
	toggleOrderedProduct(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.toggleOrderedProduct(id, false);
		});
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + (this.catalog.find((it) => it.id === c)?.price || 0),
			0
		);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getAvailableProducts(): ProductItem[] {
		return this.catalog;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
