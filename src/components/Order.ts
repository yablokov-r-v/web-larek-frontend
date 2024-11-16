import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.container.addEventListener('input', () => {
			this.toggleSubmitButton();
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			const address = (
				this.container.elements.namedItem('address') as HTMLInputElement
			).value;
			const payment = this.container.querySelector(
				'.order__buttons .button_alt-active'
			)?.textContent;

			events.emit('order.payment:change', { field: 'payment', value: payment });
			events.emit('order.address:change', { field: 'address', value: address });

			// Переход к следующему окну
			events.emit('contacts:open');
		});

		// Обработчики для кнопок выбора способа оплаты
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this._buttons.forEach((btn) =>
					btn.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				events.emit('order:change', {
					field: 'payment',
					value: button.textContent.trim(),
				});
				this.toggleSubmitButton();
			});
		});
	}

	toggleSubmitButton() {
		const address = (
			this.container.elements.namedItem('address') as HTMLInputElement
		).value;
		const payment = this.container.querySelector(
			'.order__buttons .button_alt-active'
		);
		const submitButton = this.container.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;

		submitButton.disabled = !(address && payment);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
