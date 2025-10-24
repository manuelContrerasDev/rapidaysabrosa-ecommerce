import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Flame, Leaf } from "lucide-react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { clp } from "../../utils/currency";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCartSync } = useCart();
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSizeName, setSelectedSizeName] = useState<string | undefined>(
    product.sizes?.[0]?.name
  );

  const imageSrc =
    product.image || (product as any).image_url || "/assets/img/placeholder.png";

  const selectedSize = useMemo(
    () => product.sizes?.find((s) => s.name === selectedSizeName),
    [product.sizes, selectedSizeName]
  );

  const unitPrice = useMemo(
    () => product.price + (selectedSize?.priceModifier ?? 0),
    [product.price, selectedSize]
  );

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAdded) return;

    const res = addToCartSync({
      id: `${product.id}-${selectedSize?.name ?? "default"}`,
      productId: product.id,
      name: product.name,
      size: selectedSize?.name,
      price: unitPrice,
      quantity: 1,
    });

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + window.scrollY;

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);

    showToast(`+${res.lineQuantity}`, {
      duration: 900,
      position: { x, y: y - 35 },
    });
  };

  return (
    <motion.div
      className="card flex flex-col h-full max-w-[320px] mx-auto
        bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]
        border border-[#FFB703] rounded-xl overflow-hidden
        shadow-[0_4px_10px_rgba(0,0,0,0.4)]
        hover:shadow-[0_0_12px_rgba(255,183,3,0.35)]
        transition-all duration-300"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 🖼 Imagen */}
      <div className="relative overflow-hidden h-48">
        <motion.img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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
          {product.isNew && (
            <span className="bg-[#FFB703] text-black text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isVegetarian && (
            <span className="bg-[#E8F5E9] text-[#16a34a] text-xs px-2 py-1 rounded-full flex items-center">
              <Leaf size={12} className="mr-1" /> Veg
            </span>
          )}
          {product.isSpicy && (
            <span className="bg-[#E63946] text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Flame size={12} className="mr-1" /> Spicy
            </span>
          )}
        </div>
      </div>

      {/* 🧾 Contenido */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-[#FFB703] tracking-wide">
              {product.name}
            </h3>
            <span className="text-white font-bold">{clp(unitPrice)}</span>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-snug">
            {product.description}
          </p>

          {!!product.sizes?.length && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Tamaño:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    className={`px-2 py-1 text-xs rounded-full font-medium transition-all duration-200 border border-[#FFB703]/40
                      ${
                        selectedSizeName === size.name
                          ? "bg-[#E63946] text-white border-[#E63946]"
                          : "bg-transparent text-[#FFB703] hover:bg-[#E63946]/20"
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
        </div>

        {/* 🛒 Botón */}
        <Button
          onClick={handleAdd}
          variant="primary"
          isActive={isAdded}
          pulseOnActive
          className="mt-auto w-full flex items-center justify-center gap-2 
            bg-[#E63946] hover:bg-[#C53030]
            text-white font-bold py-2 rounded-lg
            border border-[#FFB703]/60 shadow-[0_0_8px_rgba(255,183,3,0.3)]
            transition-all duration-300"
        >
          <PlusCircle size={18} />
          {isAdded ? "Agregado ✅" : "Agregar al Pedido"}
        </Button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);
