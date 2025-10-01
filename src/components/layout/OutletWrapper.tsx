// src/components/layout/OutletWrapper.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const OutletWrapper: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <motion.main
      key={pathname}
      className="flex-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Outlet />
    </motion.main>
  );
};

export default OutletWrapper;
