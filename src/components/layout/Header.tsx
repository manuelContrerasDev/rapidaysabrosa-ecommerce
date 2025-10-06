// src/components/layout/Header.tsx
import { AnimatePresence,motion } from "framer-motion";
import { Home, List, Menu, Moon, Pizza, ShoppingCart,Sun, X } from "lucide-react";
import React, { useCallback,useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import HeaderPizzaLeft from "../ui/HeaderPizzaLeft";
import HeaderPizzaRight from "../ui/HeaderPizzaRight";

// Nav links
const navLinks = [
  { title: "INICIO", path: "/home", icon: Home },
  { title: "MENU", path: "/catalog", icon: List },
  { title: "MI ORDEN", path: "/order", icon: ShoppingCart },
] as const;

// ✅ Variantes
type HeaderVariant = "yellow" | "gradient";

interface HeaderProps {
  variant?: HeaderVariant;
}

const Header: React.FC<HeaderProps> = ({ variant = "yellow" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Toggle Dark Mode Button
  const DarkModeToggle = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label="Cambiar tema oscuro/claro"
      className="p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center"
          >
            <Sun size={22} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center"
          >
            <Moon size={22} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  // ✅ Clases de variantes
  const headerClasses =
    variant === "yellow"
      ? "bg-brand-yellow text-brand-black"
      : "bg-gradient-to-r from-brand-yellow to-brand-black text-brand-black";

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 ${headerClasses} backdrop-blur-md transition-all duration-500`}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <HeaderPizzaLeft />
            <motion.h1 className="flex items-center text-2xl md:text-4xl font-fire select-none">
              <span
                className={
                  variant === "yellow" ? "text-brand-black" : "text-brand-black"
                }
              >
                Rapida
              </span>
              <motion.div
                whileHover={{ scale: 1.3, rotate: 15 }}
                className="mx-0.5 flex items-center"
              >
                <Pizza
                  size={18}
                  className="text-brand-red drop-shadow"
                  aria-hidden="true"
                />
              </motion.div>
              <span
                className={
                  variant === "yellow" ? "text-brand-red" : "text-brand-yellow"
                }
              >
                Sabrosa
              </span>
            </motion.h1>
            <HeaderPizzaRight />
          </Link>

          {/* Desktop nav */}
          <nav
            role="navigation"
            aria-label="Menú principal"
            className="hidden md:flex items-center h-full"
          >
            {navLinks.map(({ title, path, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1 h-full px-3 py-2 rounded-md font-medium text-xl font-fire transition-colors duration-300
                    ${
                      active
                        ? "text-brand-red"
                        : "text-brand-black hover:text-brand-red"
                    }`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{title}</span>
                </Link>
              );
            })}
            <DarkModeToggle />
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              onClick={toggleMenu}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-md text-brand-black hover:text-brand-red transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full py-2 md:hidden bg-brand-yellow text-brand-black border-t border-brand-red/40 rounded-b-xl"
          >
            <div className="flex flex-col w-full px-4 space-y-1">
              {navLinks.map(({ title, path, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-center gap-2 w-full px-4 py-1 rounded-md font-medium ${
                      active
                        ? "text-brand-red"
                        : "text-brand-black hover:text-brand-red"
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{title}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
