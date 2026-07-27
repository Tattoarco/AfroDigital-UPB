import { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export const AuthContext = createContext(null);
const configError = "Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async (userId) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
    if (!error && data) setProfile(data);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        await loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const user = session?.user ?? null;

  const register = async ({ email, password, fullName }) => {
    setError(null);
    setLoading(true);
    try {
      if (!supabase) throw new Error(configError);
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      if (!supabase) throw new Error(configError);
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

  const loginWithGoogle = async () => {
    if (!supabase) throw new Error(configError);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!supabase || !user) throw new Error(configError);
      const { data, error } = await supabase.from("users").update(updates).eq("id", user.id).select().single();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const uploadAvatar = async (file) => {
    if (!supabase || !user) throw new Error(configError);
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  };

  const resetPassword = async (email) => {
    if (!supabase) throw new Error(configError);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) throw error;
  };

  const getToken = async () => session?.access_token ?? null;

  const value = {
    session,
    user,
    profile,
    loading,
    error,
    isAuthenticated: Boolean(session),
    isModerator: ["moderator", "admin"].includes(profile?.role),
    isAdmin: profile?.role === "admin",
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    uploadAvatar,
    resetPassword,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}