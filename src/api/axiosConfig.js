import axios from "axios";
import keycloak from "./keycloak";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  // Asegurarse de que el token esté actualizado antes de cada llamada
  if (keycloak.authenticated) {
    try {
      // Intenta refrescar si faltan menos de 30 segundos para expirar
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error("No se pudo refrescar el token de Keycloak", error);
      // Opcional: forzar login si el refresh falla catastróficamente
      // keycloak.login();
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend devuelve 401, el token probablemente expiró
    if (error.response && error.response.status === 401) {
      console.warn("Sesión expirada o no autorizada (401)");
    }
    return Promise.reject(error);
  }
);

export default api;
