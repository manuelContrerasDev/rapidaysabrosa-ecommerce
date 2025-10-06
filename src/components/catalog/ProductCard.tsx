import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Flame, Leaf } from "lucide-react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { clp } from "../../utils/currency";

interface ProductCardProps {
  product: Product; // price en CLP entero
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSizeName, setSelectedSizeName] = useState<string | undefined>(
    product.sizes?.[0]?.name
  );

  const selectedSize = useMemo(
    () => product.sizes?.find((s) => s.name === selectedSizeName),
    [product.sizes, selectedSizeName]
  );

  const unitPrice = useMemo(
    () => product.price + (selectedSize?.priceModifier ?? 0),
    [product.price, selectedSize]
  );

  const handleAdd = () => {
    addToCart({
      id: `${product.id}-${selectedSize?.name ?? "default"}`,
      productId: product.id,
      name: product.name,
      size: selectedSize?.name,
      price: unitPrice, // CLP entero
      quantity: 1,
    });
  };

  return (
    <motion.div
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden rounded-t-lg h-48">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.25 }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isNew && (
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.isVegetarian && (
            <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Leaf size={12} className="mr-1" /> Veg
            </span>
          )}
          {product.isSpicy && (
            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Flame size={12} className="mr-1" /> Spicy
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <span className="text-primary-600 font-bold">{clp(unitPrice)}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
          {product.description}
        </p>

        {/* Tamaños opcionales */}
        {!!product.sizes?.length && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Tamaño:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.name}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedSizeName === size.name
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedSizeName(size.name)}
                  aria-pressed={selectedSizeName === size.name}
                >
                  {`${size.name} (${size.size} cm)`}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="flex items-center justify-center gap-2 w-full btn btn-primary mt-auto"
          onClick={handleAdd}
        >
          <PlusCircle size={18} />
          Agregar al Pedido
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);
