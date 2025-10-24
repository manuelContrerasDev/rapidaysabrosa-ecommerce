// src/components/layout/Layout.tsx
import { AnimatePresence } from "framer-motion";
import React, { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import OutletWrapper from "./OutletWrapper";

const Layout: React.FC = () => {
  const { pathname } = useLocation();

  // 📜 Scroll al top en cambio de ruta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* 🔝 Header global */}
      <Header />

      {/* 🧭 Contenido principal con transiciones */}
      <main role="main" className="flex-grow">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20 text-gray-500 dark:text-gray-300">
              <span className="animate-pulse">Cargando contenido...</span>
            </div>
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            <OutletWrapper key={pathname} />
          </AnimatePresence>
        </Suspense>
      </main>

      {/* 👣 Footer global */}
      <Footer />
    </div>
  );
};

export default Layout;
