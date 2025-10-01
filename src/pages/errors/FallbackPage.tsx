// src/pages/FallbackPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertOctagon } from "lucide-react";

interface FallbackPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const FallbackPage: React.FC<FallbackPageProps> = ({ error, resetErrorBoundary }) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      {/* SEO / Meta tags */}
      <Helmet>
        <title>Error inesperado | Rapida&Sabrosa</title>
        <meta
          name="description"
          content="Ocurrió un error inesperado en Rapida&Sabrosa. Intenta recargar la página o vuelve al inicio."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Icono de error */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-800 mb-6">
        <AlertOctagon size={40} className="text-red-600 dark:text-red-300" aria-hidden="true" />
      </div>

      {/* Mensajes */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        ¡Ups! Algo salió mal
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
        Ocurrió un error inesperado. Puedes recargar la página o volver al inicio para seguir navegando.
      </p>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4">
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="btn btn-primary px-6 py-3 font-semibold rounded-md"
          >
            Reintentar
          </button>
        )}
        <Link to="/home" className="btn btn-secondary px-6 py-3 font-semibold rounded-md">
          Ir al Inicio
        </Link>
      </div>

      {/* Debug info opcional */}
      {error && (
        <pre className="mt-6 text-xs text-red-500 bg-red-50 dark:bg-gray-800 dark:text-red-400 p-4 rounded-md max-w-xl overflow-auto">
          {error.message}
        </pre>
      )}
    </main>
  );
};

export default FallbackPage;
