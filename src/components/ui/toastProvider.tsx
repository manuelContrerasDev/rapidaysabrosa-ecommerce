// src/components/ui/toasProvider.tsx
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

type ToastOpts = {
  id?: string;
  duration?: number; // ms
};
type Toast = { id: string; message: string; until: number };

interface ToastContextType {
  showToast: (message: string, opts?: ToastOpts) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
};

function ensurePortalRoot(id = "toast-root") {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.setAttribute("id", id);
    document.body.appendChild(el);
  }
  return el;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const showToast = useCallback((message: string, opts?: ToastOpts) => {
    const id = opts?.id ?? (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
    const duration = Math.max(1200, opts?.duration ?? 1600);
    const until = Date.now() + duration;

    setToasts((prev) => [...prev, { id, message, until }]);

    const t = window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, t);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const root = ensurePortalRoot();

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        // 👇 Siempre arriba-derecha (mobile y desktop). Con safe-area para notch.
        <div
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none fixed z-[9999] flex flex-col items-end gap-2 right-3 top-3 sm:right-4 sm:top-4 w-full sm:w-auto"
          style={{
            // Ajuste por notch / barras: usa el mayor entre 12px y env(safe-area).
            right: "max(env(safe-area-inset-right, 0px), 12px)",
            top: "max(env(safe-area-inset-top, 0px), 12px)",
          }}
        >
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-auto max-w-[92vw] sm:max-w-md rounded-md bg-gray-900/90 text-white shadow-lg backdrop-blur px-3 py-2 text-sm flex items-center gap-2"
                role="status"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] leading-none font-bold">
                  +1
                </span>
                <span className="truncate">{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        root
      )}
    </ToastContext.Provider>
  );
};
