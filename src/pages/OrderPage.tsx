// src/pages/OrderPage.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
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
    <Link to="/catalog" className="btn btn-primary px-6 py-3 font-semibold rounded-lg">
      Explorar Nuestro Menú
    </Link>
  </motion.div>
);

// Util opcional para un código de pedido “amigable”
const genOrderCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // yyyymmdd
  return `RS-${date}-${uuidv4().slice(0, 6).toUpperCase()}`;
};

/**
 * Página de pedido: carrito → formulario → confirmación.
 */
const OrderPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const { subtotal, tax, discount, total } = useCartTotal(0.19, 0); // IVA 19%, sin descuento

  const [step, setStep] = useState<"cart" | "details" | "confirmation">("cart");
  const [orderId, setOrderId] = useState("");

  // Form state
  const [form, setForm] = useState({
    customerName: "",
    contactNumber: "",
    deliveryAddress: "",
    paymentMethod: "cash" as "cash" | "card" | "online",
    notes: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Guard: si estoy en details y se vacía el carrito, vuelve a cart (pero nunca interrumpas confirmation)
  useEffect(() => {
    if (step !== "confirmation" && items.length === 0) {
      setStep("cart");
    }
  }, [items.length, step]);

  // Mejora UX: scroll top al cambiar de step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const canProceedToDetails = useMemo(() => items.length > 0, [items.length]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errors: Record<string, string> = {};

      if (!form.customerName.trim()) errors.customerName = "Nombre requerido";

      // Chile: si vas a endurecer validación más adelante, puedes usar una regex +56 9 XXXXXXXX:
      // const chilePhone = /^(?:\+?56)?\s?(?:0?9)\d{8}$/;
      if (!form.contactNumber || !/^\d{7,}$/.test(form.contactNumber)) {
        errors.contactNumber = "Número válido requerido";
      }

      if (!form.deliveryAddress.trim()) errors.deliveryAddress = "Dirección requerida";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      const code = genOrderCode();
      setOrderId(code);
      setStep("confirmation");
      clearCart(); // ← Ya no rompe la UI porque confirmación no depende de items
    },
    [form, clearCart]
  );

  const goBackToCart = useCallback(() => setStep("cart"), []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <OrderContainer>
        <h1 className="sr-only">Página de Pedido</h1>
        <OrderSteps currentStep={step} />

        <AnimatePresence mode="wait" initial={false}>
          {/* Renderiza por step: evita que el carrito vacío tape la confirmación */}
          {step === "cart" && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 space-y-4">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    <OrderSummary items={items} subtotal={subtotal} tax={tax} discount={discount} total={total} />
                    <button
                      className="btn btn-primary w-full mt-2"
                      onClick={() => setStep("details")}
                      disabled={!canProceedToDetails}
                    >
                      Pagar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {items.length === 0 ? (
                // Guard extra (por si el carrito se vació aquí)
                <EmptyCart />
              ) : (
                <OrderDetailsForm
                  form={form}
                  validationErrors={validationErrors}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  goBack={goBackToCart}
                />
              )}
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <OrderConfirmation orderId={orderId} form={form} />
            </motion.div>
          )}
        </AnimatePresence>
      </OrderContainer>
    </div>
  );
};

export default OrderPage;
