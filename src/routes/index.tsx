// src/routes/index.tsx
import { lazy } from "react";
import React from "react";
import { PATHS } from "./paths";

// Lazy loading de páginas
const HomePage = lazy(() => import("../pages/HomePage"));
const CatalogPage = lazy(() => import("../pages/CatalogPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));

// Todas las rutas principales
export const routes = [
  { path: PATHS.HOME, element: <HomePage /> },
  { path: PATHS.CATALOG, element: <CatalogPage /> },
  { path: PATHS.ORDER, element: <OrderPage /> },
  { path: PATHS.NOT_FOUND, element: <NotFoundPage /> },
];

// Rutas con Layout
export const layoutRoutes = routes.map((r) => ({
  path: r.path,
  element: r.element,
}));
