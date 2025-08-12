const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path, options = {}) {
  const url =
    BASE_URL.endsWith("/") && path.startsWith("/")
      ? BASE_URL + path.slice(1)
      : BASE_URL + path;

  const res = await fetch(url, options);

  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json(); // Intenta leer JSON
    } catch {
      // Si no tiene JSON no hace nada, queda vacío
    }
    throw new Error(errorData.error || "Error en la petición");
  }

  // También maneja caso cuando no hay contenido JSON
  try {
    return await res.json();
  } catch {
    return null; // o return {} si prefieres un objeto vacío
  }
}
