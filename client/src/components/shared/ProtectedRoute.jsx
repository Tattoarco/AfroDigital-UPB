// ── AfroDigital UPB — Ruta protegida ─────────────────────────────
// Uso:
//   <ProtectedRoute>                        → solo requiere sesión
//   <ProtectedRoute role="moderator">       → requiere rol específico
//
// Flujo:
//   Cargando sesión → <Spinner>
//   Sin sesión      → redirige a /login
//   Sin rol         → redirige a /feed
//   Ok              → renderiza los hijos

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  // Mientras Supabase verifica la sesión inicial
  if (loading) return <Spinner />;

  // Sin sesión → al login, guardando la ruta original para volver después
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico (moderador o admin)
  if (role && profile?.role !== role && profile?.role !== 'admin') {
    return <Navigate to="/feed" replace />;
  }

  return children;
}
