import React from "react";
import { ArrowLeft, CreditCard, DollarSign } from "lucide-react";
import { useCart } from "../../context/CartContext";
import OrderSummary from "./OrderSummary";
import { clp } from "../../utils/currency";

interface OrderDetailsFormProps {
  form: {
    customerName: string;
    contactNumber: string;
    deliveryAddress: string;
    paymentMethod: "cash" | "card" | "online";
    notes: string;
  };
  validationErrors: Partial<{
    customerName: string;
    contactNumber: string;
    deliveryAddress: string;
  }>;
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  goBack: () => void;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({
  form,
  validationErrors,
  handleInputChange,
  handleSubmit,
  goBack,
}) => {
  const { items } = useCart();

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario principal */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-card p-6"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Detalles de Entrega
        </h2>

        {/* Nombre y Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              id: "customerName",
              label: "Nombre Completo",
              type: "text",
              error: validationErrors.customerName,
            },
            {
              id: "contactNumber",
              label: "Número de Contacto",
              type: "tel",
              error: validationErrors.contactNumber,
            },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="form-label">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                className={`form-input ${
                  field.error ? "border-red-500" : ""
                }`}
                value={form[field.id as keyof typeof form] as string}
                onChange={handleInputChange}
                placeholder={field.label}
              />
              {field.error && (
                <p className="text-red-500 text-sm mt-1">{field.error}</p>
              )}
            </div>
          ))}
        </div>

        {/* Dirección */}
        <div className="mb-8">
          <label htmlFor="deliveryAddress" className="form-label">
            Dirección de Entrega
          </label>
          <input
            type="text"
            id="deliveryAddress"
            name="deliveryAddress"
            className={`form-input ${
              validationErrors.deliveryAddress ? "border-red-500" : ""
            }`}
            value={form.deliveryAddress}
            onChange={handleInputChange}
            placeholder="Dirección, apartamento, edificio, etc."
          />
          {validationErrors.deliveryAddress && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.deliveryAddress}
            </p>
          )}
        </div>

        {/* Método de Pago */}
        <div className="mb-8">
          <h3 className="form-label">Método de Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {[
              { value: "cash", label: "Efectivo", icon: DollarSign },
              { value: "card", label: "Débito/Crédito", icon: CreditCard },
              { value: "online", label: "Pago en Línea", icon: CreditCard },
            ].map((payment) => {
              const Icon = payment.icon;
              const active = form.paymentMethod === payment.value;
              return (
                <label
                  key={payment.value}
                  className={`flex items-center border rounded-lg p-4 cursor-pointer transition-all ${
                    active
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={payment.value}
                    checked={active}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <Icon size={18} className="mr-2 text-primary-600" />
                  <span className="text-gray-900 dark:text-white">
                    {payment.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Notas */}
        <div className="mb-8">
          <label htmlFor="notes" className="form-label">
            Notas Adicionales (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="form-input"
            value={form.notes}
            onChange={handleInputChange}
            placeholder="Instrucciones especiales, notas de entrega, etc."
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={goBack}
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver al Carrito
          </button>
          <button type="submit" className="btn btn-primary flex-grow">
            Realizar Pedido
          </button>
        </div>
      </form>

      {/* Resumen lateral */}
      <OrderSummary
        items={items}
        subtotal={subtotal}
        tax={tax}
        discount={0}
        total={total}
        className="sticky top-24"
      />
    </div>
  );
};

export default OrderDetailsForm;
