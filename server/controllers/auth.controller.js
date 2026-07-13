// ── AfroDigital UPB — Controlador de autenticación ──────────────

import supabaseAdmin from '../services/supabaseClient.js';

// ────────────────────────────────────────────────────────────────
// GET /api/auth/profile
// Devuelve el perfil público del usuario autenticado
// ────────────────────────────────────────────────────────────────
export const getProfile = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        full_name,
        university,
        origin_municipality,
        bio,
        role,
        avatar_url,
        is_private,
        created_at
      `)
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// PUT /api/auth/profile
// Actualiza los datos del perfil del usuario autenticado
// Body: { full_name, university, origin_municipality, bio, is_private }
// ────────────────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  const { full_name, university, origin_municipality, bio, is_private } = req.body;

  // Validación básica
  if (full_name !== undefined && full_name.trim().length < 2) {
    return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ full_name, university, origin_municipality, bio, is_private })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};
