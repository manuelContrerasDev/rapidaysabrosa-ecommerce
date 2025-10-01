import { useMemo } from "react";
import { useCart } from "../context/CartContext";

interface Totals {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  formatted: {
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
  };
}

// 🔹 Helper para formatear moneda (CLP por defecto)
const formatCurrency = (value: number, currency: string = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);

export const useCartTotal = (
  taxRate: number = 0.19,
  discountRate: number = 0.0
): Totals => {
  const { items } = useCart();

  return useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const discount = Math.min(subtotal * discountRate, subtotal); // Nunca negativo
    const tax = (subtotal - discount) * taxRate;
    const total = subtotal - discount + tax;

    return {
      subtotal,
      tax,
      discount,
      total,
      formatted: {
        subtotal: formatCurrency(subtotal),
        tax: formatCurrency(tax),
        discount: formatCurrency(discount),
        total: formatCurrency(total),
      },
    };
  }, [items, taxRate, discountRate]);
};
