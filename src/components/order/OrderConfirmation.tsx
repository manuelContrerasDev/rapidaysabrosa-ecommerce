// src/components/order/OrderConfirmation.tsx
import { Check, Clock } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface OrderConfirmationProps {
  orderId: string;
  form: {
    customerName: string;
    contactNumber: string;
    deliveryAddress: string;
    paymentMethod: "cash" | "card" | "online";
    notes?: string;
  };
}

/**
 * Confirmación de pedido con datos ingresados.
 */
const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId, form }) => {
  const paymentLabel =
    {
      cash: "Efectivo",
      card: "Tarjeta",
      online: "Pago en Línea",
    }[form.paymentMethod] ?? "—";

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-card p-8 text-center">
      {/* Icono de confirmación */}
      <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={32} className="text-secondary-600 dark:text-secondary-300" />
      </div>

      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">¡Gracias por tu Pedido!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Tu pedido ha sido recibido y está siendo procesado.</p>

      {/* Detalles del pedido */}
      <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-4 mb-8 text-left">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Pedido #{orderId}</h3>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
          <Clock size={18} />
          <span>Tiempo estimado de entrega: 30–45 minutos</span>
        </div>

        <ul className="text-gray-900 dark:text-white space-y-1">
          <li>
            <span className="font-semibold">Cliente:</span> {form.customerName}
          </li>
          <li>
            <span className="font-semibold">Teléfono:</span> {form.contactNumber}
          </li>
          <li>
            <span className="font-semibold">Dirección:</span> {form.deliveryAddress}
          </li>
          <li>
            <span className="font-semibold">Método de Pago:</span> {paymentLabel}
          </li>
          {form.notes && (
            <li>
              <span className="font-semibold">Notas:</span> {form.notes}
            </li>
          )}
        </ul>
      </div>

      {/* Botones de navegación */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
        <Link to="/catalog" className="btn btn-secondary">
          Ordenar de Nuevo
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
