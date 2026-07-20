// ── AfroDigital UPB — Contexto de autenticación ─────────────────
// Centraliza el estado de sesión para que cualquier componente
// pueda leerlo sin hacer múltiples llamadas a Supabase.
//
// Uso:
//   1. Envuelve <App> con <AuthProvider> en main.jsx
//   2. En cualquier componente: const { user, profile, login } = useAuth()

import { useState, useEffect, useCallback } from 'react';
import supabase from '../services/supabaseClient';
import AuthContext from './authContext';

// ── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    // Sesión inicial al montar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escuchar login, logout y refresh de token
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // ── Registro ────────────────────────────────────────────────────
  const register = async ({ email, password, fullName }) => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) { setError(error.message); throw error; }
    return data;
  };

  // ── Login ───────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); throw error; }
    return data;
  };

  // ── Logout ──────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ── Actualizar perfil ───────────────────────────────────────────
  const updateProfile = async (updates) => {
    setError(null);
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) { setError(error.message); throw error; }
    setProfile(data);
    return data;
  };

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated:  !!user,
    isModerator:      ['moderator', 'admin'].includes(profile?.role),
    isAdmin:          profile?.role === 'admin',
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
