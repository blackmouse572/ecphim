/**
 * Resolve a movie image to a usable URL.
 * VSMov returns absolute URLs; a bare relative path (old ophim style) is
 * joined to the CDN base. Safe to import from client components.
 */
export function resolveImageUrl(
  path: string | undefined,
  cdnUrl?: string,
  fallback = "/images/placeholder-poster.webp",
): string {
  if (!path) return fallback;
  if (/^https?:\/\//.test(path)) return path;
  return `${cdnUrl || ""}/uploads/movies/${path}`;
}
