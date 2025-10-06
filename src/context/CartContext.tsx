// ...imports
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { CartItem } from "../types";

interface AddResult {
  lineQuantity: number;    // cantidad de esa línea tras el agregado (x2, x3...)
  totalItems: number;      // total de ítems en el carrito
  totalAmount: number;     // total CLP
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  /** Igual que addToCart pero devolviendo el estado resultante para sincronizar UI (toasts, etc). */
  addToCartSync: (item: CartItem) => AddResult;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("❌ useCart debe usarse dentro de un CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalItems = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        try {
          setItems(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const computeNext = useCallback((prev: CartItem[], newItem: CartItem) => {
    const uniqueId = `${newItem.productId}-${newItem.size || "default"}`;
    const idx = prev.findIndex((it) => it.id === uniqueId);

    if (idx >= 0) {
      const updated = [...prev];
      const nextLineQty = updated[idx].quantity + newItem.quantity;
      updated[idx] = { ...updated[idx], quantity: nextLineQty };
      const nextTotalItems = updated.reduce((a, it) => a + it.quantity, 0);
      const nextTotalAmount = updated.reduce((a, it) => a + it.price * it.quantity, 0);
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
    const nextTotalAmount = nextItems.reduce((a, it) => a + it.price * it.quantity, 0);
    return { nextItems, lineQuantity, totalItems: nextTotalItems, totalAmount: nextTotalAmount };
  }, []);

  // Mantén tu addToCart original
  const addToCart = useCallback((newItem: CartItem) => {
    setItems((prev) => computeNext(prev, newItem).nextItems);
  }, [computeNext]);

  // Nuevo: devuelve el estado resultante para sincronizar el toast/badge
  const addToCartSync = useCallback((newItem: CartItem): AddResult => {
    const { nextItems, lineQuantity, totalItems, totalAmount } = computeNext(items, newItem);
    setItems(nextItems);
    return { lineQuantity, totalItems, totalAmount };
  }, [computeNext, items]);

  const removeFromCart = useCallback(
    (id: string) => setItems((prev) => prev.filter((it) => it.id !== id)),
    []
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(id);
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addToCartSync,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
