import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  List,
  Menu,
  Moon,
  Pizza,
  ShoppingCart,
  Sun,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import HeaderPizzaLeft from "../ui/HeaderPizzaLeft";
import HeaderPizzaRight from "../ui/HeaderPizzaRight";

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
  const [cartChange, setCartChange] = useState<number | null>(null); // 👈 feed +1 animado
  const { pathname } = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Detectar cambios en cantidad
  useEffect(() => {
    if (totalItems > 0) {
      setCartChange(totalItems);
      const timer = setTimeout(() => setCartChange(null), 800);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // 🔆 Toggle DarkMode
  const DarkModeToggle = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label="Cambiar tema oscuro/claro"
      className="p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition-all duration-300"
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

  // 🛒 Botón de Carrito sincronizado + animación + contador
  const CartButton = () => (
    <motion.div className="relative flex items-center justify-center">
      <Link
        to="/order"
        aria-label="Ver carrito"
        className="relative p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      >
        <ShoppingCart size={22} aria-hidden />
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute -top-1 -right-1 bg-brand-red text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </Link>

      {/* Animación tipo “+1” */}
      <AnimatePresence>
        {cartChange !== null && (
          <motion.div
            key={`change-${cartChange}`}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="absolute text-xs font-bold text-brand-red pointer-events-none select-none"
          >
            +{cartChange}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // 🌈 Estilos
  const headerClasses =
    variant === "yellow"
      ? "bg-brand-yellow text-brand-black"
      : "bg-gradient-to-r from-brand-yellow to-brand-black text-brand-black";

  const baseLink =
    "relative z-0 cursor-pointer flex items-center gap-1 h-full px-3 py-2 rounded-md font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red " +
    "text-base md:text-[15px] lg:text-lg";

  const inactive =
    "text-brand-black hover:text-brand-red hover:bg-brand-red/10";

  const activePizza =
    "text-white " +
    'before:content-[""] before:absolute before:-z-10 ' +
    "before:inset-y-[-2px] before:inset-x-[-6px] " +
    "before:bg-brand-red before:shadow-sm " +
    'before:[clip-path:polygon(0%_50%,9%_0%,100%_50%,9%_100%)]';

  const mobileBase =
    "relative z-0 cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-base font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red";
  const mobileInactive =
    "text-brand-black hover:text-brand-red hover:bg-brand-red/10";
  const mobileActive =
    "text-white " +
    'before:content-[""] before:absolute before:-z-10 ' +
    "before:inset-y-[-2px] before:inset-x-[-6px] " +
    "before:bg-brand-red before:shadow-sm " +
    'before:[clip-path:polygon(0%_50%,9%_0%,100%_50%,9%_100%)]';

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
              <span className="text-brand-black">Rapida</span>
              <motion.div
                whileHover={{ scale: 1.3, rotate: 15 }}
                className="mx-0.5 flex items-center"
              >
                <Pizza
                  size={18}
                  className="text-brand-red drop-shadow"
                  aria-hidden
                />
              </motion.div>
              <span className="text-brand-red">Sabrosa</span>
            </motion.h1>
            <HeaderPizzaRight />
          </Link>

          {/* Nav Desktop */}
          <nav
            role="navigation"
            aria-label="Menú principal"
            className="hidden md:flex items-center h-full relative isolate overflow-y-hidden overflow-x-visible pl-2 md:pl-3"
          >
            {navLinks.map(({ title, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activePizza : inactive}`
                }
              >
                <Icon size={18} aria-hidden />
                <span>{title}</span>
              </NavLink>
            ))}

            {/* Botones visibles siempre */}
            <div className="flex items-center gap-2 ml-3">
              <CartButton />
              <DarkModeToggle />
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <CartButton />
            <DarkModeToggle />
            <button
              onClick={toggleMenu}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-md text-brand-black hover:text-brand-red transition-all 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="top-full left-0 w-full py-2 md:hidden bg-brand-yellow text-brand-black border-t border-brand-red/40 rounded-b-xl relative isolate overflow-hidden"
          >
            <div className="flex flex-col w-full px-4 space-y-1">
              {navLinks.map(({ title, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${mobileBase} ${isActive ? mobileActive : mobileInactive}`
                  }
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
