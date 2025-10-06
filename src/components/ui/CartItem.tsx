// src/components/ui/CartItem.tsx
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import React, { useMemo } from "react";

import { useCart } from "../../context/CartContext";
import { CartItem as CartItemType } from "../../types";
import { clp } from "../../utils/currency";

interface CartItemProps {
  item: CartItemType; // price en CLP entero
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
    else removeFromCart(item.id);
  };

  const totalPrice = useMemo(() => item.price * item.quantity, [item.price, item.quantity]);

  return (
    <motion.div
      className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      layout
      role="listitem"
    >
      <div className="flex-grow">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">{item.name}</h4>
        {item.size && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tamaño: {item.size}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Controles de cantidad */}
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <button
            onClick={handleDecrement}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
            aria-label="Disminuir cantidad"
          >
            <Minus size={16} />
          </button>
          <span className="px-2 py-1 min-w-[2rem] text-center text-gray-900 dark:text-gray-100" aria-live="polite">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Precio total */}
        <p className="font-medium text-gray-900 dark:text-gray-100 w-24 text-right">
          {clp(totalPrice)}
        </p>

        {/* Botón eliminar */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label="Eliminar producto"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(CartItem);
