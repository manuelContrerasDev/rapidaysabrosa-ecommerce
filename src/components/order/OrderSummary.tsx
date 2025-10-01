import React from "react";
import { CartItem } from "../../types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  className?: string; // opcional
}

/**
 * Muestra el resumen del pedido con items, subtotal, IVA, descuento y total.
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  discount,
  total,
  className = "",
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Resumen del Pedido
      </h3>

      {/* Lista de productos */}
      <ul className="mb-4" role="list">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm mb-2 text-gray-700 dark:text-gray-300">
            <span>
              {item.name} {item.size && `(${item.size})`} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Totales */}
      <div className="border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-dark dark:text-white">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-dark dark:text-white">
          <span>IVA (19%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-red-600 dark:text-white">
            <span>Descuento</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold mt-2 text-dark dark:text-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
