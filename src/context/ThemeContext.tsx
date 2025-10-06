import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("❌ useTheme debe usarse dentro de un ThemeProvider");
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 🔹 Preferencia inicial: guardada o basada en el sistema
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  // 🔹 Aplicar la clase "dark" al <html> y guardar preferencia
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 🔹 Sincronizar automáticamente con los cambios del sistema
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("darkMode");
      // Solo actualizar si el usuario no eligió manualmente un tema
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Escuchar cambios del sistema operativo
    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, []);

  // 🔹 Alternar manualmente el tema (respetando la preferencia del usuario)
  const toggleDarkMode = () => setIsDarkMode((prev: boolean) => !prev);

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
