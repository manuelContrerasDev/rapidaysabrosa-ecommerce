import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { CartItem } from "../types";

// ===========================
// 🔹 Tipos auxiliares
// ===========================

interface AddResult {
  lineQuantity: number; // cantidad total de esa línea (x2, x3…)
  totalItems: number; // total de ítems en el carrito
  totalAmount: number; // total CLP
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  addToCartSync: (item: CartItem) => AddResult; // versión con retorno para UI/toast
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

// ===========================
// 🔹 Creación de contexto
// ===========================

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("❌ useCart debe usarse dentro de un CartProvider");
  return context;
};

// ===========================
// 🔹 Provider principal
// ===========================

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Estado inicial persistido
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  // Totales derivados (memoizados)
  const totalItems = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );

  // 🔸 Persistencia automática
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (err) {
      console.warn("Error al guardar carrito:", err);
    }
  }, [items]);

  // 🔸 Sincronización entre pestañas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart" && e.newValue && e.storageArea === localStorage) {
        try {
          setItems(JSON.parse(e.newValue));
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 🔸 Cálculo centralizado del siguiente estado
  const computeNext = useCallback((prev: CartItem[], newItem: CartItem) => {
    const uniqueId = `${newItem.productId}-${newItem.size || "default"}`;
    const idx = prev.findIndex((it) => it.id === uniqueId);

    if (idx >= 0) {
      const updated = [...prev];
      const nextLineQty = updated[idx].quantity + newItem.quantity;
      updated[idx] = { ...updated[idx], quantity: nextLineQty };

      const nextTotalItems = updated.reduce((a, it) => a + it.quantity, 0);
      const nextTotalAmount = updated.reduce(
        (a, it) => a + it.price * it.quantity,
        0
      );

      return {
        nextItems: updated,
        lineQuantity: nextLineQty,
        totalItems: nextTotalItems,
        totalAmount: nextTotalAmount,
      };
    }

    const nextItems = [...prev, { ...newItem, id: uniqueId }];
    const lineQuantity = newItem.quantity;
    const nextTotalItems = nextItems.reduce((a, it) => a + it.quantity, 0);
    const nextTotalAmount = nextItems.reduce(
      (a, it) => a + it.price * it.quantity,
      0
    );

    return { nextItems, lineQuantity, totalItems: nextTotalItems, totalAmount: nextTotalAmount };
  }, []);

  // ===========================
  // 🔹 Funciones del carrito
  // ===========================

  const addToCart = useCallback(
    (newItem: CartItem) => setItems((prev) => computeNext(prev, newItem).nextItems),
    [computeNext]
  );

  const addToCartSync = useCallback(
    (newItem: CartItem): AddResult => {
      const { nextItems, lineQuantity, totalItems, totalAmount } = computeNext(items, newItem);
      setItems(nextItems);
      return { lineQuantity, totalItems, totalAmount };
    },
    [computeNext, items]
  );

  const removeFromCart = useCallback(
    (id: string) => setItems((prev) => prev.filter((it) => it.id !== id)),
    []
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(id);
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, quantity } : it))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  // ===========================
  // 🔹 Renderizado del Provider
  // ===========================

  const value = useMemo(
    () => ({
      items,
      addToCart,
      addToCartSync,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    }),
    [
      items,
      addToCart,
      addToCartSync,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
