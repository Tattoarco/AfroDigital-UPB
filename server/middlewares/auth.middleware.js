import supabaseAdmin from '../services/supabaseClient.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Supabase valida la firma y expiración del JWT
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Obtener el rol del perfil público (tabla public.users)
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    // Adjuntar usuario al request para los controladores
    req.user = {
      id:    user.id,
      email: user.email,
      role:  profile?.role ?? 'student'
    };

    next();
  } catch (err) {
    console.error('[verifyToken]', err.message);
    return res.status(500).json({ error: 'Error al verificar token' });
  }
};