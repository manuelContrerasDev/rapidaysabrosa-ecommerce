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
import { useTheme } from "./ThemeContext";

// =======================================
// 🔹 Tipos
// =======================================

export interface ToastOpts {
  id?: string;
  duration?: number; // ms
  position?: { x: number; y: number }; // 👈 posición opcional para burbujas locales
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
// 🔹 Crear raíz del portal
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
// 🔹 Provider principal (stack + burbuja local)
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
    const duration = Math.max(800, opts?.duration ?? 1800);
    const until = Date.now() + duration;

    const newToast: Toast = {
      id,
      message,
      until,
      position: opts?.position,
    };

    setToasts((prev) => [...prev, newToast]);

    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, timer);
  }, []);

  // Limpieza de timers
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  // =======================================
  // 🔹 Render visual
  // =======================================

  return (
    <ToastContext.Provider value={value}>
      {children}

      {createPortal(
        <>
          {/* 🔸 Toasts globales (arriba centrado) */}
          <div
            className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[9999] pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence initial={false}>
              {toasts
                .filter((t) => !t.position)
                .map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.9 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`rounded-full px-3 py-[6px] text-[13px] font-semibold shadow-md select-none
                      ${
                        t.message.startsWith("+")
                          ? isDarkMode
                            ? "bg-brand-yellow text-brand-black"
                            : "bg-brand-red text-white"
                          : isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-900/90 text-white"
                      }`}
                  >
                    {t.message}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* 🔸 Toasts locales (burbuja + rebote) */}
          <AnimatePresence>
            {toasts
              .filter((t) => !!t.position)
              .map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: -20, // 👆 pequeño salto hacia arriba
                    scale: [0.6, 1.1, 1],
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.7 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    left: t.position!.x,
                    top: t.position!.y,
                    transform: "translate(-50%, -100%)",
                    zIndex: 99999,
                    pointerEvents: "none",
                  }}
                  className={`rounded-full px-2 py-[4px] text-[12px] font-bold shadow-md select-none
                    ${
                      t.message.startsWith("+")
                        ? isDarkMode
                          ? "bg-brand-yellow text-brand-black"
                          : "bg-brand-red text-white"
                        : isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-900/90 text-white"
                    }`}
                >
                  {t.message}
                </motion.div>
              ))}
          </AnimatePresence>
        </>,
        root
      )}
    </ToastContext.Provider>
  );
};
