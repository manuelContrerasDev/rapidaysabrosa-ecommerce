import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const IMAGE_HEIGHT = 160; // altura fija para desktop
const MOBILE_IMAGE_WIDTH = 120; // ancho fijo en mobile

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      size: product.sizes ? product.sizes[0].name : undefined,
      price: product.price,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: "easeOut" }}
      className="flex flex-col sm:flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden relative"
    >
      {/* Mobile horizontal layout */}
      <div className="flex sm:flex-col">
        <div
          className="flex-shrink-0 w-1/3 sm:w-full h-full"
          style={{ height: IMAGE_HEIGHT }}
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />
        </div>

        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-1">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-red-600 dark:text-red-400 font-bold text-sm sm:text-lg">
              ${product.price.toFixed(2)}
            </span>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-xl shadow text-white
                ${added ? "bg-green-500 dark:bg-green-400" : "bg-red-600 dark:bg-red-500"}
                hover:${added ? "bg-green-600 dark:bg-green-500" : "bg-red-700 dark:bg-red-600"}`}
              onClick={handleAddToCart}
            >
              {added ? "Agregado" : "Agregar"}
            </motion.button>
          </div>
        </div>
      </div>

      {added && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow"
        >
          Agregando +1
        </motion.span>
      )}
    </motion.div>
  );
};

export default ProductCard;
