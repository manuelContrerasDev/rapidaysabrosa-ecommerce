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
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative overflow-hidden rounded-t-lg h-48">
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
            // ✅ Evita reintentar infinitamente
            if (img.dataset.fallback !== "true") {
              img.src = "/assets/img/placeholder.png";
              img.dataset.fallback = "true";
            }
          }}
        />


        <div className="absolute top-2 left-2 flex gap-1">
          {product.isNew && (
            <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.isVegetarian && (
            <span className="bg-brand-yellow text-black text-xs px-2 py-1 rounded-full flex items-center">
              <Leaf size={12} className="mr-1" /> Veg
            </span>
          )}
          {product.isSpicy && (
            <span className="bg-brand-black text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Flame size={12} className="mr-1" /> Spicy
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <span className="text-brand-yellow font-bold">{clp(unitPrice)}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
          {product.description}
        </p>

        {!!product.sizes?.length && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Tamaño:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.name}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedSizeName === size.name
                      ? "bg-brand-red text-white"
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

        <Button
          onClick={handleAdd}
          variant="primary"
          isActive={isAdded}
          pulseOnActive
          className="mt-auto w-full flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          {isAdded ? "Agregado ✅" : "Agregar al Pedido"}
        </Button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);
