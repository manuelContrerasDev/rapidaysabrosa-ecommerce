// src/components/layout/Header.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Pizza, Moon, Sun, Home, List, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import HeaderPizzaLeft from "../ui/HeaderPizzaLeft";
import HeaderPizzaRight from "../ui/HeaderPizzaRight";

// Nav links
const navLinks = [
  { title: "INICIO", path: "/home", icon: Home },
  { title: "MENU", path: "/catalog", icon: List },
  { title: "MI ORDEN", path: "/order", icon: ShoppingCart },
] as const;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
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

  return (
    <header
      className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 dark:from-yellow-500 dark:via-red-700 dark:to-red-900 backdrop-blur-md transition-all duration-500"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-12 md:h-16">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <HeaderPizzaLeft />

            {/* Marca */}
            <motion.h1 className="flex items-center text-2xl md:text-4xl font-fire select-none">
              <span className="text-white dark:text-black drop-shadow-md">Rapida</span>
              <motion.div whileHover={{ scale: 1.3, rotate: 15 }} className="mx-0.5 flex items-center">
                <Pizza size={18} className="text-yellow-400 drop-shadow" aria-hidden="true" />
              </motion.div>
              <span className="text-black dark:text-white drop-shadow-md">Sabrosa</span>
            </motion.h1>

            <HeaderPizzaRight />
          </Link>

          {/* Desktop nav */}
          <nav role="navigation" aria-label="Menú principal" className="hidden md:flex items-center h-full">
            {navLinks.map(({ title, path, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-1 h-full px-3 py-2 rounded-md font-medium transition-colors duration-300
                    text-2xl md:text-2xl font-fire select-none ${
                    active
                      ? isDarkMode ? "text-black" : "text-white"
                      : isDarkMode ? "text-white hover:text-yellow-300" : "text-black hover:text-yellow-700"
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
              className="p-2 rounded-md text-black dark:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
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
            className={`absolute top-full left-0 w-full py-2 md:hidden backdrop-blur-sm border-t text-dark dark:text-white border-white/30 rounded-b-xl overflow-hidden
              ${isDarkMode
                ? "bg-gray-900/95"
                : "bg-white/95"}
            `}
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
                    className={`flex items-center justify-center gap-2 w-full px-4 pb-1 rounded-md font-medium ${
                      active
                        ? "bg-yellow-300 text-black"
                        : "hover:bg-gray-400 dark:hover:bg-gray-700"
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
