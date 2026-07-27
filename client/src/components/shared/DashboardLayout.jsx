import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
const links = [
  ["/inicio", "⌂", "Inicio"],
  ["/foro", "◌", "Foro"],
  ["/comunidades", "◉", "Comunidades"],
  ["/mapa", "⌖", "Mapa"],
  ["/eventos", "◷", "Eventos"],
  ["/salas", "◈", "Salas"],
  ["/logros", "✦", "Logros"],
];
export default function DashboardLayout({ eyebrow, title, children, kind }) {
  const { user, logout } = useAuth(),
    navigate = useNavigate();
  const tone =
    { posts: "from-emerald-950 via-stone-950 to-purple-950", communities: "from-fuchsia-950 via-stone-950 to-orange-950", events: "from-amber-950 via-stone-950 to-red-950", map: "from-emerald-950 via-stone-950 to-amber-950", rooms: "from-violet-950 via-stone-950 to-rose-950", profile: "from-stone-950 via-zinc-950 to-orange-950", achievements: "from-purple-950 via-stone-950 to-amber-950" }[kind] ||
    "from-stone-950 via-neutral-950 to-orange-950";
  const glow = kind === "posts" ? "bg-emerald-300/15" : "bg-amber-400/15";
  return (
    <main className={`min-h-screen bg-gradient-to-br ${tone} p-4 text-stone-100 md:p-10`}>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-[4.5rem_1fr] overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 shadow-2xl backdrop-blur-2xl">
        <aside className="flex flex-col items-center border-r border-white/10 bg-black/15 py-5">
          <NavLink to="/perfil" className="mb-6 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-stone-900 transition hover:scale-110">
            {user?.email?.[0]?.toUpperCase() || "?"}
          </NavLink>
          {links.map(([to, icon, label]) => (
            <NavLink key={to} to={to} title={label} className={({ isActive }) => `mb-2 grid h-11 w-11 place-items-center rounded-2xl text-lg transition duration-300 hover:scale-110 ${isActive ? "bg-amber-300 text-stone-900 shadow-lg" : "text-stone-300 hover:bg-white/10"}`}>
              <span>{icon}</span>
            </NavLink>
          ))}
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="mt-auto grid h-11 w-11 place-items-center rounded-2xl text-stone-300 transition hover:scale-110 hover:bg-white/10"
            title="Cerrar sesión"
          >
            ↪
          </button>
        </aside>
        <section className="relative overflow-hidden p-6 md:p-10">
          <div className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 animate-pulse rounded-full ${glow} blur-3xl`} />
          <p className="relative text-xs font-bold tracking-[.22em] text-amber-300/80">{eyebrow}</p>
          <h1 className="relative mt-2 max-w-2xl text-4xl font-black tracking-tight text-white transition duration-500 hover:translate-x-1 md:text-6xl">{title}</h1>
          {children}
        </section>
      </div>
    </main>
  );
}
