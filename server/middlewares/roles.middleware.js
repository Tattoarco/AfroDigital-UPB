// ── AfroDigital UPB — Middleware de roles ───────────────────────
// Uso: router.delete('/ruta', verifyToken, checkRole('moderator', 'admin'), ctrl)

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere: ${allowedRoles.join(' o ')}`
      });
    }

    next();
  };
};
