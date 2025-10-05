// 🔹 Tipo base genérico
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  popular?: boolean;
  ingredients?: string[];
  sizes?: { name: string; size: number; priceModifier: number }[];
}


// 🔹 Extensión específica para Pizzas
export interface Pizza extends Product {
  sizes: PizzaSize[];
  ingredients: string[];
  isSpicy: boolean;
  isNew: boolean;
}

export interface PizzaSize {
  name: string;
  size: number; // en cm
  priceModifier: number;
}

export interface CartItem {
  id: string;
  productId: string; // más genérico que "pizzaId"
  name: string;
  size?: string; // opcional, solo aplica a pizzas
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  contactNumber: string;
  items: CartItem[];
  deliveryAddress: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  createdAt: Date;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  validUntil: string;
  isActive: boolean;
}

// src/utils/currency.ts
export const clp = (v: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);

