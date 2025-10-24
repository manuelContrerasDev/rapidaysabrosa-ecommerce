// src/components/filters/CatalogFiltersUnified.tsx
import React, { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";

interface CatalogFiltersUnifiedProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isVegetarian: boolean;
  setIsVegetarian: (val: boolean) => void;
}

const CatalogFiltersUnified: React.FC<CatalogFiltersUnifiedProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  isVegetarian,
  setIsVegetarian,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const searchId = useId();
  const vegId = useId();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    // set inicial por si entra scrolleado
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll as EventListener);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-[clamp(52px,7vh,70px)] z-40 w-full mx-auto px-2 md:px-4 md:py-2
        border-b border-gray-200/40 dark:border-gray-700/40
        backdrop-blur-md transition-all duration-300
        ${
          scrolled
            ? "bg-white/50 dark:bg-gray-900/50 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
            : "bg-white/40 dark:bg-gray-900/40"
        }`}
    >


      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* 🔎 Buscador */}
        <div className={`${scrolled ? "mt-[2px]" : "mt-1"}`}>
          <label htmlFor={searchId} className="sr-only">
            Buscar
          </label>
          <motion.input
            id={searchId}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            placeholder="Buscar..."
            autoComplete="off"
            aria-label="Buscar en el catálogo"
            className={`
              w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3
              px-2 sm:px-3 md:px-4
              py-0.5 sm:py-1
              rounded-md text-xs sm:text-sm md:text-base
              bg-gray-200/50 dark:bg-gray-700/50
              border border-gray-300/40 dark:border-gray-600/40
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-1 focus:ring-red-500
              placeholder-gray-500 dark:placeholder-gray-400
              transition-all duration-200
            `}
          />
        </div>

        {/* 🏷️ Filtros */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`
            relative flex gap-1 md:gap-2
            overflow-x-auto sm:overflow-visible
            no-scrollbar transition-all duration-200
            ${scrolled ? "mt-[5px]" : "mt-1"}
          `}
        >
          {/* Checkbox vegetariano */}
          <label
            htmlFor={vegId}
            className="flex items-center gap-1 text-xs md:text-sm lg:text-base cursor-pointer text-gray-900 dark:text-white flex-shrink-0"
          >
            <input
              id={vegId}
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.currentTarget.checked)}
              className="w-3 h-3 md:w-4 md:h-5 accent-red-600"
              aria-label="Filtrar solo vegetarianos"
            />
            Veg.
          </label>

          {/* Botones de categorías */}
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              type="button"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              aria-pressed={selectedCategory === cat}
              className={`px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs md:text-sm lg:text-base font-medium transition-colors duration-200 flex-shrink-0 whitespace-nowrap
                ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white dark:bg-red-500 dark:text-white shadow-sm"
                    : "bg-gray-200/50 hover:bg-gray-300/60 dark:bg-gray-700/50 dark:hover:bg-gray-600/60 dark:text-gray-200"
                }`}
            >
              {cat}
            </motion.button>
          ))}

          {/* Fades decorativos */}
          <div
            className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white/80 dark:from-gray-900/80 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/80 dark:from-gray-900/80 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(CatalogFiltersUnified);
