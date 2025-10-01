// 🔹 Variants para framer-motion
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.3,
    },
  },
};

// 🔹 Extra (útil para menús y modales)
export const slideIn = (direction: "left" | "right" | "up" | "down") => {
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const offset = direction === "left" ? -50 : direction === "right" ? 50 : direction === "up" ? -50 : 50;

  return {
    hidden: { [axis]: offset, opacity: 0 },
    show: { [axis]: 0, opacity: 1, transition: { duration: 0.3 } },
  };
};
