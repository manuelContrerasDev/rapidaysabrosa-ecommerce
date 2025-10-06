import { AnimatePresence,motion } from "framer-motion";
import React, { useMemo, useRef,useState } from "react";
import Marquee from "react-fast-marquee";

import ProductSection from "../components/catalog/ProductSection";
import CatalogFiltersUnified from "../components/filters/CatalogFiltersUnified";
import PromotionsCarousel from "../components/promotions/PromotionsCarousel";
import { burgers, desserts,drinks, pizzas } from "../data";
import { Product } from "../types";

const allProducts: Product[] = [...pizzas, ...burgers, ...drinks, ...desserts];

const CatalogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVegetarian, setIsVegetarian] = useState(false);

  // 👉 referencia al separador
  const productsRef = useRef<HTMLDivElement | null>(null);

  // Forzar scroll al separador al cambiar categoría
  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (isVegetarian) result = result.filter((p) => p.isVegetarian);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.ingredients && p.ingredients.some((i) => i.toLowerCase().includes(term)))
      );
    }
    return result;
  }, [selectedCategory, isVegetarian, searchTerm]);

  const categories = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.category))),
    []
  );

  const displayedCategories = useMemo(
    () => categories.filter((cat) => filteredProducts.some((p) => p.category === cat)),
    [categories, filteredProducts]
  );

  return (
    <div className="flex flex-col">
      {/* Carousel + Marquee */}
      <div
        className="w-full"
        style={{ background: "linear-gradient(to right, #dc2626, #f97316, #facc15)" }}
      >
        <PromotionsCarousel />
        <div className="py-3 sm:py-4 md:py-5" aria-hidden="true">
          <Marquee gradient={false} speed={65} pauseOnHover>
            <span className="px-6 text-base font-bold uppercase text-white sm:text-lg">
              Rápida & Sabrosa &copy; {new Date().getFullYear()}
            </span>
            <span className="px-6 text-base font-bold uppercase text-yellow-300 sm:text-lg">
              Pizzas Artesanales &copy; {new Date().getFullYear()}
            </span>
            <span className="px-6 text-base font-bold uppercase text-white sm:text-lg">
              Delivery Express &copy; {new Date().getFullYear()}
            </span>
          </Marquee>
        </div>
      </div>

      {/* Filtros */}
      <CatalogFiltersUnified
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange} // 👈 scroll forzado aquí
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isVegetarian={isVegetarian}
        setIsVegetarian={setIsVegetarian}
      />

      {/* Separador de referencia */}
      <div
        id="products-separator"
        ref={productsRef}
        className="container-custom border-t border-white dark:border-gray-900 mt-6 mb-4 gap-4"
      />

      {/* Título catálogo */}
      <div className="container-custom mt-2 mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl border-b border-red-700 dark:border-gray-700 pb-2">
          Catálogo
        </h1>
      </div>

      {/* Secciones de productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <AnimatePresence>
          {displayedCategories.length > 0 ? (
            displayedCategories.map((category, idx) => {
              const sectionProducts = filteredProducts.filter(
                (p) => p.category === category
              );

              return (
                <motion.div
                  key={category}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                >
                  <ProductSection title={category} products={sectionProducts} />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="no-products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-12"
            >
              <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                No se encontraron productos
              </h2>
              <p className="text-gray-600 dark:text-gray-300 sm:text-base">
                Intenta ajustar tu búsqueda o filtros.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CatalogPage;
