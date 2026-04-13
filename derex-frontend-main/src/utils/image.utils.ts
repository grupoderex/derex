import { BLOG_URL, S3_URL } from "../constants";

export function getResourceUrl<T extends string | undefined>(url: T): string | undefined {

  // Si la URL está vacía o es undefined, retornar undefined
  if (!url || typeof url !== "string" || url.trim() === "") {
    return undefined;
  }

  const trimmedUrl = url.trim();

  // Si ya es una URL completa (http/https), retornarla tal cual
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  const normalizedPath = trimmedUrl.startsWith("/")
    ? trimmedUrl
    : `/${trimmedUrl}`;

  // En local/dev, si no hay S3 usar backend público para resolver /uploads
  const publicBackendUrl = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL?.trim();
  const baseResourceUrl = S3_URL?.trim() || publicBackendUrl;

  // Si no hay base URL, devolver ruta relativa para que pueda resolver vía rewrites
  if (!baseResourceUrl) {
    return normalizedPath;
  }

  // Construir la URL completa con S3_URL o backend público
  if (baseResourceUrl.endsWith("/") && normalizedPath.startsWith("/")) {
    return `${baseResourceUrl.slice(0, -1)}${normalizedPath}`;
  } else if (!baseResourceUrl.endsWith("/") && !normalizedPath.startsWith("/")) {
    return `${baseResourceUrl}/${normalizedPath}`;
  }

  return `${baseResourceUrl}${normalizedPath}`;
}

export function getBlogResourceUrl<T extends string | undefined>(
  url: T
): string | undefined {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return undefined;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (BLOG_URL) {
    if (BLOG_URL.endsWith("/") && url.startsWith("/")) {
      return `${BLOG_URL.slice(0, -1)}${url}`;
    }
    if (!BLOG_URL.endsWith("/") && !url.startsWith("/")) {
      return `${BLOG_URL}/${url}`;
    }
    return `${BLOG_URL}${url}`;
  }

  return getResourceUrl(url);
}
