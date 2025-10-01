// src/App.tsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { PATHS } from "./routes/paths";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoaderPage from "./components/common/LoaderPage";

// Lazy load de páginas
const HomePage = lazy(() => import("./pages/HomePage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const NotFoundPage = lazy(() => import("./pages/errors/NotFoundPage"));

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoaderPage />}>
          <Routes>
            {/* Layout principal */}
            <Route element={<Layout />}>
              {/* Redirección raíz */}
              <Route path={PATHS.ROOT} element={<Navigate to={PATHS.CATALOG} replace />} />

              {/* Rutas principales */}
              <Route path={PATHS.HOME} element={<HomePage />} />
              <Route path={PATHS.CATALOG} element={<CatalogPage />} />
              <Route path={PATHS.ORDER} element={<OrderPage />} />

              {/* Catch-all 404 */}
              <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
