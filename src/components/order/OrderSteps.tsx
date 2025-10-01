import React from "react";
import { ShoppingCart, CreditCard, Check } from "lucide-react";

interface OrderStepsProps {
  currentStep: "cart" | "details" | "confirmation";
}

const steps = [
  { id: "cart", label: "Carrito", icon: ShoppingCart },
  { id: "details", label: "Detalles", icon: CreditCard },
  { id: "confirmation", label: "Confirmación", icon: Check },
] as const;

/**
 * Componente que muestra el progreso de los pasos del pedido.
 * Resalta el paso actual y marca los pasos completados.
 */
const OrderSteps: React.FC<OrderStepsProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Progreso del Pedido" className="mb-8">
      <ol className="flex justify-between items-center max-w-xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <li key={step.id} className="flex flex-col items-center relative flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300
                  ${isActive ? "bg-primary-600" : isCompleted ? "bg-primary-400" : "bg-gray-300 dark:bg-gray-700"}`}
              >
                <Icon size={18} />
              </div>
              <span className="text-sm mt-2 text-gray-900 dark:text-white text-center">
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-1/2 left-full h-1 -translate-y-1/2 bg-gray-300 dark:bg-gray-600
                    ${isCompleted ? "bg-primary-400" : ""}`}
                  style={{ width: "100%" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default OrderSteps;
