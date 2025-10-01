import React from "react";

interface OrderContainerProps {
  children: React.ReactNode;
  className?: string; // Para extender estilos si es necesario
}

/**
 * Contenedor general para la página de pedido.
 * Define padding vertical, altura mínima y centrado del contenido.
 */
const OrderContainer: React.FC<OrderContainerProps> = ({ children, className = "" }) => {
  return (
    <section className={`pt-28 pb-16 min-h-screen flex flex-col ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default OrderContainer;
