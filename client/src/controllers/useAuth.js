// ── AfroDigital UPB — Hook useAuth ──────────────────────────────
// Controlador de autenticación para React
// Maneja: sesión, registro, login, logout, perfil, avatar
//
// Uso básico:
//   const { user, profile, login, logout, isAuthenticated } = useAuth()
//
// En App.jsx agrega <AuthProvider> y consume con useAuth() en cualquier
// componente hijo. O importa el hook directamente si usas Zustand/Context.

import { useState, useEffect, useCallback } from 'react';
import supabase from '../services/supabaseClient';

export function useAuth() {
  const [user,    setUser]    = useState(null);   // datos de auth.users (email, id, etc.)
  const [profile, setProfile] = useState(null);   // datos de public.users (nombre, rol, etc.)
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Cargar perfil público desde public.users ─────────────────
  const loadProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) setProfile(data);
  }, []);

  // ── Inicializar sesión al montar el componente ───────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
      setLoading(false);
    };

    init();

    // Escuchar cambios: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

  // ── Registro con email y contraseña ─────────────────────────
  // Supabase enviará un email de confirmación automáticamente
  // El trigger handle_new_user() creará la fila en public.users
  const register = async ({ email, password, fullName }) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }   // → raw_user_meta_data → trigger
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Login con email y contraseña ─────────────────────────────
  const login = async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Login con Google (OAuth) ─────────────────────────────────
  // Habilita Google Auth en: Supabase → Authentication → Providers
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider:  'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      setError(error.message);
      throw error;
    }
  };

  // ── Cerrar sesión ────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ── Actualizar perfil público (public.users) ─────────────────
  // updates: { full_name, university, origin_municipality, bio, is_private }
  const updateProfile = async (updates) => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ── Subir foto de perfil a Supabase Storage ──────────────────
  // Bucket: "avatars" (crearlo en Supabase → Storage → New bucket)
  const uploadAvatar = async (file) => {
    const ext  = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  };

  // ── Resetear contraseña por email ────────────────────────────
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  };

  // ── Obtener token JWT actual (para enviarlo al backend) ──────
  // Útil cuando llamas a tu Express API directamente sin apiClient.js
  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  // ── Valores derivados ────────────────────────────────────────
  return {
    // Estado
    user,
    profile,
    loading,
    error,

    // Flags útiles en componentes
    isAuthenticated: !!user,
    isModerator:     ['moderator', 'admin'].includes(profile?.role),
    isAdmin:         profile?.role === 'admin',

    // Acciones
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    uploadAvatar,
    resetPassword,
    getToken
  };
}