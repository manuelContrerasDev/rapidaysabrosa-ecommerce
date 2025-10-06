// src/pages/NotFoundPage.tsx
import { AlertTriangle } from "lucide-react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      {/* SEO / Meta tags */}
      <Helmet>
        <title>404 | Página no encontrada - Rapida&Sabrosa</title>
        <meta
          name="description"
          content="La página que buscas no existe. Vuelve al inicio o revisa nuestro catálogo de pizzas artesanales."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Icono de advertencia */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-800 mb-6">
        <AlertTriangle size={40} className="text-red-600 dark:text-red-300" aria-hidden="true" />
      </div>

      {/* Título principal */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
        404 - Página no encontrada
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
        Lo sentimos, la página que buscas no existe o fue movida.
        Puedes volver al inicio o explorar nuestro catálogo de pizzas artesanales.
      </p>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/home"
          className="btn btn-primary px-6 py-3 font-semibold rounded-md"
        >
          Ir al Inicio
        </Link>
        <Link
          to="/catalog"
          className="btn btn-secondary px-6 py-3 font-semibold rounded-md"
        >
          Ver Catálogo
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
