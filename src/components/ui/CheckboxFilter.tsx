import React from "react";

/**
 * Props para checkbox de filtro
 */
interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

/**
 * Componente CheckboxFilter
 * Checkbox simple para filtros de productos
 */
const CheckboxFilter: React.FC<Props> = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={id} className="text-gray-900 dark:text-white">
        {label}
      </label>
    </div>
  );
};

export default React.memo(CheckboxFilter);
