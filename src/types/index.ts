// Тип для категорий продуктов
export type ProductCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Интерфейс для описания продукта
export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number;
}

// Интерфейс для формы заказа
export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    paymentMethod: 'онлайн' | 'при получении'; 
}

// Интерфейс для заказа, расширяет интерфейс IOrderForm
export interface IOrder extends IOrderForm {
    items: string[];
}

// Интерфейс для результата заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Тип для ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс для состояния приложения
export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
