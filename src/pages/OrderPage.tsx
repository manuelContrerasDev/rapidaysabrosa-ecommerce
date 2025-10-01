import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useCart } from "../context/CartContext";
import { useCartTotal } from "../hooks/useCartTotal";
import OrderContainer from "../components/order/OrderContainer";
import OrderSteps from "../components/order/OrderSteps";
import CartItem from "../components/ui/CartItem";
import OrderDetailsForm from "../components/order/OrderDetailsForm";
import OrderSummary from "../components/order/OrderSummary";
import OrderConfirmation from "../components/order/OrderConfirmation";

/**
 * Componente para mostrar carrito vacío.
 */
const EmptyCart: React.FC = () => (
  <motion.div
    key="empty"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-12"
    role="status"
    aria-live="polite"
  >
    <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
      Tu carrito está vacío
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Aún no has agregado productos a tu pedido.
    </p>
    <Link
      to="/catalog"
      className="btn btn-primary px-6 py-3 font-semibold rounded-lg"
    >
      Explorar Nuestro Menú
    </Link>
  </motion.div>
);

/**
 * Página de pedido.
 * Maneja flujo de carrito → formulario → confirmación.
 */
const OrderPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const { subtotal, tax, discount, total } = useCartTotal(0.19, 0); // IVA 19%, sin descuento

  // 🔹 Estado de pasos del flujo
  const [step, setStep] = useState<"cart" | "details" | "confirmation">("cart");

  // 🔹 Estado del formulario de pedido
  const [form, setForm] = useState({
    customerName: "",
    contactNumber: "",
    deliveryAddress: "",
    paymentMethod: "cash" as "cash" | "card" | "online",
    notes: "",
  });

  // 🔹 Errores de validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 🔹 ID de pedido generado
  const [orderId, setOrderId] = useState("");

  /**
   * Actualiza campos del formulario.
   * @param e Evento de input/select/textarea
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /**
   * Envía formulario de pedido.
   * Valida campos obligatorios y formato de teléfono.
   * Genera orderId y limpia carrito.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!form.customerName) errors.customerName = "Nombre requerido";

    // Validación básica de teléfono: solo números y mínimo 7 dígitos
    if (!form.contactNumber || !/^\d{7,}$/.test(form.contactNumber)) {
      errors.contactNumber = "Número válido requerido";
    }

    if (!form.deliveryAddress) errors.deliveryAddress = "Dirección requerida";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Genera ID único de pedido
    setOrderId(uuidv4());
    setStep("confirmation");
    clearCart();
  };

  /** Regresa al paso de carrito desde formulario */
  const goBackToCart = () => setStep("cart");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <OrderContainer>
        <h1 className="sr-only">Página de Pedido</h1>
        <OrderSteps currentStep={step} />

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Paso 1: Carrito */}
              {step === "cart" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 space-y-4">
                    {items.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    <OrderSummary
                      items={items}
                      subtotal={subtotal}
                      tax={tax}
                      discount={discount}
                      total={total}
                    />
                    <button
                      className="btn btn-primary w-full mt-2"
                      onClick={() => setStep("details")}
                    >
                      Pagar
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Formulario */}
              {step === "details" && (
                <OrderDetailsForm
                  form={form}
                  validationErrors={validationErrors}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  goBack={goBackToCart}
                />
              )}

              {/* Paso 3: Confirmación */}
              {step === "confirmation" && (
                <OrderConfirmation orderId={orderId} form={form} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </OrderContainer>
    </div>
  );
};

export default OrderPage;
