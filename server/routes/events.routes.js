// ── AfroDigital UPB — Rutas de eventos ──────────────────────────
// Base: /api/events

import { Router }      from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// TODO: implementar event.controller.js con estas funciones
// GET    /api/events          → listar eventos (con filtro de fecha)
// POST   /api/events          → crear evento
// GET    /api/events/:id      → detalle de evento
// POST   /api/events/:id/rsvp → confirmar asistencia
// DELETE /api/events/:id/rsvp → cancelar asistencia

router.get('/', (_req, res) => res.json({ message: 'Eventos — próximamente' }));

export default router;
