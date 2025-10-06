// src/components/catalog/PizzaCard.tsx
import { motion } from "framer-motion";
import { Flame, Leaf,PlusCircle } from "lucide-react";
import React, { useMemo,useState } from "react";

import { useCart } from "../../context/CartContext";
import { Pizza, PizzaSize } from "../../types";
import { clp } from "../../utils/currency";

interface PizzaCardProps {
  pizza: Pizza; // price en CLP entero
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(pizza.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const displayPrice = useMemo(
    () => pizza.price + (selectedSize?.priceModifier ?? 0),
    [pizza.price, selectedSize]
  );

  const handleAddToCart = () => {
    addToCart({
      id: `${pizza.id}-${selectedSize.name}`, // será reemplazado por addToCart (uniqueId), pero deja rastro
      productId: pizza.id,
      name: pizza.name,
      size: selectedSize.name,
      price: displayPrice, // CLP entero
      quantity: 1,
    });
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="card h-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-lg h-48">
        <motion.img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {pizza.isNew && (
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>
          )}
          {pizza.isVegetarian && (
            <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Leaf size={12} className="mr-1" /> Veg
            </span>
          )}
          {pizza.isSpicy && (
            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Flame size={12} className="mr-1" /> Spicy
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pizza.name}</h3>
          <span className="text-primary-600 font-bold">{clp(displayPrice)}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{pizza.description}</p>

        <div className="mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Tamaño:</p>
          <div className="flex flex-wrap gap-2">
            {pizza.sizes.map((size) => (
              <button
                key={size.name}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  selectedSize.name === size.name
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize.name === size.name}
              >
                {`${size.name} (${size.size} cm)`}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 w-full btn btn-primary mt-auto" onClick={handleAddToCart}>
          <PlusCircle size={18} />
          Agregar al Pedido
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(PizzaCard);
