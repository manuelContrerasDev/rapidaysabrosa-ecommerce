import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SkeletonCard from "./SkeletonCard";

/**
 * SkeletonSection — versión adaptativa
 * Muestra un título simulado con un número de cards ajustado al viewport
 * (2 en mobile, 4 en pantallas grandes)
 */
const SkeletonSection: React.FC = () => {
  const [cardsCount, setCardsCount] = useState(4);

  // Detecta ancho de pantalla para ajustar cantidad de skeletons
  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsCount(2); // sm: breakpoint
      else if (width < 1024) setCardsCount(3);
      else setCardsCount(4);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <motion.section
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-4 md:px-8 mb-16"
    >
      {/* 🔹 Título simulado */}
      <div className="mb-4">
        <div className="h-6 w-1/4 bg-gradient-to-r from-brand-red to-brand-yellow rounded-md mb-2" />
        <div className="h-1 w-16 bg-brand-red/80 rounded-md" />
      </div>

      {/* 🔸 Cards skeleton adaptativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </motion.section>
  );
};

export default SkeletonSection;
