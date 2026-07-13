// ── AfroDigital UPB — Controlador de posts ──────────────────────

import supabaseAdmin from '../services/supabaseClient.js';

const VALID_REACTIONS = ['apoyo', 'me_representa', 'fuego'];

// ────────────────────────────────────────────────────────────────
// GET /api/posts
// Feed general paginado, con join a autor, comunidad, media y reacciones
// Query params: ?page=1&limit=20&community_id=uuid&category=history
// ────────────────────────────────────────────────────────────────
export const getFeed = async (req, res, next) => {
  const page         = parseInt(req.query.page  ?? 1);
  const limit        = parseInt(req.query.limit ?? 20);
  const community_id = req.query.community_id;
  const category     = req.query.category;
  const offset       = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('posts')
      .select(`
        id,
        content_type,
        content,
        category,
        created_at,
        author:users   ( id, full_name, avatar_url, university ),
        community:communities ( id, name ),
        media:post_media ( media_url, media_type ),
        reactions      ( type )
      `)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (community_id) query = query.eq('community_id', community_id);
    if (category)     query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// POST /api/posts
// Crear un nuevo post
// Body: { content_type, content, category?, community_id? }
// ────────────────────────────────────────────────────────────────
export const createPost = async (req, res, next) => {
  const { content_type, content, category, community_id } = req.body;

  if (!content_type || !content?.trim()) {
    return res.status(400).json({ error: 'content_type y content son obligatorios' });
  }

  const validTypes = ['text', 'image', 'video', 'audio'];
  if (!validTypes.includes(content_type)) {
    return res.status(400).json({ error: `content_type debe ser: ${validTypes.join(', ')}` });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        author_id:    req.user.id,
        content_type,
        content:      content.trim(),
        category:     category    ?? null,
        community_id: community_id ?? null
      })
      .select()
      .single();

    if (error) throw error;

    // Evaluar insignias en segundo plano (no bloquear la respuesta)
    awardBadgesAsync(req.user.id, 'first_post').catch(console.error);

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// DELETE /api/posts/:id
// El autor puede borrar su post; moderadores y admins también
// ────────────────────────────────────────────────────────────────
export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const isOwner     = post.author_id === req.user.id;
    const isModerator = ['moderator', 'admin'].includes(req.user.role);

    if (!isOwner && !isModerator) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
    }

    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);
    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// POST /api/posts/:id/reactions
// Reaccionar a un post (upsert: reemplaza si ya existía)
// Body: { type: 'apoyo' | 'me_representa' | 'fuego' }
// ────────────────────────────────────────────────────────────────
export const addReaction = async (req, res, next) => {
  const { id: post_id } = req.params;
  const { type }        = req.body;

  if (!VALID_REACTIONS.includes(type)) {
    return res.status(400).json({ error: `type debe ser: ${VALID_REACTIONS.join(', ')}` });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('reactions')
      .upsert({
        user_id:     req.user.id,
        target_type: 'post',
        target_id:   post_id,
        type
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// DELETE /api/posts/:id/reactions
// Quitar la reacción del usuario autenticado de un post
// ────────────────────────────────────────────────────────────────
export const removeReaction = async (req, res, next) => {
  const { id: post_id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('reactions')
      .delete()
      .eq('user_id',     req.user.id)
      .eq('target_type', 'post')
      .eq('target_id',   post_id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// Helper interno: otorgar insignia si aún no la tiene el usuario
// Llamado en segundo plano sin await para no bloquear la respuesta
// ────────────────────────────────────────────────────────────────
async function awardBadgesAsync(userId, criteriaKey) {
  const { data: badge } = await supabaseAdmin
    .from('badges')
    .select('id')
    .eq('criteria_key', criteriaKey)
    .single();

  if (!badge) return;

  await supabaseAdmin
    .from('user_badges')
    .upsert({ user_id: userId, badge_id: badge.id })
    .throwOnError();
}
