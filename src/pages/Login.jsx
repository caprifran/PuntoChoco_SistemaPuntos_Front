import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login, loading, authenticated } = useAuth();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir a Keycloak
    if (!loading && !authenticated) {
      login();
    }
  }, [loading, authenticated, login]);

  // Si ya hay usuario autenticado, ir al inicio
  if (authenticated) return <Navigate to="/" replace />;

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background font-body">
      <div className="bg-surface-container-low rounded-xl shadow-[0_12px_40px_rgba(30,27,23,0.08)] p-8 md:p-12 max-w-sm w-full text-center mx-4">
        <div className="mb-10">
          <img 
            className="w-20 h-20 rounded-xl mx-auto mb-6 object-cover bg-primary-container p-2 shadow-sm" 
            src="/logo.jpg" 
            alt="Logo" 
          />
          <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight">Punto Chocolate</h2>
          <p className="mt-2 text-on-surface-variant font-medium">Redirigiendo a inicio de sesión...</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">
            Por favor, espera un momento.
          </p>
        </div>
      </div>
    </div>
  );
}
