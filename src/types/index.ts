// ================================
// 📦 Tipos globales y de dominio
// ================================

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: number;
  available: boolean;
  stock: number;
  discount: number | null;
  created_at: string;
  updated_at: string;
  isVegetarian?: boolean;
}


// 🔹 Tipo base genérico (para cualquier producto del catálogo)

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
  sizes?: ProductSize[]; // tamaños opcionales
}

// 🔹 Subtipo base para tamaños genéricos
export interface ProductSize {
  name: string;
  size: number; // en cm
  priceModifier: number;
}

// ================================
// 🍕 Tipos específicos de productos
// ================================

// 🔹 Extensión específica para Pizzas
export interface Pizza extends Product {
  sizes: PizzaSize[];
  ingredients: string[];
  isSpicy: boolean;
  isNew: boolean;
}

// 🔹 Tamaño de Pizza
export interface PizzaSize {
  name: string;
  size: number; // cm
  priceModifier: number;
}

// ================================
// 🛒 Carrito y pedidos
// ================================

// 🔹 Item dentro del carrito
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size?: string; // opcional, ej: "Familiar"
  price: number;
  quantity: number;
}

// 🔹 Pedido completo
export interface Order {
  orderId: string;
  customerName: string;
  contactNumber: string;
  items: CartItem[];
  deliveryAddress: string;
  paymentMethod: string;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out-for-delivery"
    | "delivered";
  createdAt: Date;
}

// ================================
// 🎁 Promociones y descuentos
// ================================

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  image_url?: string; // opcional, solo si viene del backend
  discount: string; // ej: "20%" o "$2000"
  validUntil: string; // fecha ISO string
  isActive: boolean;
}

// ================================
// 💰 Utilidades (formateo moneda CLP)
// ================================

// src/utils/currency.ts
/*
export const clp = (v: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(v);
*/
