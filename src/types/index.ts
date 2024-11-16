export type ProductCategory = 'Другое' | 'Софт-скил' | 'Дополнительное' | 'Кнопка' | 'Хард-скил';

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number;
}

export interface IOrderForm {
    address: string;
    payment: string; 
    email: string;
    phone: string;
    total: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
