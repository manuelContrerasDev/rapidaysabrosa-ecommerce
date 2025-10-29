export function getImageUrl(raw?: string): string {
  const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE || "";
  if (!raw) return "/assets/img/placeholder.png";

  const clean = String(raw).trim();

  // Si ya es una URL completa, la devolvemos tal cual
  if (/^https?:\/\//i.test(clean)) return clean;

  // Si es relativa, la unimos con IMAGE_BASE
  const base = IMAGE_BASE.replace(/\/+$/, "");
  const path = clean.replace(/^\/+/, "");
  return `${base}/${path}`;
}
