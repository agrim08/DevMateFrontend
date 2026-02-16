const apiBase = import.meta.env.VITE_API_URL || (location.hostname === "localhost" ? "http://localhost:4000" : "");
export const BASE_URL = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;


