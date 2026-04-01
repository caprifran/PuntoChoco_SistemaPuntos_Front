import axios from "axios";

const hostname = window.location.hostname;

let baseURL;

if (hostname === "localhost") {
    baseURL = "http://localhost:4000/api/";
}
// si es una IP local del estilo 192.168.x.x
else if (/^192\.168\./.test(hostname) || /^10\./.test(hostname)) {
    baseURL = `http://${hostname}:4000/api/`;
}
// fallback cuando va por nginx en prod
else {
    baseURL = "/api/";
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

