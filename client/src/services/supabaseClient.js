// ── AfroDigital UPB — Cliente Supabase para el frontend ─────────
// Usa la ANON KEY (clave pública, segura en el navegador)
// La anon key respeta las políticas RLS que definimos en el schema

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;