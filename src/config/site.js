// URL base del sitio (cPanel)
// Cambiar según el dominio real de la landing
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://waterwises.com';

/**
 * Convierte una ruta relativa a URL absoluta
 * @param {string} path - Ruta relativa (ej: /assets/imagen.jpg)
 * @returns {string} URL absoluta
 */
export function getAbsoluteUrl(path) {
  if (!path) return '';
  
  // Si ya es una URL absoluta, retornarla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si es una ruta relativa, convertirla a URL absoluta
  if (path.startsWith('/')) {
    return `${SITE_URL}${path}`;
  }
  
  // Si no empieza con /, agregarlo
  return `${SITE_URL}/${path}`;
}

