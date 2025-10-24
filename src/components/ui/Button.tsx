import React, { useEffect, useState } from "react";
import { Link, LinkProps } from "react-router-dom";
import { motion, HTMLMotionProps } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "secondary" | "success";
  disabled?: boolean;
  className?: string;
  pulseOnActive?: boolean;
  isActive?: boolean;
}

type ButtonAsButton = BaseButtonProps &
  Omit<HTMLMotionProps<"button">, "ref"> & { to?: never };

type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, "children"> & { to: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

// 🎨 Paleta corporativa Rapida & Sabrosa: rojo-amarillo-negro
const variants = {
  primary:
    "bg-gradient-to-r from-brand-red to-brand-yellow hover:from-brand-red-dark hover:to-brand-yellow-dark text-white shadow-lg",
  accent:
    "bg-gradient-to-r from-brand-yellow to-brand-black hover:from-brand-yellow-dark hover:to-brand-black-soft text-gray-900 shadow-lg",
  secondary:
    "bg-gradient-to-r from-brand-black to-brand-red hover:from-brand-black-soft hover:to-brand-red-dark text-white shadow-lg",
  success:
    "bg-gradient-to-r from-brand-yellow via-brand-red to-brand-black hover:from-brand-yellow-dark hover:to-brand-red-dark text-white shadow-lg transition-all duration-300",
};

const baseClasses =
  "px-6 py-3 rounded-lg font-bold text-center transition-all duration-200 transform hover:scale-105";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  disabled,
  className = "",
  pulseOnActive = false,
  isActive = false,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [activeVariant, setActiveVariant] = useState(variant);

  useEffect(() => {
    if (isActive) {
      setActiveVariant("success");
      const timer = setTimeout(() => setActiveVariant(variant), 900);
      return () => clearTimeout(timer);
    }
  }, [isActive, variant]);

  const appliedClasses = `
    ${variants[activeVariant]}
    ${baseClasses}
    ${disabled ? "opacity-50 pointer-events-none" : ""}
    ${isDarkMode ? "dark:shadow-none" : ""}
    ${className}
  `;

  if ("to" in props) {
    const { to, onClick, ...rest } = props as ButtonAsLink;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <motion.div
        whileTap={pulseOnActive ? { scale: 0.97 } : {}}
        animate={isActive && pulseOnActive ? { y: [-2, 2, 0], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Link
          to={to}
          onClick={handleClick}
          className={appliedClasses}
          {...rest}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  const { onClick, type = "button", ...rest } = props as ButtonAsButton;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      animate={isActive ? { y: [-2, 2, 0], scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={appliedClasses}
      disabled={disabled}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default React.memo(Button);
