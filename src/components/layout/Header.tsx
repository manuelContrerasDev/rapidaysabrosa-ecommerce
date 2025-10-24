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
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import HeaderPizzaLeft from "../ui/HeaderPizzaLeft";
import HeaderPizzaRight from "../ui/HeaderPizzaRight";

const navLinks = [
  { title: "INICIO", path: "/home", icon: Home },
  { title: "MENÚ", path: "/catalog", icon: List },
  { title: "CARRITO", path: "/order", icon: ShoppingCart },
] as const;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartChange, setCartChange] = useState<number | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  // 🧭 Detectar scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  // 🔄 Animación al actualizar carrito
  useEffect(() => {
    if (totalItems > 0) {
      setCartChange(totalItems);
      const timer = setTimeout(() => setCartChange(null), 600);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useEffect(() => closeMenu(), [pathname, closeMenu]);

  // 🌙 Toggle DarkMode
  const DarkModeToggle = useCallback(
    () => (
      <motion.button
        onClick={toggleDarkMode}
        aria-label="Cambiar tema"
        className={`flex items-center justify-center w-[clamp(30px,3vw,38px)] h-[clamp(30px,3vw,38px)] rounded-full transition-colors duration-300 ${
          isDarkMode
            ? "bg-white text-gray-900 hover:bg-yellow-200"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.25 }}
            >
              <Sun size={18} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.25 }}
            >
              <Moon size={18} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    ),
    [isDarkMode, toggleDarkMode]
  );

  const hoverVariants = useMemo(
    () => ({
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.07, y: -2, transition: { duration: 0.2 } },
    }),
    []
  );

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 w-full backdrop-blur-md border-b border-opacity-60 shadow-[0_1px_4px_rgba(0,0,0,0.25)] 
        ${
          isDarkMode
            ? "bg-gradient-to-r from-[#0f0f0f] via-[#1c1c1c] to-[#0f0f0f] border-[#FFB703]/80 text-white"
            : "bg-gradient-to-r from-[#FFD54F] via-[#FFE082] to-[#FFD54F] border-[#E63946]/70 text-black"
        }`}
    >
      <div className="container-main">
        <div
          className={`flex items-center transition-all duration-300 ${
            isScrolled
              ? "h-[clamp(44px,6vh,60px)]"
              : "h-[clamp(52px,7vh,70px)]"
          }`}
        >
          {/* 🧩 Logo principal */}
          <Link to="/home" className="flex items-center gap-2 select-none" aria-label="Volver al inicio">
            <HeaderPizzaLeft />
            <motion.h1
              className="flex items-center text-[clamp(1.2rem,2.4vw,1.8rem)] font-anton tracking-wide"
              whileHover={{ scale: 1.05 }}
            >
              <span className={isDarkMode ? "text-white" : "text-[#1c1c1c]"}>
                Rápida
              </span>
              <Pizza
                size={22}
                className={`mx-1 ${
                  isDarkMode
                    ? "text-[#FFB703] drop-shadow-[0_0_6px_rgba(255,183,3,0.7)]"
                    : "text-[#E63946] drop-shadow-[0_0_5px_rgba(230,57,70,0.5)]"
                }`}
              />
              <span className={isDarkMode ? "text-[#FFB703]" : "text-[#E63946]"}>
                Sabrosa
              </span>
            </motion.h1>
            <HeaderPizzaRight />
          </Link>

          {/* ⚙️ Navegación */}
          <nav
            className={`hidden md:flex items-center justify-end ml-auto gap-3 px-2 transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            role="navigation"
            aria-label="Menú principal"
          >
            {navLinks.map(({ title, path, icon: Icon }, index) => (
              <React.Fragment key={path}>
                <motion.div
                  variants={hoverVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="flex items-center relative"
                >
                  <NavLink
                    to={path}
                    onClick={() => {
                      closeMenu();
                      navigate(path);
                    }}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2 px-2 py-1 font-fredoka font-semibold uppercase transition-colors duration-300 text-[clamp(0.9rem,1vw,1.05rem)]
                      ${
                        isActive
                          ? isDarkMode
                            ? "text-[#FFB703]"
                            : "text-[#E63946]"
                          : isDarkMode
                          ? "text-white hover:text-[#FFB703]"
                          : "text-black hover:text-[#E63946]"
                      }`
                    }
                  >
                    <div className="relative flex items-center">
                      <Icon size={18} />
                      {path === "/order" && totalItems > 0 && (
                        <motion.span
                          key={totalItems}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shadow ${
                            isDarkMode
                              ? "bg-[#FFB703] text-black"
                              : "bg-[#E63946] text-white"
                          }`}
                        >
                          {totalItems}
                        </motion.span>
                      )}
                    </div>
                    <span>{title}</span>
                  </NavLink>
                </motion.div>
                {index < navLinks.length - 1 && (
                  <span
                    className={`mx-1 text-base font-bold opacity-70 select-none ${
                      isDarkMode
                        ? "text-[#FFB703]/70"
                        : "text-[#E63946]/70"
                    }`}
                  >
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
            <DarkModeToggle />
          </nav>

          {/* 📱 Mobile Actions */}
          <div className="flex items-center md:hidden gap-3 ml-auto">
            {/* Menú + Carrito + DarkMode */}
            <button
              onClick={toggleMenu}
              aria-label="Abrir menú móvil"
              aria-expanded={isMenuOpen}
              className={`p-[6px] rounded-full ${
                isDarkMode
                  ? "text-white hover:bg-[#FFB703]/20"
                  : "text-black hover:bg-[#E63946]/10"
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={() => navigate("/order")}
              aria-label="Ver carrito"
              className="relative flex items-center font-fredoka font-semibold"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-[#E63946] dark:bg-[#FFB703] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      {/* 📱 Drawer lateral */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
            />
            <motion.aside
              initial={{ x: "100%", opacity: 0.3 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              role="complementary"
              className={`fixed top-0 right-0 z-40 h-screen w-[65vw] sm:w-[60vw] md:w-[50vw] lg:w-[420px]
                max-w-[480px] flex flex-col justify-center border-l shadow-[-4px_0_14px_rgba(0,0,0,0.45)]
                backdrop-blur-xl bg-opacity-90 overflow-y-auto
                ${
                  isDarkMode
                    ? "bg-gradient-to-b from-[#121212]/95 via-[#1a1a1a]/90 to-[#0e0e0e]/85 border-[#FFB703]"
                    : "bg-gradient-to-b from-[#FFD54F]/95 via-[#FFE082]/90 to-[#FFD54F]/85 border-[#E63946]"
                }`}
            >
              <motion.header
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative pb- mb-6 border-b border-x-primary-400/20 w-full flex items-center justify-center px-5 gap-2 py-2"
              >
                <Link to="/home" onClick={closeMenu} className="flex items-center gap-2">
                  <HeaderPizzaLeft />
                  <motion.h1
                    className="flex items-center font-anton text-[1.5rem]"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={isDarkMode ? " text-white" : "text-[#1c1c1c]"}>
                      Rápida
                    </span>
                    <Pizza size={22} className="mx-1" />
                    <span className={isDarkMode ? "text-[#FFB703]" : "text-[#E63946]"}>
                      Sabrosa
                    </span>
                  </motion.h1>
                </Link>
                <DarkModeToggle />
              </motion.header>

              <motion.nav
                aria-label="Menú móvil"
                className="flex flex-col items-center gap-2 px-5"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
              >
                {navLinks.map(({ title, path, icon: Icon }) => (
                  <motion.div
                    key={path}
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <NavLink
                      to={path}
                      onClick={() => {
                        navigate(path);
                        closeMenu();
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md font-fredoka uppercase tracking-wide transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#FFB703] to-[#FF9800] text-white dark:text-primary-600"
                            : isDarkMode
                            ? "hover:text-[#FFB703] hover:bg-white/20"
                            : "hover:text-white hover:bg-black/50"
                        }`
                      }
                    >
                      <Icon size={22} />
                      <span>{title}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default React.memo(Header);
