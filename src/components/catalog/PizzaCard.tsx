// src/components/catalog/PizzaCard.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Leaf, PlusCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Pizza, PizzaSize } from "../../types";
import { clp } from "../../utils/currency";
import { useToast } from "../../context/ToastContext";

interface PizzaCardProps {
  pizza: Pizza;
}

const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE as string | undefined;

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(pizza.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);

  const { addToCartSync } = useCart();
  const { showToast } = useToast();

  // 🧩 Construir URL absoluta para la imagen
  const imageSrc = useMemo(() => {
    const raw = pizza.image || (pizza as any).image_url;
    if (!raw) return "/assets/img/placeholder.png";
    if (typeof raw === "string" && raw.startsWith("http")) return raw;
    const base = IMAGE_BASE ?? "";
    return `${base}/${String(raw).replace(/^\/+/, "")}`;
  }, [pizza]);

  const displayPrice = useMemo(
    () => pizza.price + (selectedSize?.priceModifier ?? 0),
    [pizza.price, selectedSize]
  );

  const handleAddToCart = () => {
    const res = addToCartSync({
      id: `${pizza.id}-${selectedSize.name}`,
      productId: pizza.id,
      name: pizza.name,
      size: selectedSize.name,
      price: displayPrice,
      quantity: 1,
    });
    showToast(`${pizza.name} (${selectedSize.name}) · x${res.lineQuantity}`);
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
      {/* 🖼 Imagen */}
      <div className="relative overflow-hidden rounded-t-lg h-48">
        <motion.img
          src={imageSrc}
          alt={pizza.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.dataset.fallback !== "true") {
              img.src = "/assets/img/placeholder.png";
              img.dataset.fallback = "true";
            }
          }}
        />

        {/* Etiquetas */}
        <div className="absolute top-2 left-2 flex gap-1">
          {pizza.isNew && (
            <span className="bg-[#FFB703] text-black text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {pizza.isVegetarian && (
            <span className="bg-[#E8F5E9] text-[#16a34a] text-xs px-2 py-1 rounded-full flex items-center">
              <Leaf size={12} className="mr-1" /> Veg
            </span>
          )}
          {pizza.isSpicy && (
            <span className="bg-[#E63946] text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Flame size={12} className="mr-1" /> Spicy
            </span>
          )}
        </div>
      </div>

      {/* 🧾 Contenido */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {pizza.name}
          </h3>
          <span className="text-[#FFB703] font-bold">{clp(displayPrice)}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
          {pizza.description}
        </p>

        {/* 🧩 Selector de tamaño */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Tamaño:</p>
          <div className="flex flex-wrap gap-2">
            {pizza.sizes.map((size) => (
              <button
                key={size.name}
                type="button"
                className={`px-2 py-1 text-xs rounded-full font-medium duration-200 border border-[#FFB703]/40
                  ${
                    selectedSize.name === size.name
                      ? "bg-[#E63946] text-white border-[#E63946]"
                      : "bg-transparent text-[#FFB703] hover:bg-[#E63946]/20 transition-colors"
                  }`}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize.name === size.name}
              >
                {`${size.name} (${size.size} cm)`}
              </button>
            ))}
          </div>
        </div>

        {/* 🛒 Botón agregar */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full mt-auto active:scale-[0.98]
            bg-[#E63946] hover:bg-[#C53030]
            text-white font-bold py-2 rounded-lg
            border border-[#FFB703]/60 shadow-[0_0_8px_rgba(255,183,3,0.3)]
            transition-all duration-300"
          onClick={handleAddToCart}
        >
          <PlusCircle size={18} />
          Agregar al Pedido
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(PizzaCard);
