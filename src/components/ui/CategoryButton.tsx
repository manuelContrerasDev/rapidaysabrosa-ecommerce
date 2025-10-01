import React from "react";

/**
 * Props para el botón de categoría
 */
interface Props {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Componente CategoryButton
 * Botón redondeado que indica si está seleccionado
 */
const CategoryButton: React.FC<Props> = ({ label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium transition-colors border ${
        isSelected
          ? "bg-primary-600 text-white border-primary-600"
          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );
};

export default React.memo(CategoryButton);
