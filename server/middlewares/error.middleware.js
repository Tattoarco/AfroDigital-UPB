// ── AfroDigital UPB — Manejador global de errores ───────────────
// Express lo reconoce como error handler por tener 4 parámetros (err, req, res, next)
// Regístralo al final de index.js: app.use(errorHandler)

export const errorHandler = (err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} →`, err.message);

  const status  = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Error interno del servidor';

  res.status(status).json({
    error: message,
    // Solo muestra el stack en desarrollo para no exponer internos en producción
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
