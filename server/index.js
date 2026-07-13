// ── AfroDigital UPB — Servidor Express ──────────────────────────
// Instalación previa:
//   npm install express cors dotenv @supabase/supabase-js
//   (en package.json asegúrate de tener "type": "module")

import dotenv     from 'dotenv';
import express    from 'express';
import cors       from 'cors';

import authRoutes        from './routes/auth.routes.js';
import postsRoutes       from './routes/posts.routes.js';
import communitiesRoutes from './routes/communities.routes.js';
import eventsRoutes      from './routes/events.routes.js';
import { errorHandler }  from './middlewares/error.middleware.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares globales ─────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '5mb' }));

// ── Rutas ────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/posts',       postsRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/events',      eventsRoutes);

// Health check — útil para monitoreo en Render
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Manejador global de errores (debe ir al final) ───────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 AfroDigital API escuchando en http://localhost:${PORT}`);
});

export default app;
