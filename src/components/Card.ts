import { Component } from './base/Component';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price: string;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);

		try {
			this._image = ensureElement<HTMLImageElement>(
				`.${blockName}__image`,
				container
			);
			this._category = ensureElement<HTMLElement>(
				`.${blockName}__category`,
				container
			);
			this._button = container.querySelector(`.${blockName}__button`);
			this._description = container.querySelector(`.${blockName}__text`);
		} catch {}

		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: string) {
		this.setText(this._price, value);
		this.setDisabled(this._button, value === 'Бесценно');
	}
}

export class ProductItem extends Card<IProduct> {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}
