// src/components/order/OrderCart.tsx
import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useCartTotal } from "../../hooks/useCartTotal";
import { CATALOG } from "../../routes/paths";
import CartItem from "../ui/CartItem";
import OrderSummary from "./OrderSummary";

interface OrderCartProps {
  onProceed: () => void;
  discount?: number;
}

/**
 * Lista items del carrito + resumen + CTA checkout.
 * Totales centralizados con useCartTotal para evitar duplicación.
 */
const OrderCart: React.FC<OrderCartProps> = ({ onProceed, discount = 0 }) => {
  const { items } = useCart();
  const isEmpty = items.length === 0;

  const { subtotal, tax, total } = useCartTotal(0.19, discount);

  if (isEmpty) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
        <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Tu carrito está vacío</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Parece que aún no has agregado productos a tu pedido.
        </p>
        <Link to={CATALOG} className="btn btn-primary">
          Explorar Nuestro Menú
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Lista de productos */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Resumen y botón */}
      <div className="flex flex-col gap-4">
        <OrderSummary items={items} subtotal={subtotal} tax={tax} discount={discount} total={total} />
        <button className="btn btn-primary w-full mt-2" onClick={onProceed}>
          Continuar al Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderCart;
