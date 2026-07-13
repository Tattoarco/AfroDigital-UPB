// ── AfroDigital UPB — Rutas de comunidades ──────────────────────
// Base: /api/communities

import { Router }      from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// TODO: implementar community.controller.js con estas funciones
// GET  /api/communities           → listar comunidades
// POST /api/communities           → crear comunidad
// GET  /api/communities/:id       → detalle de comunidad
// POST /api/communities/:id/join  → unirse a comunidad

router.get('/', (_req, res) => res.json({ message: 'Comunidades — próximamente' }));

export default router;
