// ── AfroDigital UPB — Cliente HTTP para el backend Express ───────
// Wraps fetch para añadir automáticamente el token de Supabase Auth
// Uso: import api from '@/services/apiClient'
//      const posts = await api.get('/posts')

import supabase from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

// ── Obtener headers con token JWT ──────────────────────────────
async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` })
  };
}

// ── Parsear respuesta y lanzar error si el status no es 2xx ───
async function parseResponse(res) {
  if (res.status === 204) return null;           // No Content

  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `Error ${res.status}`);
  return body;
}

// ── Métodos públicos ───────────────────────────────────────────
async function get(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: await authHeaders() });
  return parseResponse(res);
}

async function post(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method:  'POST',
    headers: await authHeaders(),
    body:    JSON.stringify(body)
  });
  return parseResponse(res);
}

async function put(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method:  'PUT',
    headers: await authHeaders(),
    body:    JSON.stringify(body)
  });
  return parseResponse(res);
}

async function del(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method:  'DELETE',
    headers: await authHeaders()
  });
  return parseResponse(res);
}

const api = { get, post, put, delete: del };
export default api;