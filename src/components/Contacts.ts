import { Form } from './common/Form';
import { IEvents } from './base/events';
import { IOrderForm } from '../types';

export class Contacts extends Form<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.container.addEventListener('input', () => {
			this.toggleSubmitButton();
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			const email = (
				this.container.elements.namedItem('email') as HTMLInputElement
			).value;
			const phone = (
				this.container.elements.namedItem('phone') as HTMLInputElement
			).value;

			events.emit('order.phone:change', { field: 'phone', value: phone });
			events.emit('order.email:change', { field: 'email', value: email });

			events.emit('order:submit');
		});
	}

	toggleSubmitButton() {
		const email = (
			this.container.elements.namedItem('email') as HTMLInputElement
		).value;
		const phone = (
			this.container.elements.namedItem('phone') as HTMLInputElement
		).value;
		const submitButton = this.container.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;

		submitButton.disabled = !(email && phone);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
