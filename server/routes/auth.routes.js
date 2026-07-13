// ── AfroDigital UPB — Rutas de autenticación ────────────────────
// Base: /api/auth
// Nota: el registro y login los hace Supabase directamente desde el frontend.
// Este router maneja el perfil y acciones que necesitan lógica de negocio.

import { Router }                          from 'express';
import { getProfile, updateProfile }       from '../controllers/auth.controller.js';
import { verifyToken }                     from '../middlewares/auth.middleware.js';

const router = Router();

// GET  /api/auth/profile     → Perfil del usuario autenticado
router.get('/profile',  verifyToken, getProfile);

// PUT  /api/auth/profile     → Actualizar datos del perfil
router.put('/profile',  verifyToken, updateProfile);

export default router;
