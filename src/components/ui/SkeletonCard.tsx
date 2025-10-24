import React from "react";
import { motion } from "framer-motion";

const SkeletonCard: React.FC = () => {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-card bg-gray-200 dark:bg-gray-800 animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen simulada */}
      <div className="h-48 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-[shimmer_1.5s_infinite]" />

      {/* Contenido */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-8 w-full bg-gradient-to-r from-brand-red to-brand-yellow opacity-60 rounded-lg" />
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
