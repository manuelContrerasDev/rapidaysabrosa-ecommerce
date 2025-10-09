import { AnimatePresence, motion } from "framer-motion";
import { Home, List, Menu, Moon, Pizza, ShoppingCart, Sun, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import HeaderPizzaLeft from "../ui/HeaderPizzaLeft";
import HeaderPizzaRight from "../ui/HeaderPizzaRight";

const navLinks = [
  { title: "INICIO", path: "/home", icon: Home },
  { title: "CATÁLOGO", path: "/catalog", icon: List },
  { title: "CARRITO", path: "/order", icon: ShoppingCart },
] as const;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartChange, setCartChange] = useState<number | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (totalItems > 0) {
      setCartChange(totalItems);
      const timer = setTimeout(() => setCartChange(null), 700);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useEffect(() => closeMenu(), [pathname, closeMenu]);

  const DarkModeToggle = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label="Cambiar tema"
      className={`flex items-center justify-center w-[clamp(32px,3vw,38px)] h-[clamp(32px,3vw,38px)] rounded-full transition-colors duration-300 ${
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
          >
            <Sun size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
          >
            <Moon size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  const hoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.07, y: -2, transition: { duration: 0.2 } },
  };

  return (
    <header
  className={`sticky top-0 z-50 w-full backdrop-blur-md border-b border-opacity-60 shadow-[0_1px_4px_rgba(0,0,0,0.25)] 
    ${isDarkMode
      ? "bg-gradient-to-r from-[#0f0f0f] via-[#1c1c1c] to-[#0f0f0f] border-[#FFB703]/80 text-white"
      : "bg-gradient-to-r from-[#FFD54F] via-[#FFE082] to-[#FFD54F] border-[#E63946]/70 text-black"
    }`}
>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-[clamp(52px,7vh,70px)]">
          {/* 🔥 Logo */}
          <Link to="/home" className="flex items-center gap-2 select-none">
            <HeaderPizzaLeft />
            <motion.h1
              className="flex items-center text-[clamp(1.3rem,2.4vw,2rem)] font-anton tracking-wider"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`${isDarkMode ? "text-white" : "text-[#1c1c1c]"}`}>Rápida</span>
              <Pizza
                size={22}
                className={`mx-1 ${
                  isDarkMode
                    ? "text-[#FFB703] drop-shadow-[0_0_6px_rgba(255,183,3,0.7)]"
                    : "text-[#E63946] drop-shadow-[0_0_5px_rgba(230,57,70,0.5)]"
                }`}
              />
              <span className={`${isDarkMode ? "text-[#FFB703]" : "text-[#E63946]"}`}>Sabrosa</span>
            </motion.h1>
            <HeaderPizzaRight />
          </Link>

          {/* 🧭 Nav Desktop */}
          <nav
            className={`hidden md:flex items-center justify-center gap-1 px-2 py-1 rounded-full border shadow-[0_3px_8px_rgba(0,0,0,0.25)] 
              ${isDarkMode ? "bg-[#1c1c1c]/80 border-[#FFB703]" : "bg-[#FFF8E1]/80 border-[#E63946]"}`
            }
          >
            {navLinks.map(({ title, path, icon: Icon }, index) => (
              <React.Fragment key={path}>
                <motion.div
                  variants={hoverVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="flex items-center"
                >
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2 px-2 py-1 font-fredoka font-semibold uppercase tracking-wide transition-all duration-300 text-[clamp(0.9rem,1vw,1.15rem)] ${
                        isActive
                          ? isDarkMode
                            ? "text-[#FFB703]"
                            : "text-[#E63946]"
                          : isDarkMode
                          ? "hover:text-[#FFB703]"
                          : "hover:text-[#E63946]"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{title}</span>
                  </NavLink>
                </motion.div>

                {/* | Separador visual entre los links */}
                {index < navLinks.length - 1 && (
                  <span
                    className={`mx-1 text-lg font-bold opacity-70 select-none ${
                      isDarkMode ? "text-[#FFB703]/70" : "text-[#E63946]/70"
                    }`}
                  >
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
            
            {/* 🌙 Toggle DarkMode */}
            <DarkModeToggle />
          </nav>


          {/* 📱 Mobile Actions */}
          <div
            className={`flex items-center gap-3 md:hidden px-[clamp(6px,2vw,10px)] py-[clamp(4px,1vw,6px)] rounded-full border shadow-[0_3px_8px_rgba(0,0,0,0.25)] ${
              isDarkMode ? "bg-[#1c1c1c]/80 border-[#FFB703]" : "bg-[#FFF8E1]/80 border-[#E63946]"
            }`}
          >
            <button
              onClick={toggleMenu}
              aria-label="Abrir menú"
              className={`p-[clamp(4px,1vw,6px)] rounded-full ${
                isDarkMode ? "text-white hover:bg-[#FFB703]/20" : "text-black hover:bg-[#E63946]/10"
              }`}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <button
              onClick={() => {
                navigate("/order");
                closeMenu();
              }}
              aria-label="Ver carrito"
              className="relative flex items-center"
            >
              <ShoppingCart size={22} className={isDarkMode ? "text-white" : "text-black"} />
              CARRITO
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow"
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
          {/* Fondo con blur y fade */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
          />

          {/* Drawer lateral con efecto spring */}
          <motion.aside
            initial={{ x: "100%", opacity: 0.3 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className={`fixed top-0 right-0 z-40 h-screen 
              w-[65vw] sm:w-[60vw] md:w-[50vw] lg:w-[420px] xl:w-[480px]
              max-w-[480px] flex flex-col justify-center 
              border-l shadow-[-4px_0_14px_rgba(0,0,0,0.45)] 
              backdrop-blur-xl bg-opacity-90 overflow-y-auto
              ${
                isDarkMode
                  ? "bg-gradient-to-b from-[#121212]/95 via-[#1a1a1a]/90 to-[#0e0e0e]/85 border-[#FFB703]"
                  : "bg-gradient-to-b from-[#FFD54F]/95 via-[#FFE082]/90 to-[#FFD54F]/85 border-[#E63946]"
              }`}
          >
            {/* Contenido con entrada suave */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 110, damping: 16 }}
              className={`flex flex-col flex-1 px-5 py-6 items-center text-center ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {/* 🏷️ Header con DarkModeToggle */}
              <motion.header
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                className="relative pb-5 mb-5 border-b border-black/20 w-full flex justify-center items-center gap-2 flex-wrap"
              >
                <Link
                  to="/home"
                  className="flex items-center gap-2 select-none hover:opacity-90 transition-opacity"
                  onClick={closeMenu}
                >
                  <HeaderPizzaLeft />
                  <motion.h1
                    className="flex items-center text-[clamp(1.3rem,2.4vw,2rem)] font-anton tracking-wider"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={`${isDarkMode ? "text-white" : "text-[#1c1c1c]"}`}>Rápida</span>
                    <Pizza
                      size={22}
                      className={`mx-1 ${
                        isDarkMode
                          ? "text-white drop-shadow-[0_0_6px_rgba(255,183,3,0.7)]"
                          : "text-[#E63946] drop-shadow-[0_0_5px_rgba(230,57,70,0.5)]"
                      }`}
                    />
                    <span className={`${isDarkMode ? "text-[#FFB703]" : "text-[#E63946]"}`}>
                      Sabrosa
                    </span>
                  </motion.h1>
                </Link>

                {/* 🌓 Botón DarkMode */}
                <DarkModeToggle />

                {/* Separador dorado */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[3px] bg-primary-900 dark:bg-primary-50 rounded-full opacity-90" />
              </motion.header>

              {/* 📜 Navegación con animación escalonada */}
              <motion.nav
                className="flex flex-col space-y-2 w-full items-center"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                  },
                }}
              >
                {navLinks.map(({ title, path, icon: Icon }) => (
                  <motion.div
                    key={path}
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
                    }}
                    className="w-full"
                  >
                    <NavLink
                      to={path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex justify-center items-center gap-3 w-full py-2 px-3 rounded-md font-fredoka uppercase tracking-wide transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#FFB703] to-[#FF9800] text-white dark:text-primary-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]"
                            : isDarkMode
                            ? "hover:text-[#FFB703] hover:bg-white/20"
                            : "hover:text-white hover:bg-black/50"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span className="text-[clamp(1rem,4vw,1.1rem)] font-semibold">{title}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>


              {/* ⚖️ Footer */}
              <motion.footer
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.5 }}
                className="mt-auto pt-4 text-xs opacity-70 border-t border-black/20 dark:border-white/20 w-full text-center"
              >
                © {new Date().getFullYear()} Rápida&Sabrosa
              </motion.footer>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>


    </header>
  );
};

export default Header;
