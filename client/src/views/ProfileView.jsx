import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/apiClient';
import profilePattern from '../assets/visuals/profile-pattern.svg';

/* ══ DATOS DE INSIGNIAS ═════════════════════════════════════ */
const ALL_BADGES = [
  { key:'profile_complete', name:'Perfil completo',  desc:'Completaste todos tus datos de perfil',          icon:'✊🏿', color:'#7C3AED', bg:'rgba(124,58,237,0.15)' },
  { key:'first_post',       name:'Primer paso',      desc:'Publicaste tu primera historia en la comunidad', icon:'✍️',  color:'#2563EB', bg:'rgba(37,99,235,0.15)'  },
  { key:'ten_comments',     name:'Voz activa',       desc:'Dejaste 10 comentarios en la plataforma',       icon:'💬',  color:'#0D9488', bg:'rgba(13,148,136,0.15)' },
  { key:'cultural_content', name:'Aporte cultural',  desc:'Compartiste contenido de historia o música',    icon:'🌿',  color:'#059669', bg:'rgba(5,150,105,0.15)'  },
  { key:'event_streak_3',   name:'Racha de eventos', desc:'Asististe a 3 eventos culturales seguidos',     icon:'🎭',  color:'#FB923C', bg:'rgba(251,146,60,0.15)' },
];

/* ══ ICONOS SVG ═════════════════════════════════════════════ */
const Ico = ({ d, s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

const NAV = [
  { d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",                                                                label:'Feed',        href:'/feed'         },
  { d:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", label:'Comunidades', href:'/community'    },
  { d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",                                    label:'Eventos',     href:'/events'       },
  { d:"M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z",                      label:'Mapa',        href:'/map'          },
  { d:"M8 21h8m-4-4v4M5 3h14l-1 7H6L5 3z M5 10c0 3 3.1 5.5 7 5.5s7-2.5 7-5.5",                                                     label:'Logros',      href:'/achievements' },
];

export default function ProfileView() {
  const { profile, user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activo   = location.pathname;

  const [tab,     setTab]     = useState('posts');
  const [posts,   setPosts]   = useState([]);
  const [earned,  setEarned]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({});
  const memberSince = useMemo(() => {
    const createdAt = user?.created_at ? new Date(user.created_at) : null;
    return createdAt?.toLocaleDateString('es-CO', { month:'long', year:'numeric' }) ?? 'fecha pendiente';
  }, [user]);

  const inicial = profile?.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [p] = await Promise.all([
          api.get('/posts').catch(() => []),
          api.get('/badges').catch(() => []),
        ]);
        setPosts((p || []).filter(x => x.author?.id === user.id || x.author_id === user.id));
        setEarned(['profile_complete']);
      } catch (error) {
        console.error('[ProfileView] Error al cargar datos del perfil', error);
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  const startEditing = () => {
    setForm({
      full_name:           profile?.full_name           ?? '',
      bio:                 profile?.bio                 ?? '',
      university:          profile?.university          ?? '',
      origin_municipality: profile?.origin_municipality ?? '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
    } catch (error) {
      console.error('[ProfileView] Error al guardar perfil', error);
    } finally { setSaving(false); }
  };

  /* Handlers de focus para los inputs */
  const foc = e => { e.target.style.borderColor='#7C3AED'; e.target.style.boxShadow='0 0 0 4px rgba(124,58,237,0.10)'; e.target.style.background='rgba(255,255,255,0.95)'; };
  const blu = e => { e.target.style.borderColor='rgba(124,58,237,0.18)'; e.target.style.boxShadow='none'; e.target.style.background='rgba(250,245,235,0.60)'; };

  return (
    <div className="page-bg flex">

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside className="sidebar-light w-[90px] fixed top-0 left-0 h-screen z-50 flex flex-col items-center py-7">

        {/* Logo */}
        <div className="w-[52px] h-[52px] rounded-[18px] bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-[26px] mb-9 cursor-pointer"
          style={{ boxShadow:'0 8px 24px rgba(124,58,237,0.38)' }}
          onClick={() => navigate('/feed')}>
          ✊🏿
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-1 w-full px-[14px]">
          {NAV.map(item => {
            const on = activo === item.href;
            return (
              <button key={item.href}
                onClick={() => navigate(item.href)}
                title={item.label}
                className="w-full aspect-square rounded-2xl flex items-center justify-center border-none cursor-pointer transition-all duration-200 relative"
                style={{
                  background: on ? 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.12))' : 'transparent',
                  color:      on ? '#7C3AED' : 'rgba(61,53,83,0.38)',
                  boxShadow:  on ? '0 4px 16px rgba(124,58,237,0.18), inset 0 0 0 1px rgba(124,58,237,0.20)' : 'none',
                }}
                onMouseEnter={e => { if (!on) { e.currentTarget.style.background='rgba(124,58,237,0.07)'; e.currentTarget.style.color='#3D3553'; } }}
                onMouseLeave={e => { if (!on) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(61,53,83,0.38)'; } }}
              >
                <Ico d={item.d}/>
                {on && <span className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-[4px] bg-[#7C3AED]"/>}
              </button>
            );
          })}
        </div>

        <div className="flex-1"/>
        <div className="w-10 h-px bg-[rgba(124,58,237,0.12)] mb-4"/>

        {/* Avatar / logout */}
        <div onClick={logout} title="Cerrar sesión"
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center text-[15px] font-extrabold text-white cursor-pointer transition-transform hover:scale-[1.08]"
          style={{ boxShadow:'0 6px 20px rgba(251,146,60,0.38)' }}>
          {inicial}
        </div>
      </aside>

      {/* ══ CONTENIDO PRINCIPAL ══════════════════════════════ */}
      <main className="ml-[90px] flex-1 px-[52px] pt-10 pb-[60px] max-w-[920px]">

        {/* ── COVER + AVATAR ─────────────────────────────── */}
        <div className="card-light overflow-hidden mb-6 anim-up">

          {/* Cover banner */}
          <div className="h-[200px] relative overflow-hidden bg-gradient-to-br from-[#3B0764] via-[#1D4ED8] to-[#FB923C]">
            <img src={profilePattern} alt="Patrón textil afro para portada de perfil" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1523]/45 to-transparent" />

            {/* Decoración */}
            <div className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px] rounded-full bg-white/[0.06] border border-white/10"/>
            <div className="absolute -bottom-[40px] left-[20%] w-[180px] h-[180px] rounded-full bg-[rgba(251,146,60,0.15)] border border-[rgba(251,146,60,0.20)]"/>
            <div className="absolute top-5 left-[40%] w-2 h-2 rounded-full"
              style={{ background:'rgba(255,255,255,0.60)', boxShadow:'0 0 20px 6px rgba(255,255,255,0.25)' }}/>
            <div className="absolute top-[60px] right-[25%] w-[5px] h-[5px] rounded-full"
              style={{ background:'rgba(251,146,60,0.90)', boxShadow:'0 0 16px 5px rgba(251,146,60,0.40)' }}/>

            {/* Badge de rol */}
            <div className="absolute top-5 right-6 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-[0.08em] border border-white/25"
              style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)' }}>
              {profile?.role ?? 'student'}
            </div>

            {/* Botón editar */}
            <button onClick={() => editing ? setEditing(false) : startEditing()}
              className="absolute top-5 left-6 flex items-center gap-1.5 px-[18px] py-[7px] rounded-full text-[13px] font-semibold text-white border border-white/25 cursor-pointer transition-all font-[inherit]"
              style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            >
              <Ico d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" s={14}/>
              {editing ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>

          {/* Avatar + info */}
          <div className="px-9 pb-8">
            <div className="flex items-end justify-between -mt-12 mb-5 flex-wrap gap-4">

              {/* Avatar grande */}
              <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center text-[32px] font-black text-white border-4 border-white flex-shrink-0"
                style={{ boxShadow:'0 8px 32px rgba(251,146,60,0.45)' }}>
                {inicial}
              </div>

              {!editing && (
                <button onClick={() => navigate('/feed')}
                  className="px-[22px] py-[10px] rounded-[14px] text-sm font-bold text-white border-none cursor-pointer transition-all font-[inherit] mt-[52px]"
                  style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', boxShadow:'0 6px 20px rgba(124,58,237,0.32)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(124,58,237,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(124,58,237,0.32)'; }}
                >← Volver al feed</button>
              )}
            </div>

            {/* Modo edición */}
            {editing ? (
              <div className="grid grid-cols-2 gap-[14px]">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#9187A4] tracking-[0.08em] uppercase mb-[7px]">Nombre completo</label>
                  <input value={form.full_name ?? ''} onChange={e => setForm(f => ({ ...f, full_name:e.target.value }))}
                    placeholder="Tu nombre completo" className="profile-input" onFocus={foc} onBlur={blu}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9187A4] tracking-[0.08em] uppercase mb-[7px]">Universidad</label>
                  <input value={form.university ?? ''} onChange={e => setForm(f => ({ ...f, university:e.target.value }))}
                    placeholder="Ej. UPB" className="profile-input" onFocus={foc} onBlur={blu}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9187A4] tracking-[0.08em] uppercase mb-[7px]">Municipio de origen</label>
                  <input value={form.origin_municipality ?? ''} onChange={e => setForm(f => ({ ...f, origin_municipality:e.target.value }))}
                    placeholder="Ej. Quibdó, Chocó" className="profile-input" onFocus={foc} onBlur={blu}/>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#9187A4] tracking-[0.08em] uppercase mb-[7px]">Biografía</label>
                  <textarea value={form.bio ?? ''} onChange={e => setForm(f => ({ ...f, bio:e.target.value }))}
                    placeholder="Cuéntale a la comunidad quién eres..." rows={3}
                    className="profile-input" onFocus={foc} onBlur={blu}/>
                </div>
                <div className="col-span-2 flex gap-[10px] justify-end pt-2">
                  <button onClick={() => setEditing(false)}
                    className="px-[22px] py-[11px] rounded-[14px] bg-transparent border-[1.5px] border-[rgba(124,58,237,0.20)] text-[#9187A4] text-[15px] font-semibold cursor-pointer font-[inherit] transition-all">
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-7 py-[11px] rounded-[14px] text-white text-[15px] font-bold border-none cursor-pointer font-[inherit] disabled:opacity-[0.65] disabled:cursor-not-allowed"
                    style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', boxShadow:'0 6px 20px rgba(124,58,237,0.30)' }}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>

            ) : (
              /* Modo vista */
              <div>
                <h1 className="text-[44px] font-black tracking-[-2px] text-[#1A1523] leading-none mb-2">
                  {profile?.full_name ?? 'Tu nombre'}
                </h1>

                <div className="flex flex-wrap gap-4 mb-[18px] items-center">
                  {profile?.university && (
                    <span className="flex items-center gap-1.5 text-[15px] text-[#9187A4] font-medium">
                      <Ico d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" s={16}/>
                      {profile.university}
                    </span>
                  )}
                  {profile?.origin_municipality && (
                    <span className="flex items-center gap-1.5 text-[15px] text-[#9187A4] font-medium">
                      <Ico d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z" s={16}/>
                      {profile.origin_municipality}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[15px] text-[#9187A4] font-medium">
                    <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" s={16}/>
                    Miembro desde {memberSince}
                  </span>
                </div>

                {profile?.bio
                  ? <p className="text-[17px] text-[#3D3553] leading-[1.7] max-w-[600px] italic border-l-[3px] border-[rgba(124,58,237,0.30)] pl-4">
                      {profile.bio}
                    </p>
                  : <p className="text-[15px] text-[rgba(145,135,164,0.60)] italic cursor-pointer"
                      onClick={startEditing}>
                      + Agrega una biografía para que la comunidad te conozca...
                    </p>
                }
              </div>
            )}
          </div>
        </div>

        {/* ── ESTADÍSTICAS ───────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4 mb-6 anim-up delay-1">
          {[
            { n:posts.length,  l:'Publicaciones', c:'#7C3AED', bg:'rgba(124,58,237,0.09)', icon:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
            { n:0,             l:'Comunidades',   c:'#2563EB', bg:'rgba(37,99,235,0.09)',  icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z' },
            { n:earned.length, l:'Insignias',     c:'#FB923C', bg:'rgba(251,146,60,0.09)', icon:'M8 21h8m-4-4v4M5 3h14l-1 7H6L5 3z' },
            { n:0,             l:'Eventos',       c:'#0D9488', bg:'rgba(13,148,136,0.09)', icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          ].map(s => (
            <div key={s.l}
              className="card-light px-5 py-[22px] flex flex-col gap-3 transition-all duration-[250ms] cursor-default"
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.07)'; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:s.bg, color:s.c }}>
                <Ico d={s.icon} s={20}/>
              </div>
              <div>
                <p className="text-[40px] font-black leading-none tracking-[-2px]" style={{ color:s.c }}>{s.n}</p>
                <p className="text-[13px] text-[#9187A4] mt-1 font-semibold">{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ───────────────────────────────────────── */}
        <div className="card-light overflow-hidden anim-up delay-2">

          {/* Barra de tabs */}
          <div className="flex border-b border-[rgba(124,58,237,0.10)] px-7">
            {[['posts','✍️ Publicaciones'],['badges','🏆 Insignias']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className="px-5 py-[18px] text-[15px] font-bold border-none bg-transparent cursor-pointer transition-all font-[inherit] -mb-px"
                style={{
                  color:        tab === k ? '#7C3AED' : '#9187A4',
                  borderBottom: tab === k ? '3px solid #7C3AED' : '3px solid transparent',
                }}>
                {l}
              </button>
            ))}
          </div>

          {/* ── TAB: PUBLICACIONES ───────────────────────── */}
          {tab === 'posts' && (
            <div className="p-7">
              {loading ? (
                <div className="text-center py-12 text-[#9187A4] text-base">Cargando publicaciones...</div>
              ) : posts.length === 0 ? (
                <div className="text-center px-8 py-16">
                  <span className="text-[56px] block mb-4">✍️</span>
                  <h3 className="text-[22px] font-bold text-[#1A1523] mb-2">Aún no has publicado</h3>
                  <p className="text-base text-[#9187A4] mb-6 leading-[1.6]">
                    Comparte tu primera historia, testimonio o canción con la comunidad.
                  </p>
                  <button onClick={() => navigate('/feed')}
                    className="px-7 py-[13px] rounded-2xl text-[15px] font-bold text-white border-none cursor-pointer transition-all font-[inherit]"
                    style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', boxShadow:'0 6px 24px rgba(124,58,237,0.30)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 32px rgba(124,58,237,0.42)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(124,58,237,0.30)'; }}
                  >✦ Ir al feed a publicar</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {posts.map((post, i) => (
                    <div key={i}
                      className="px-6 py-[22px] rounded-[20px] border transition-all duration-200 bg-[rgba(250,245,235,0.60)] border-[rgba(124,58,237,0.10)]"
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(237,233,254,0.40)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.25)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(250,245,235,0.60)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.10)'; }}
                    >
                      <div className="flex items-center gap-[10px] mb-3">
                        {post.category && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-[rgba(124,58,237,0.10)] text-[#7C3AED] border border-[rgba(124,58,237,0.18)]">
                            {post.category}
                          </span>
                        )}
                        <span className="text-[13px] text-[#9187A4] ml-auto">
                          {new Date(post.created_at).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'})}
                        </span>
                      </div>
                      <p className="text-[17px] leading-[1.70] text-[#3D3553]">{post.content}</p>
                      <div className="flex gap-2 mt-[14px] pt-3 border-t border-[rgba(124,58,237,0.08)]">
                        {(post.reactions ?? []).length > 0
                          ? post.reactions.map((r,j) => (
                              <span key={j} className="text-[15px]">
                                {r.type==='apoyo'?'👊🏿':r.type==='me_representa'?'💜':'🔥'}
                              </span>
                            ))
                          : <span className="text-[13px] text-[rgba(145,135,164,0.55)] italic">Sin reacciones aún</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: INSIGNIAS ───────────────────────────── */}
          {tab === 'badges' && (
            <div className="p-7">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                {ALL_BADGES.map(badge => {
                  const isEarned = earned.includes(badge.key);
                  return (
                    <div key={badge.key}
                      className="p-6 rounded-[20px] relative overflow-hidden transition-all duration-[250ms]"
                      style={{
                        background: isEarned ? badge.bg : 'rgba(243,244,246,0.80)',
                        border:     isEarned ? `1px solid ${badge.color}30` : '1px solid rgba(0,0,0,0.06)',
                        filter:     isEarned ? 'none' : 'grayscale(1)',
                        opacity:    isEarned ? 1 : 0.55,
                      }}
                      onMouseEnter={e => { if (isEarned) { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${badge.color}25`; } }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                    >
                      {isEarned && (
                        <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full opacity-25"
                          style={{ background:badge.color, filter:'blur(40px)' }}/>
                      )}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[36px] leading-none">{badge.icon}</span>
                          {isEarned
                            ? <span className="px-[10px] py-1 rounded-xl text-[11px] font-bold border"
                                style={{ background:`${badge.color}20`, color:badge.color, border:`1px solid ${badge.color}30` }}>
                                Obtenida ✓
                              </span>
                            : <span className="px-[10px] py-1 rounded-xl text-[11px] font-semibold bg-black/[0.06] text-[#9CA3AF]">
                                🔒 Bloqueada
                              </span>
                          }
                        </div>
                        <h4 className="text-[17px] font-extrabold mb-1 tracking-tight"
                          style={{ color: isEarned ? '#1A1523' : '#6B7280' }}>
                          {badge.name}
                        </h4>
                        <p className="text-sm leading-[1.5]"
                          style={{ color: isEarned ? '#3D3553' : '#9CA3AF' }}>
                          {badge.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barra de progreso */}
              <div className="mt-6 px-6 py-5 rounded-[20px] border border-[rgba(124,58,237,0.14)] bg-gradient-to-r from-[rgba(124,58,237,0.08)] to-[rgba(37,99,235,0.06)]">
                <div className="flex justify-between items-center mb-[10px]">
                  <p className="text-[15px] font-bold text-[#1A1523]">Progreso de insignias</p>
                  <p className="text-[15px] font-bold text-[#7C3AED]">{earned.length} / {ALL_BADGES.length}</p>
                </div>
                <div className="h-2 rounded-full bg-[rgba(124,58,237,0.12)] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] transition-[width] duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ width:`${(earned.length/ALL_BADGES.length)*100}%`, boxShadow:'0 0 12px rgba(124,58,237,0.40)' }}/>
                </div>
                <p className="text-[13px] text-[#9187A4] mt-2">
                  {ALL_BADGES.length - earned.length} insignias por desbloquear — sigue participando en la comunidad
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}