// src/utils/images.ts
/**
 * Devuelve candidatos AVIF/WEBP solo si la ruta es local y con extensión .jpg/.jpeg/.png
 * Mantiene fallback al original.
 */
export const imageCandidates = (url: string) => {
  const isLocal = url.startsWith("/") || url.startsWith("./") || url.startsWith("../");
  const m = url.match(/\.(png|jpe?g)$/i);

  if (!isLocal || !m) {
    return { fallback: url } as const;
  }

  const base = url.slice(0, -m[0].length);
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    fallback: url,
  } as const;
};
