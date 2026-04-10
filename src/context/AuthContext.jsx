import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import keycloak from "../api/keycloak";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isRun = useRef(false);

  useEffect(() => {
    // Avoid double initialization in React 18 Strict Mode
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
        pkceMethod: "S256",
      })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) {
          // Extraer información del usuario y roles para compatibilidad con la app actual
          const tokenParsed = keycloak.tokenParsed;
          const roles = tokenParsed?.realm_access?.roles || [];
          
          // Mapeo selectivo de roles para la lógica de la app
          let appRol = "USER";
          if (roles.includes("ADMIN")) appRol = "ADMIN";
          else if (roles.includes("SELLER")) appRol = "SELLER";

          const userData = {
            id: tokenParsed?.sub,
            username: tokenParsed?.preferred_username,
            nombre: tokenParsed?.given_name || tokenParsed?.name || "",
            apellido: tokenParsed?.family_name || "",
            email: tokenParsed?.email,
            rol: appRol,
            roles: roles,
          };
          
          setUser(userData);

          // Configurar refresco automático del token
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).catch(() => {
              console.error("Error refreshing token");
              logout();
            });
          };
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Keycloak init error:", err);
        setLoading(false);
      });
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin + "/login" });
  };

  return (
    <AuthContext.Provider value={{ user, authenticated, login, logout, loading, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
