import { AnimatePresence,motion } from "framer-motion";
import React from "react";

import { Product } from "../../types";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <motion.section className="px-4 md:px-8" layout>
      <h2 className="text-2xl font-heading text-gray-900 dark:text-white mb-1">{title}</h2>
      <div className="h-1 w-12 sm:w-16 md:w-20 bg-red-600 dark:bg-red-500 rounded mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20 sm:gap-6 auto-rows-[1fr]">
        <AnimatePresence>
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.05 }}
            >
              <ProductCard product={product} index={idx} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default ProductSection;
