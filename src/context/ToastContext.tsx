// src/context/ToastContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./ThemeContext"; // 👈 detectamos modo oscuro dinámicamente

// =======================================
// 🔹 Tipos
// =======================================

export interface ToastOpts {
  id?: string;
  duration?: number; // ms
  position?: { x: number; y: number }; // posición opcional (para toasts locales)
}

export interface Toast {
  id: string;
  message: string;
  until: number;
  position?: { x: number; y: number };
}

export interface ToastContextType {
  showToast: (message: string, opts?: ToastOpts) => void;
}

// =======================================
// 🔹 Contexto
// =======================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("❌ useToast debe usarse dentro de un <ToastProvider>");
  return ctx;
};

// =======================================
// 🔹 Utilidad: crear raíz de portal
// =======================================

function ensurePortalRoot(id = "toast-root"): HTMLElement {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.setAttribute("id", id);
    document.body.appendChild(el);
  }
  return el;
}

// =======================================
// 🔹 Provider principal
// =======================================

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());
  const { isDarkMode } = useTheme();
  const root = ensurePortalRoot();

  // Mostrar toast
  const showToast = useCallback((message: string, opts?: ToastOpts) => {
    const id =
      opts?.id ??
      (crypto?.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`);
    const duration = Math.max(700, opts?.duration ?? 1200);
    const until = Date.now() + duration;

    const newToast: Toast = { id, message, until, position: opts?.position };
    setToasts((prev) => [...prev, newToast]);

    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, timer);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  // =======================================
  // 🔹 Render de los toasts
  // =======================================

  return (
    <ToastContext.Provider value={value}>
      {children}

      {createPortal(
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, -40, -60],
                scale: [0.7, 1.1, 1],
              }}
              exit={{ opacity: 0, y: -70, scale: 0.9 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`pointer-events-none fixed z-[9999] rounded-full px-2 py-[3px] text-[13px] font-bold shadow-md 
                ${
                  t.message.startsWith("+")
                    ? isDarkMode
                      ? "bg-brand-yellow text-brand-black"
                      : "bg-brand-red text-white"
                    : isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-900/90 text-white"
                } `}
              style={
                t.position
                  ? {
                      left: `${t.position.x}px`,
                      top: `${t.position.y}px`,
                      transform: "translate(-50%, -50%)",
                    }
                  : {
                      right: "max(env(safe-area-inset-right, 0px), 12px)",
                      top: "max(env(safe-area-inset-top, 0px), 12px)",
                    }
              }
              role="status"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>,
        root
      )}
    </ToastContext.Provider>
  );
};
