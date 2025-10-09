// src/main.tsx
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

// 👇 importa las fuentes aquí
import "@fontsource/anton";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        {/* 🔸 El ToastProvider debe envolver todo el árbol para estar disponible globalmente */}
        <ToastProvider>
          <CartProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
