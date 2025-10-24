import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Marquee from "react-fast-marquee";

import ProductSection from "../components/catalog/ProductSection";
import CatalogFiltersUnified from "../components/filters/CatalogFiltersUnified";
import PromotionsCarousel from "../components/promotions/PromotionsCarousel";
//import { Product } from "../types";
import { ApiProduct } from "../types";


// ✅ URL de la API backend (Render)
const API_URL = import.meta.env.VITE_API_URL || "https://rapidaysabrosa-api.onrender.com/api/products";

// 🏷️ Mapa de categorías desde tu base de datos (category_id)
const categoryMap: Record<number, string> = {
  1: "Pizzas Clásicas",
  4: "Pizzas BBQ",
  5: "Pizzas Premium",
  7: "Hamburguesas",
  8: "Platos",
  9: "Bebidas",
};

const CatalogPage: React.FC = () => {
  //const [products, setProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVegetarian, setIsVegetarian] = useState(false);

  const productsRef = useRef<HTMLDivElement | null>(null);

  // 🔁 Fetch productos desde el backend (con detección de estructura)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error al cargar productos (${res.status})`);

        const text = await res.text();
        const data = JSON.parse(text);

        // ✅ Normalizamos según estructura { meta, data: [...] }
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

          const fixed = normalized.map((p: any) => ({
          ...p,
          image_url: p.image_url?.startsWith("http")
            ? p.image_url
            : `https://rapidaysabrosa-api.onrender.com/${p.image_url?.replace(/^\/+/, "")}`,
        }));

        setProducts(fixed);

        if (!Array.isArray(normalized)) throw new Error("Formato de respuesta inválido");
        setProducts(normalized);
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

  // 🧮 Filtrado inteligente
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

  // 🏷️ Categorías únicas según los productos filtrados
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

  // 📊 Solo mostrar las categorías con resultados visibles
  const displayedCategories = useMemo(
    () =>
      categories.filter((cat) =>
        filteredProducts.some(
          (p) => categoryMap[p.category_id] === cat
        )
      ),
    [categories, filteredProducts]
  );

  // 💬 Estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="text-xl text-gray-700 dark:text-gray-300"
        >
          Cargando productos...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <p className="text-red-500 font-semibold mb-2">
          {error}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Verifica tu conexión o intenta nuevamente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* 🧲 PROMOCIONES + MARQUEE */}
      <section
        role="region"
        aria-label="Promociones destacadas"
        className="w-full"
        style={{ background: "linear-gradient(to right, #dc2626, #f97316, #facc15)" }}
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
      <section role="search" aria-label="Filtros de productos" className="relative z-40">
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

      {/* 📍 SEPARADOR */}
      <div
        id="products-separator"
        ref={productsRef}
        className="container-custom border-t border-white dark:border-gray-900 mt-6 mb-4"
      />

      {/* 🧾 TÍTULO PRINCIPAL */}
      <header role="heading" aria-level={1} className="container-custom mt-2 mb-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white border-b border-red-700 dark:border-gray-700 pb-2">
          Catálogo
        </h1>
      </header>

      {/* 🧱 CONTENIDO PRINCIPAL */}
      <main
        role="main"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1"
      >
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
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.1,
                    ease: "easeOut",
                  }}
                  aria-labelledby={`section-${category}`}
                >
                  <ProductSection
                    title={category}
                    products={sectionProducts.map((p) => ({
                      id: String(p.id), // ✅ conversión segura
                      name: p.name,
                      description: p.description,
                      price: Number(p.price),
                      image: p.image_url,
                      category: categoryMap[p.category_id],
                      isVegetarian: false,
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
              exit={{ opacity: 0, y: 20 }}
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
    </div>
  );
};

export default CatalogPage;
