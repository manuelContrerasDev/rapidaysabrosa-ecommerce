import React from 'react';
import { motion } from "framer-motion";
import { Pizza } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Componente HeaderPizzaRight
 * Icono de pizza giratorio con bounce para la derecha
 */
const HeaderPizzaRight: React.FC = () => {
  const [iconSize, setIconSize] = useState(28);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) setIconSize(20);
      else if (width < 1024) setIconSize(28);
      else setIconSize(36);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <motion.div
      animate={{ rotate: -360, y: [0, -4, 0] }} // giro antihorario + micro bounce
      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      className="flex items-center justify-center"
    >
      <Pizza size={iconSize} className="text-white dark:text-primary-900 drop-shadow-md" />
    </motion.div>
  );
};

export default React.memo(HeaderPizzaRight);
