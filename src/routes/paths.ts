// src/routes/paths.ts

// Centralización de rutas
export const PATHS = {
  ROOT: "/",
  HOME: "/home",
  CATALOG: "/catalog",
  ORDER: "/order",
  NOT_FOUND: "*",
} as const;

// Tipado automático de las rutas
export type PathKey = keyof typeof PATHS;
export type PathValue = (typeof PATHS)[PathKey];
export const CATALOG = "/catalog";

