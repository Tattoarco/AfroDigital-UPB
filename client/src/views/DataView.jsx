import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../components/shared/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const cfg = {
  posts: { title: "Historias que nos conectan", eyebrow: "FORO DE LA COMUNIDAD", endpoint: "posts", empty: "Aún no hay publicaciones." },
  communities: { title: "Comunidades", eyebrow: "ENCUENTRA TU ESPACIO", endpoint: "communities", empty: "No hay comunidades disponibles todavía." },
  events: { title: "Eventos", eyebrow: "ENCUENTROS Y ACTIVIDADES", endpoint: "events", empty: "No hay eventos programados todavía." },
  map: { title: "Mapa de la comunidad", eyebrow: "TERRITORIOS CONECTADOS", empty: "Aún no hay ubicaciones registradas." },
  rooms: { title: "Salas en vivo", eyebrow: "CONVERSACIONES ABIERTAS", empty: "No hay salas activas en este momento." },
  profile: { title: "Mi perfil", eyebrow: "IDENTIDAD Y PREFERENCIAS", endpoint: "auth/profile", empty: "No hay información de perfil disponible." },
  achievements: { title: "Logros", eyebrow: "PROGRESO DE LA COMUNIDAD", empty: "Aún no hay insignias registradas." },
};
export default function DataView({ kind }) {
  const { session } = useAuth(),
    v = cfg[kind];
  const [items, setItems] = useState([]),
    [state, setState] = useState("loading"),
    [content, setContent] = useState(""),
    [category, setCategory] = useState(""),
    [note, setNote] = useState("");
  const auth = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
  const load = useCallback(async () => {
    if (!v.endpoint) {
      setState("ready");
      return;
    }
    setState("loading");
    try {
      const r = await fetch(`${API}/${v.endpoint}`, { headers: auth });
      if (!r.ok) throw Error();
      const d = await r.json();
      setItems(Array.isArray(d) ? d : d?.id ? [d] : []);
      setState("ready");
    } catch {
      setState("error");
    }
  }, [v.endpoint, session?.access_token]);
  useEffect(() => {
    load();
  }, [load]);
  async function publish(e) {
    e.preventDefault();
    try {
      const r = await fetch(`${API}/posts`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ content_type: "text", content, category: category || null }) });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setContent("");
      setCategory("");
      setNote("Publicación creada.");
      load();
    } catch (e) {
      setNote(e.message || "No fue posible publicar.");
    }
  }
  return (
    <DashboardLayout kind={kind} title={v.title} eyebrow={v.eyebrow}>
      {kind === "posts" && (
        <form onSubmit={publish} className="relative mt-8 max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
          <label className="text-sm font-bold text-amber-100">
            Comparte con la comunidad
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} maxLength="500" placeholder="Una historia, idea o testimonio…" className="mt-3 min-h-28 w-full resize-y rounded-2xl border border-white/15 bg-black/20 p-4 text-sm outline-none placeholder:text-stone-400 focus:border-amber-300" />
          </label>
          <div className="mt-3 flex justify-between gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-white/15 bg-stone-900/60 px-3 text-sm">
              <option value="">Sin categoría</option>
              <option value="history">Historia</option>
              <option value="music">Música</option>
              <option value="testimony">Testimonio</option>
              <option value="culture">Cultura</option>
            </select>
            <button className="rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-2 text-sm font-extrabold text-stone-950">Publicar →</button>
          </div>
          {note && <p className="mt-3 text-xs text-amber-200">{note}</p>}
        </form>
      )}{" "}
      {kind === "map" ? (
        <div className="relative mt-8 grid min-h-72 max-w-3xl place-items-center rounded-3xl border border-white/20 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:36px_36px] p-8 text-center backdrop-blur">
          <div>
            <span className="text-5xl text-amber-300">✦</span>
            <p className="mt-4 font-bold">{v.empty}</p>
            <p className="mt-2 text-sm text-stone-300">El mapa aparecerá cuando existan territorios compartidos.</p>
          </div>
        </div>
      ) : (
        <section className="relative mt-8 grid max-w-3xl gap-4">
          {state === "loading" && <Empty text="Cargando información…" />}
          {state === "error" && <Empty text="No fue posible consultar esta información." />}
          {state === "ready" && items.length === 0 && <Empty text={v.empty} />}{" "}
          {items.map((x) => (
            <article key={x.id} className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
              <h2 className="text-lg font-extrabold text-amber-100">{x.name || x.full_name || x.author?.full_name || ""}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-200">{x.content || x.bio || x.university || x.description || ""}</p>
              <div className="mt-4 flex justify-between border-t border-white/10 pt-3 text-xs text-stone-300">
                <span>{x.category || x.origin_municipality || ""}</span>
                <span>{x.reactions?.length || 0} reacciones</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </DashboardLayout>
  );
}
function Empty({ text }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-black/15 p-8 text-center text-sm text-stone-300 backdrop-blur">
      <strong className="block text-base text-amber-100">{text}</strong>
      <span className="mt-2 block">Esta vista solo mostrará información registrada por la comunidad.</span>
    </div>
  );
}
