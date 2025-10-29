import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Marquee from "react-fast-marquee";
import ProductSection from "../components/catalog/ProductSection";
import CatalogFiltersUnified from "../components/filters/CatalogFiltersUnified";
import PromotionsCarousel from "../components/promotions/PromotionsCarousel";
import SkeletonSection from "../components/ui/SkeletonSection";
import { ApiProduct } from "../types";

// 🌍 Variables de entorno globales
const API_BASE = import.meta.env.VITE_API_URL;
const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE;

const categoryMap: Record<number, string> = {
  1: "Pizzas con Charcutería",
  2: "Pizzas con Pollo",
  3: "Pizzas con Mechada",
  4: "Pizzas con Filete",
  5: "Pizzas con Camarón",
  6: "Pizzas Vegetarianas",
  7: "Hamburguesas",
  8: "Platos",
  9: "Bebidas",
  10: "Agregados",
  11: "Promociones",
};

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVegetarian, setIsVegetarian] = useState(false);

  const productsRef = useRef<HTMLDivElement | null>(null);

  // 🔁 Fetch de productos desde backend Render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error(`Error al cargar productos (${res.status})`);

        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        // 🧩 Fijar URLs absolutas de imagen (seguro para local y producción)
        const fixed = normalized.map((p: any) => {
          const path = p.image_url?.replace(/^\/+/, "") || "";
          const fullUrl = path.startsWith("http")
            ? path
            : `${IMAGE_BASE}/${path}`;
          return { ...p, image_url: fullUrl };
        });

        setProducts(fixed);
      } catch (err: any) {
        console.error("❌ Error al obtener productos:", err);
        setError(err.message || "Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🧭 Cambio de categoría con scroll suave
  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // 🧮 Filtro local
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter((p) => {
      const categoryName = categoryMap[p.category_id] || "Otros";
      const matchesCategory = selectedCategory ? categoryName === selectedCategory : true;
      const matchesVeggie = isVegetarian ? (p.isVegetarian ?? false) : true;
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesVeggie && matchesSearch;
    });
  }, [products, selectedCategory, isVegetarian, searchTerm]);

  // Categorías únicas
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => categoryMap[p.category_id] || "Otros")
            .filter((cat) => cat !== undefined)
        )
      ),
    [products]
  );

  // Categorías visibles
  const displayedCategories = useMemo(
    () =>
      categories.filter((cat) =>
        filteredProducts.some((p) => categoryMap[p.category_id] === cat)
      ),
    [categories, filteredProducts]
  );

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <p className="text-red-500 font-semibold mb-2">{error}</p>
        <p className="text-gray-500 dark:text-gray-400">
          Verifica tu conexión o intenta nuevamente.
        </p>
      </div>
    );
  }

  // 🌈 Render principal
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.main
          key="skeleton-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonSection key={i} />
          ))}
        </motion.main>
      ) : (
        <motion.div
          key="catalog-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          {/* 🧲 PROMOCIONES */}
          <section
            role="region"
            aria-label="Promociones destacadas"
            className="w-full bg-gradient-to-r from-[#e11d27] via-black to-[#ffb703]"
          >
            <PromotionsCarousel />
            <div className="py-3 sm:py-4 md:py-5" aria-hidden="true">
              <Marquee gradient={false} speed={60} pauseOnHover>
                <span className="px-6 text-base font-bold uppercase text-white sm:text-lg">
                  Rápida & Sabrosa © {new Date().getFullYear()}
                </span>
                <span className="px-6 text-base font-bold uppercase text-yellow-300 sm:text-lg">
                  Pizzas Artesanales © {new Date().getFullYear()}
                </span>
                <span className="px-6 text-base font-bold uppercase text-white sm:text-lg">
                  Delivery Express © {new Date().getFullYear()}
                </span>
              </Marquee>
            </div>
          </section>

          {/* 🧰 FILTROS */}
          <section role="search" aria-label="Filtros" className="relative z-40">
            <CatalogFiltersUnified
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isVegetarian={isVegetarian}
              setIsVegetarian={setIsVegetarian}
            />
          </section>

          <div
            id="products-separator"
            ref={productsRef}
            className="container-custom border-t border-white dark:border-gray-900 mt-6 mb-4"
          />

          <header
            role="heading"
            aria-level={1}
            className="container-custom mt-2 mb-2"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white border-b border-brand-red pb-2">
              Catálogo
            </h1>
          </header>

          {/* 🧱 PRODUCTOS */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <AnimatePresence mode="popLayout">
              {displayedCategories.length > 0 ? (
                displayedCategories.map((category, idx) => {
                  const sectionProducts = filteredProducts.filter(
                    (p) => categoryMap[p.category_id] === category
                  );
                  return (
                    <motion.section
                      key={category}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                    >
                      <ProductSection
                        title={category}
                        products={sectionProducts.map((p) => ({
                          id: String(p.id),
                          name: p.name,
                          description: p.description,
                          price: Number(p.price),
                          image: p.image_url,
                          category: categoryMap[p.category_id],
                          isVegetarian: p.isVegetarian,
                        }))}
                      />
                    </motion.section>
                  );
                })
              ) : (
                <motion.section
                  key="no-products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <h2 className="mb-2 text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                    No se encontraron productos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 sm:text-base">
                    Intenta ajustar tu búsqueda o filtros.
                  </p>
                </motion.section>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CatalogPage;
