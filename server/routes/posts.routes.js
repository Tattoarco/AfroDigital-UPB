// ── AfroDigital UPB — Rutas de posts ────────────────────────────
// Base: /api/posts

import { Router }       from 'express';
import {
  getFeed,
  createPost,
  deletePost,
  addReaction,
  removeReaction
}                       from '../controllers/post.controller.js';
import { verifyToken }  from '../middlewares/auth.middleware.js';
import { checkRole }    from '../middlewares/roles.middleware.js';

const router = Router();

// GET    /api/posts              → Feed general (público)
router.get('/',                           getFeed);

// POST   /api/posts              → Crear post (requiere sesión)
router.post('/',          verifyToken,    createPost);

// DELETE /api/posts/:id          → Eliminar post (autor o moderador)
router.delete('/:id',     verifyToken,    deletePost);

// POST   /api/posts/:id/reactions  → Reaccionar a un post
router.post('/:id/reactions',  verifyToken, addReaction);

// DELETE /api/posts/:id/reactions  → Quitar reacción
router.delete('/:id/reactions', verifyToken, removeReaction);

export default router;
