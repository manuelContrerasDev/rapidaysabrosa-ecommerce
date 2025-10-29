import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { clp } from "../../utils/currency";
import Button from "../ui/Button";

// ✅ Si el backend ya entrega image_url absoluta, no hace falta procesarla más
const ProductCard: React.FC<{ product: Product; index?: number }> = ({ product }) => {
  const { addToCartSync } = useCart();
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSizeName, setSelectedSizeName] = useState<string | undefined>(
    product.sizes?.[0]?.name
  );

  // ✅ Imagen: usa directamente image_url del backend
  const imageSrc = useMemo(() => {
    const src = (product as any).image_url || (product as any).image;
    return src && /^https?:\/\//i.test(src)
      ? src
      : "/assets/img/placeholder.png";
  }, [product]);

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
      <div className="relative overflow-hidden h-48 bg-black">
        <motion.img
          key={imageSrc}
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover select-none"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.dataset.fallback !== "true") {
              img.src = "/assets/img/placeholder.png";
              img.dataset.fallback = "true";
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
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
                    className={`px-2 py-1 text-xs rounded-full font-medium duration-200 border border-[#FFB703]/40
                      ${
                        selectedSizeName === size.name
                          ? "bg-[#E63946] text-white border-[#E63946]"
                          : "bg-transparent text-[#FFB703] hover:bg-[#E63946]/20 transition-colors"
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
            transition-all duration-300 active:scale-[0.98]"
        >
          <PlusCircle size={18} />
          {isAdded ? "Agregado +1" : "Agregar al Pedido"}
        </Button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);
