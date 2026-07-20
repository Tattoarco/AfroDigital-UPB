import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PostForm from '../components/posts/PostForm';
import feedStory from '../assets/visuals/feed-story.svg';

const NAV_ITEMS = [
  { label: 'Feed',        href: '/feed'         },
  { label: 'Comunidades', href: '/community'    },
  { label: 'Eventos',     href: '/events'       },
  { label: 'Mapa',        href: '/map'          },
  { label: 'Logros',      href: '/achievements' },
];

export default function FeedView() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activo   = location.pathname;

  const [showForm, setShowForm] = useState(false);
  const [posts,    setPosts]    = useState([]);

  const inicial = profile?.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';
  const hoy     = new Date().toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long' });
  const onPost  = p => { setPosts(prev => [p, ...prev]); setShowForm(false); };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">

      {/* ── Fondo atmosférico ──────────────────────────────── */}
      <div className="feed-bg fixed inset-0 z-0" />

      {/* ── Textura de grano ───────────────────────────────── */}
      <div className="noise fixed inset-0 z-0 opacity-[0.04]" />

      {/* ── Puntos de luz flotantes ────────────────────────── */}
      <div className="fixed z-10 w-[6px] h-[6px] rounded-full top-[15%] left-[18%]"
        style={{ background:'rgba(251,146,60,0.7)', boxShadow:'0 0 20px 8px rgba(251,146,60,0.3)', animation:'pulse-dot 3s ease-in-out infinite' }} />
      <div className="fixed z-10 w-[5px] h-[5px] rounded-full top-[65%] right-[12%]"
        style={{ background:'rgba(124,58,237,0.8)', boxShadow:'0 0 16px 6px rgba(124,58,237,0.35)', animation:'pulse-dot 4s ease-in-out infinite 1s' }} />
      <div className="fixed z-10 w-[4px] h-[4px] rounded-full top-[35%] right-[22%]"
        style={{ background:'rgba(96,165,250,0.8)', boxShadow:'0 0 14px 5px rgba(96,165,250,0.30)', animation:'pulse-dot 5s ease-in-out infinite 2s' }} />

      {/* ── Contenido ──────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col min-h-screen px-8 pt-6 pb-10">

        {/* ══ TOP BAR ════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-8">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/feed')}>
            <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-[22px] rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#4F46E5]"
              style={{ boxShadow:'0 8px 24px rgba(124,58,237,0.50)' }}>
              ✊🏿
            </div>
            <div>
              <p className="text-[18px] font-extrabold leading-none tracking-tight text-white">AfroDigital</p>
              <p className="text-xs text-white/45 tracking-[0.05em] mt-0.5">UPB · {hoy}</p>
            </div>
          </div>

          {/* Nav pill */}
          <nav className="nav-pill">
            {NAV_ITEMS.map(item => {
              const on = activo === item.href;
              return (
                <button key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`px-[18px] py-[9px] rounded-full text-sm border-none cursor-pointer transition-all duration-[250ms] font-[inherit] ${
                    on
                      ? 'bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] text-white font-bold'
                      : 'bg-transparent text-white/55 font-medium hover:text-white/85'
                  }`}
                  style={{ boxShadow: on ? '0 4px 16px rgba(124,58,237,0.55)' : 'none' }}
                >{item.label}</button>
              );
            })}
          </nav>

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right cursor-pointer" onClick={() => navigate('/profile')}>
              <p className="text-[15px] font-semibold text-white leading-none">
                {profile?.full_name?.split(' ')[0]}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.06em] mt-0.5 text-[rgba(251,146,60,0.85)]">
                {profile?.role ?? 'student'}
              </p>
            </div>
            <div onClick={() => navigate('/profile')}
              className="w-[46px] h-[46px] flex-shrink-0 flex items-center justify-center rounded-[14px] bg-gradient-to-br from-[#FB923C] to-[#F97316] text-[15px] font-extrabold text-white cursor-pointer transition-transform hover:scale-[1.08]"
              style={{ boxShadow:'0 6px 20px rgba(251,146,60,0.55)' }}
            >{inicial}</div>
          </div>
        </div>

        {/* ══ GRID PRINCIPAL ═════════════════════════════════ */}
        <div className="grid grid-cols-[280px_1fr] gap-5 flex-1 items-start">

          {/* ── PANEL IZQUIERDO ──────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Perfil */}
            <div className="g3d-strong px-6 pt-7 pb-7 text-center cursor-pointer"
              onClick={() => navigate('/profile')}>
              <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center text-[22px] font-extrabold text-white mx-auto mb-[14px]"
                style={{ boxShadow:'0 10px 30px rgba(251,146,60,0.55)' }}>
                {inicial}
              </div>
              <h3 className="text-lg font-extrabold text-white mb-1 tracking-tight">{profile?.full_name}</h3>
              <p className="text-[13px] text-white/50 mb-5">{profile?.university ?? 'UPB'}</p>

              <div className="grid grid-cols-3 gap-2">
                {[[posts.length,'Posts','#7C3AED'],[0,'Comun.','#2563EB'],[0,'Logros','#FB923C']].map(([n,l,c]) => (
                  <div key={l} className="py-3 px-2 rounded-[14px] bg-white/[0.06] border border-white/10">
                    <p className="text-2xl font-black leading-none tracking-tight" style={{ color:c }}>{n}</p>
                    <p className="text-[11px] text-white/40 mt-0.5 font-medium">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/25 mt-3">Toca para ver tu perfil →</p>
            </div>

            {/* Comunidades */}
            <div className="g3d p-5">
              <div className="flex justify-between items-center mb-[14px]">
                <p className="text-xs uppercase tracking-[0.14em] text-white/40 font-semibold">Mis comunidades</p>
                <button onClick={() => navigate('/community')}
                  className="text-[11px] font-semibold border-none bg-transparent cursor-pointer font-[inherit] text-[rgba(124,58,237,0.80)]">
                  Ver todas →
                </button>
              </div>
              {[
                { n:'Afro UPB',    c:'#7C3AED', m:'142 miembros' },
                { n:'Arte Afro',   c:'#2563EB', m:'67 miembros'  },
                { n:'Música Afro', c:'#FB923C', m:'89 miembros'  },
              ].map(com => (
                <div key={com.n} onClick={() => navigate('/community')}
                  className="flex items-center gap-[10px] p-[10px] rounded-xl mb-1 cursor-pointer transition-colors hover:bg-white/[0.07]">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[16px] flex-shrink-0"
                    style={{ background:com.c }}>
                    {com.n[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/[0.88] leading-none">{com.n}</p>
                    <p className="text-xs text-white/35 mt-0.5">{com.m}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Próximos eventos */}
            <div className="g3d p-5">
              <div className="flex justify-between items-center mb-[14px]">
                <p className="text-xs uppercase tracking-[0.14em] text-white/40 font-semibold">Próximos eventos</p>
                <button onClick={() => navigate('/events')}
                  className="text-[11px] font-semibold border-none bg-transparent cursor-pointer font-[inherit] text-[rgba(251,146,60,0.80)]">
                  Ver todos →
                </button>
              </div>
              {[
                { n:'Festival AfroDigital', d:'15 ago', c:'#7C3AED' },
                { n:'Noche de Currulao',    d:'25 jul', c:'#FB923C' },
              ].map(ev => (
                <div key={ev.n} onClick={() => navigate('/events')}
                  className="flex items-center gap-[10px] p-[10px] rounded-xl mb-1 cursor-pointer transition-colors hover:bg-white/[0.07]">
                  <div className="w-10 h-10 rounded-[10px] flex flex-col items-center justify-center flex-shrink-0 border"
                    style={{ background:`${ev.c}22`, borderColor:`${ev.c}40` }}>
                    <p className="text-[13px] font-black leading-none" style={{ color:ev.c }}>{ev.d.split(' ')[0]}</p>
                    <p className="text-[10px] uppercase leading-none mt-0.5" style={{ color:`${ev.c}99` }}>{ev.d.split(' ')[1]}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-white/80 leading-[1.3]">{ev.n}</p>
                </div>
              ))}
            </div>

            {/* Reacciones culturales */}
            <div className="g3d p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-white/40 font-semibold mb-[14px]">Reacciones culturales</p>
              {[
                ['👊🏿','Apoyo',          'rgba(124,58,237,0.20)'],
                ['💜', 'Me representa', 'rgba(37,99,235,0.20)' ],
                ['🔥', 'Fuego',          'rgba(251,146,60,0.20)'],
              ].map(([em,lb,bg]) => (
                <div key={lb}
                  className="flex items-center gap-[10px] px-3 py-[10px] rounded-xl border border-white/[0.08] mb-1.5"
                  style={{ background:bg }}>
                  <span className="text-xl">{em}</span>
                  <span className="text-sm font-medium text-white/75">{lb}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FEED PRINCIPAL ───────────────────────────── */}
          <div className="flex flex-col gap-4">

            <div className="g3d-strong overflow-hidden relative min-h-[210px] flex items-center">
              <img src={feedStory} alt="Ilustración de historias y memoria colectiva afro" className="absolute inset-0 w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080212]/95 via-[#080212]/70 to-transparent" />
              <div className="relative z-10 px-8 py-7 max-w-[520px]">
                <p className="text-xs uppercase tracking-[0.18em] text-[#FCA87A] font-bold mb-3">Historias vivas</p>
                <h2 className="text-[34px] font-black leading-[0.98] tracking-[-1.4px] mb-3">Comparte memoria, territorio y cultura.</h2>
                <p className="text-white/60 leading-relaxed text-[15px]">El feed ahora abre con una pieza visual propia para que la experiencia se sienta más cercana a AfroDigital y menos como una red social genérica.</p>
              </div>
            </div>

            {/* Caja publicar */}
            <div className="g3d-strong overflow-hidden transition-all duration-300">
              {showForm
                ? <PostForm onSuccess={onPost} onCancel={() => setShowForm(false)} dark />
                : (
                  <div className="px-[26px] py-[22px]">
                    <div className="flex items-center gap-[14px]">
                      <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0">
                        {inicial}
                      </div>
                      <button onClick={() => setShowForm(true)}
                        className="flex-1 text-left px-[18px] py-[14px] rounded-[14px] text-base cursor-pointer transition-all duration-200 bg-white/[0.06] border border-white/10 text-white/35 font-[inherit]"
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.40)'; e.currentTarget.style.color='rgba(255,255,255,0.60)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}
                      >
                        ¿Qué quieres compartir con la comunidad hoy?
                      </button>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.07]">
                      {[['📷','Foto'],['🎵','Audio'],['✍️','Historia'],['📍','Lugar']].map(([ic,lb]) => (
                        <button key={lb} onClick={() => setShowForm(true)}
                          className="flex items-center gap-1.5 px-[14px] py-2 rounded-[10px] text-sm font-medium cursor-pointer transition-all duration-200 bg-white/[0.06] border border-white/[0.09] text-white/50 font-[inherit]"
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(124,58,237,0.22)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.40)'; e.currentTarget.style.color='#A78BFA'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.color='rgba(255,255,255,0.50)'; }}
                        >{ic} {lb}</button>
                      ))}
                    </div>
                  </div>
                )
              }
            </div>

            {/* Posts o empty state */}
            {posts.length > 0
              ? posts.map((post, i) => (
                <div key={i}
                  className="g3d card-hover px-[28px] py-[26px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div onClick={() => navigate('/profile')}
                      className="w-[42px] h-[42px] rounded-[13px] bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center text-[13px] font-extrabold text-white cursor-pointer flex-shrink-0">
                      {inicial}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-white/95">{profile?.full_name}</p>
                      <p className="text-xs text-white/35 mt-0.5">ahora mismo</p>
                    </div>
                    {post.category && (
                      <span className="ml-auto px-[13px] py-[5px] rounded-full text-xs font-semibold capitalize bg-[rgba(124,58,237,0.22)] text-[#A78BFA] border border-[rgba(124,58,237,0.30)]">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <p className="text-[17px] leading-[1.70] text-white/[0.78]">{post.content}</p>

                  <div className="flex gap-2 mt-[18px] pt-4 border-t border-white/[0.07]">
                    {[['👊🏿','Apoyo'],['💜','Me representa'],['🔥','Fuego']].map(([em,lb]) => (
                      <button key={lb}
                        className="flex items-center gap-1.5 px-[14px] py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 bg-white/[0.06] border border-white/[0.09] text-white/50 font-[inherit]"
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(124,58,237,0.22)'; e.currentTarget.style.color='#A78BFA'; e.currentTarget.style.borderColor='rgba(124,58,237,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.50)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}
                      >{em} {lb}</button>
                    ))}
                  </div>
                </div>
              ))
              : (
                <div className="g3d px-8 py-[72px] text-center">
                  <span className="text-[68px] block mb-5" style={{ animation:'anim-float 5s ease-in-out infinite' }}>✊🏿</span>
                  <h3 className="text-[26px] font-extrabold text-white/90 mb-[10px] tracking-tight">
                    El feed espera sus primeras voces
                  </h3>
                  <p className="text-[17px] text-white/40 max-w-[320px] mx-auto mb-7 leading-[1.65]">
                    Comparte una historia, canción o testimonio de la comunidad afro.
                  </p>
                  <button onClick={() => setShowForm(true)}
                    className="px-8 py-[15px] rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] border-none text-white text-base font-bold cursor-pointer transition-all duration-300 font-[inherit]"
                    style={{ boxShadow:'0 8px 32px rgba(124,58,237,0.55)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(124,58,237,0.65)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(124,58,237,0.55)'; }}
                  >✦ Crear primera publicación</button>
                </div>
              )
            }
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:.5; transform:scale(1); }
          50%      { opacity:1; transform:scale(1.4); }
        }
        @keyframes anim-float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-12px); }
        }
      `}</style>
    </div>
  );
}