// src/components/layout/Header.tsx
import { AnimatePresence, motion } from "framer-motion";
import { Home, List, Menu, Moon, Pizza, ShoppingCart, Sun, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import HeaderPizzaLeft from "../ui/HeaderPizzaLeft";
import HeaderPizzaRight from "../ui/HeaderPizzaRight";

// Nav links
const navLinks = [
  { title: "INICIO", path: "/home", icon: Home },
  { title: "MENU", path: "/catalog", icon: List },
  { title: "MI ORDEN", path: "/order", icon: ShoppingCart },
] as const;

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

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const DarkModeToggle = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label="Cambiar tema oscuro/claro"
      className="p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition-all duration-300"
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
            <Sun size={22} aria-hidden />
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
            <Moon size={22} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  const headerClasses =
    variant === "yellow"
      ? "bg-brand-yellow text-brand-black"
      : "bg-gradient-to-r from-brand-yellow to-brand-black text-brand-black";

  // Base de link (sin cursiva) + tamaños responsivos: tablet más contenido
  const baseLink =
    "relative cursor-pointer flex items-center gap-1 h-full px-3 py-2 rounded-md font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red " +
    "text-base md:text-[15px] lg:text-lg";

  // Inactivo
  const inactive = "text-brand-black hover:text-brand-red hover:bg-brand-red/10";

  // Activo: fondo “pizza slice” triangular (punta derecha)
  // Triángulo tipo flecha con base a la izquierda y vértice a ~96% horizontal
  // polygon(0% 50%, 8% 0%, 96% 50%, 8% 100%)
  const activePizza =
    "text-white " +
    'before:content-[""] before:absolute before:-z-10 before:inset-y-[-2px] before:inset-x-[-6px] ' +
    "before:bg-brand-red before:shadow-sm " +
    'before:[clip-path:polygon(0%_50%,8%_0%,96%_50%,8%_100%)]';

  // Versión mobile
  const mobileBase =
    "relative cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-base font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red";
  const mobileInactive = "text-brand-black hover:text-brand-red hover:bg-brand-red/10";
  const mobileActive =
    'text-white before:content-[""] before:absolute before:-z-10 before:inset-y-0 before:inset-x-2 ' +
    "before:bg-brand-red before:shadow-sm " +
    'before:[clip-path:polygon(0%_50%,10%_0%,98%_50%,10%_100%)]';

  return (
    <header className={`sticky top-0 left-0 w-full z-50 ${headerClasses} backdrop-blur-md transition-all duration-500`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <HeaderPizzaLeft />
            <motion.h1 className="flex items-center text-2xl md:text-4xl font-fire select-none">
              <span className={variant === "yellow" ? "text-brand-black" : "text-brand-black"}>Rapida</span>
              <motion.div whileHover={{ scale: 1.3, rotate: 15 }} className="mx-0.5 flex items-center">
                <Pizza size={18} className="text-brand-red drop-shadow" aria-hidden />
              </motion.div>
              <span className={variant === "yellow" ? "text-brand-red" : "text-brand-yellow"}>Sabrosa</span>
            </motion.h1>
            <HeaderPizzaRight />
          </Link>

          {/* Desktop nav */}
          <nav role="navigation" aria-label="Menú principal" className="hidden md:flex items-center h-full">
            {navLinks.map(({ title, path, icon: Icon }) => (
              <NavLink key={path} to={path} className={({ isActive }) => `${baseLink} ${isActive ? activePizza : inactive}`}>
                <Icon size={18} aria-hidden />
                <span>{title}</span>
              </NavLink>
            ))}
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
              className="p-2 rounded-md text-brand-black hover:text-brand-red transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
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
              {navLinks.map(({ title, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={({ isActive }) => `${mobileBase} ${isActive ? mobileActive : mobileInactive}`}
                >
                  <Icon size={18} aria-hidden />
                  <span>{title}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
