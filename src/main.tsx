// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/common/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <CartProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </CartProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
