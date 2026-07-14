import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';   // ← AÑADIDO
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/posts/PostForm';

const NAV_ITEMS = [
  { label:'Feed',        href:'/feed',         d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { label:'Comunidades', href:'/community',    d:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" },
  { label:'Eventos',     href:'/events',       d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label:'Mapa',        href:'/map',          d:"M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z" },
  { label:'Logros',      href:'/achievements', d:"M8 21h8m-4-4v4M5 3h14l-1 7H6L5 3z M5 10c0 3 3.1 5.5 7 5.5s7-2.5 7-5.5" },
];

const glass3d = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.13)',
  borderTop: '1px solid rgba(255,255,255,0.22)',
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 2px 4px rgba(0,0,0,0.20),
    0 8px 24px rgba(0,0,0,0.35),
    0 32px 64px rgba(0,0,0,0.30)
  `,
  borderRadius: '24px',
};

const glass3dStrong = {
  background: 'rgba(255,255,255,0.10)',
  backdropFilter: 'blur(48px)',
  WebkitBackdropFilter: 'blur(48px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderTop: '1px solid rgba(255,255,255,0.30)',
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.18),
    0 4px 8px rgba(0,0,0,0.25),
    0 16px 40px rgba(0,0,0,0.45),
    0 48px 96px rgba(0,0,0,0.30)
  `,
  borderRadius: '28px',
};

export default function FeedView() {
  const { profile, logout } = useAuth();
  const navigate  = useNavigate();                               // ← AÑADIDO
  const location  = useLocation();                              // ← AÑADIDO
  const activo    = location.pathname;                          // ← derivado de la URL real

  const [showForm, setShowForm] = useState(false);
  const [posts,    setPosts]    = useState([]);

  const inicial = profile?.full_name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() ?? '?';
  const hoy = new Date().toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'});
  const onPost = p => { setPosts(prev=>[p,...prev]); setShowForm(false); };

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflow:'hidden', color:'#fff' }}>

      {/* ══ FONDO atmosférico ════════════════════════════════════ */}
      <div style={{
        position:'fixed', inset:0, zIndex:0,
        background:`
          radial-gradient(ellipse 90% 55% at 50% 115%, rgba(251,146,60,0.55) 0%, transparent 55%),
          radial-gradient(ellipse 60% 75% at -8%  50%, rgba(124,58,237,0.60) 0%, transparent 52%),
          radial-gradient(ellipse 50% 65% at 108% 32%, rgba(37,99,235,0.45)  0%, transparent 52%),
          radial-gradient(ellipse 55% 45% at 50%  2%,  rgba(139,92,246,0.25) 0%, transparent 55%),
          radial-gradient(ellipse 35% 35% at 72%  68%, rgba(251,146,60,0.20) 0%, transparent 45%),
          radial-gradient(ellipse 30% 30% at 28%  72%, rgba(124,58,237,0.20) 0%, transparent 40%),
          linear-gradient(160deg, #160929 0%, #0C0418 28%, #130A2A 60%, #080212 100%)
        `,
      }}/>

      {/* Textura */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, opacity:0.04,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize:'256px 256px',
      }}/>

      {/* Puntos de luz */}
      <div style={{ position:'fixed', top:'15%', left:'18%', width:'6px', height:'6px', borderRadius:'50%', background:'rgba(251,146,60,0.7)', boxShadow:'0 0 20px 8px rgba(251,146,60,0.3)', zIndex:1, animation:'pulse-dot 3s ease-in-out infinite' }}/>
      <div style={{ position:'fixed', top:'65%', right:'12%', width:'5px', height:'5px', borderRadius:'50%', background:'rgba(124,58,237,0.8)', boxShadow:'0 0 16px 6px rgba(124,58,237,0.35)', zIndex:1, animation:'pulse-dot 4s ease-in-out infinite 1s' }}/>
      <div style={{ position:'fixed', top:'35%', right:'22%', width:'4px', height:'4px', borderRadius:'50%', background:'rgba(96,165,250,0.8)', boxShadow:'0 0 14px 5px rgba(96,165,250,0.30)', zIndex:1, animation:'pulse-dot 5s ease-in-out infinite 2s' }}/>

      {/* ══ CONTENIDO ════════════════════════════════════════════ */}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', minHeight:'100vh', padding:'24px 32px 40px' }}>

        {/* ── TOP BAR ────────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px' }}>

          {/* Logo — navega a /feed al hacer clic */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', cursor:'pointer' }}
            onClick={() => navigate('/feed')}>                  {/* ← NAVEGA */}
            <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#7C3AED,#4F46E5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', boxShadow:'0 8px 24px rgba(124,58,237,0.50)', flexShrink:0 }}>✊🏿</div>
            <div>
              <p style={{ fontSize:'18px', fontWeight:800, lineHeight:1, letterSpacing:'-0.5px', color:'#fff' }}>AfroDigital</p>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', letterSpacing:'0.05em', marginTop:'2px' }}>UPB · {hoy}</p>
            </div>
          </div>

          {/* Nav pill — ahora navega de verdad ──────────────── */}
          <div style={{ ...glass3d, padding:'5px', borderRadius:'50px', display:'flex', gap:'2px', boxShadow:'0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
            {NAV_ITEMS.map(item => {
              const on = activo === item.href;               // ← compara con URL real
              return (
                <button key={item.href}
                  onClick={() => navigate(item.href)}        // ← NAVEGA
                  style={{
                    padding:'9px 18px', borderRadius:'40px', border:'none', cursor:'pointer',
                    fontSize:'14px', fontWeight:on?700:500, transition:'all .25s',
                    background: on ? 'linear-gradient(135deg,#7C3AED,#4F46E5)' : 'transparent',
                    color: on ? '#fff' : 'rgba(255,255,255,0.55)',
                    boxShadow: on ? '0 4px 16px rgba(124,58,237,0.55)' : 'none',
                    fontFamily:'inherit',
                  }}
                  onMouseEnter={e=>{ if(!on) e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}
                  onMouseLeave={e=>{ if(!on) e.currentTarget.style.color='rgba(255,255,255,0.55)'; }}
                >{item.label}</button>
              );
            })}
          </div>

          {/* Avatar — clic navega a /profile ────────────────── */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ textAlign:'right', cursor:'pointer' }}
              onClick={() => navigate('/profile')}>           {/* ← NAVEGA */}
              <p style={{ fontSize:'15px', fontWeight:600, color:'#fff', lineHeight:1 }}>{profile?.full_name?.split(' ')[0]}</p>
              <p style={{ fontSize:'12px', color:'rgba(251,146,60,0.85)', marginTop:'3px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>{profile?.role ?? 'student'}</p>
            </div>
            <div
              onClick={() => navigate('/profile')}            // ← NAVEGA
              title="Ver perfil"
              style={{ width:'46px', height:'46px', borderRadius:'14px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:800, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(251,146,60,0.55)', transition:'all .2s', flexShrink:0 }}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
            >{inicial}</div>
          </div>
        </div>

        {/* ── GRID PRINCIPAL ─────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'20px', flex:1, alignItems:'start' }}>

          {/* PANEL IZQUIERDO */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Perfil card — clic navega a /profile */}
            <div style={{ ...glass3dStrong, padding:'28px 24px', textAlign:'center', cursor:'pointer' }}
              onClick={() => navigate('/profile')}>           {/* ← NAVEGA */}
              <div style={{ width:'72px', height:'72px', borderRadius:'20px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:800, color:'#fff', margin:'0 auto 14px', boxShadow:'0 10px 30px rgba(251,146,60,0.55)' }}>
                {inicial}
              </div>
              <h3 style={{ fontSize:'18px', fontWeight:800, color:'#fff', marginBottom:'4px', letterSpacing:'-0.3px' }}>{profile?.full_name}</h3>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.50)', marginBottom:'20px' }}>{profile?.university ?? 'UPB'}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
                {[[posts.length,'Posts','#7C3AED'],[0,'Comun.','#2563EB'],[0,'Logros','#FB923C']].map(([n,l,c]) => (
                  <div key={l} style={{ padding:'12px 8px', borderRadius:'14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)' }}>
                    <p style={{ fontSize:'24px', fontWeight:900, color:c, lineHeight:1, letterSpacing:'-1px' }}>{n}</p>
                    <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.40)', marginTop:'3px', fontWeight:500 }}>{l}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'12px' }}>Toca para ver tu perfil →</p>
            </div>

            {/* Comunidades — clic navega a /community */}
            <div style={{ ...glass3d, padding:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <p style={{ fontSize:'12px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.40)', fontWeight:600 }}>Mis comunidades</p>
                <button onClick={() => navigate('/community')}
                  style={{ fontSize:'11px', color:'rgba(124,58,237,0.80)', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                  Ver todas →
                </button>
              </div>
              {[{n:'Afro UPB',c:'#7C3AED',m:'142 miembros'},{n:'Arte Afro',c:'#2563EB',m:'67 miembros'},{n:'Música Afro',c:'#FB923C',m:'89 miembros'}].map(com => (
                <div key={com.n}
                  onClick={() => navigate('/community')}     
                  style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'12px', marginBottom:'4px', cursor:'pointer', transition:'background .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:com.c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>{com.n[0]}</div>
                  <div>
                    <p style={{ fontSize:'14px', fontWeight:600, color:'rgba(255,255,255,0.88)', lineHeight:1 }}>{com.n}</p>
                    <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginTop:'2px' }}>{com.m}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Próximos eventos — clic navega a /events */}
            <div style={{ ...glass3d, padding:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <p style={{ fontSize:'12px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.40)', fontWeight:600 }}>Próximos eventos</p>
                <button onClick={() => navigate('/events')}     
                  style={{ fontSize:'11px', color:'rgba(251,146,60,0.80)', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                  Ver todos →
                </button>
              </div>
              {[
                { n:'Festival AfroDigital', d:'15 ago', c:'#7C3AED' },
                { n:'Noche de Currulao',    d:'25 jul', c:'#FB923C' },
              ].map(ev => (
                <div key={ev.n}
                  onClick={() => navigate('/events')}        
                  style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'12px', marginBottom:'4px', cursor:'pointer', transition:'background .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${ev.c}22`, border:`1px solid ${ev.c}40`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:900, color:ev.c, lineHeight:1 }}>{ev.d.split(' ')[0]}</p>
                    <p style={{ fontSize:'10px', color:`${ev.c}99`, lineHeight:1, marginTop:'1px', textTransform:'uppercase' }}>{ev.d.split(' ')[1]}</p>
                  </div>
                  <p style={{ fontSize:'13px', fontWeight:600, color:'rgba(255,255,255,0.80)', lineHeight:1.3 }}>{ev.n}</p>
                </div>
              ))}
            </div>

            {/* Reacciones culturales */}
            <div style={{ ...glass3d, padding:'20px' }}>
              <p style={{ fontSize:'12px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.40)', fontWeight:600, marginBottom:'14px' }}>Reacciones culturales</p>
              {[['👊🏿','Apoyo','rgba(124,58,237,0.20)'],['💜','Me representa','rgba(37,99,235,0.20)'],['🔥','Fuego','rgba(251,146,60,0.20)']].map(([em,lb,bg]) => (
                <div key={lb} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px', background:bg, border:'1px solid rgba(255,255,255,0.08)', marginBottom:'6px', cursor:'default' }}>
                  <span style={{ fontSize:'20px' }}>{em}</span>
                  <span style={{ fontSize:'14px', fontWeight:500, color:'rgba(255,255,255,0.75)' }}>{lb}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FEED PRINCIPAL */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Caja de publicar */}
            <div style={{ ...glass3dStrong, overflow:'hidden', transition:'all .3s' }}>
              {showForm
                ? <PostForm onSuccess={onPost} onCancel={() => setShowForm(false)} dark />
                : (
                  <div style={{ padding:'22px 26px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                      <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:800, color:'#fff', flexShrink:0 }}>
                        {inicial}
                      </div>
                      <button onClick={() => setShowForm(true)}
                        style={{ flex:1, textAlign:'left', padding:'14px 18px', borderRadius:'14px', fontSize:'16px', cursor:'pointer', transition:'all .2s', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.35)', fontFamily:'inherit' }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.40)'; e.currentTarget.style.color='rgba(255,255,255,0.60)'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}
                      >¿Qué quieres compartir con la comunidad hoy?</button>
                    </div>
                    <div style={{ display:'flex', gap:'8px', marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                      {[['📷','Foto'],['🎵','Audio'],['✍️','Historia'],['📍','Lugar']].map(([ic,lb]) => (
                        <button key={lb} onClick={() => setShowForm(true)}
                          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'all .2s', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', color:'rgba(255,255,255,0.50)', fontFamily:'inherit' }}
                          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,0.22)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.40)'; e.currentTarget.style.color='#A78BFA'; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.color='rgba(255,255,255,0.50)'; }}
                        >{ic} {lb}</button>
                      ))}
                    </div>
                  </div>
                )
              }
            </div>

            {/* Posts */}
            {posts.length > 0 ? posts.map((post, i) => (
              <div key={i} style={{ ...glass3d, padding:'26px 28px', transition:'all .3s cubic-bezier(0.34,1.56,0.64,1)', cursor:'default' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px) scale(1.01)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 8px rgba(0,0,0,0.25), 0 20px 50px rgba(0,0,0,0.50), 0 60px 100px rgba(0,0,0,0.30)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.35)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.20), 0 8px 24px rgba(0,0,0,0.35), 0 32px 64px rgba(0,0,0,0.30)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.13)'; }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                  <div
                    onClick={() => navigate('/profile')}      
                    style={{ width:'42px', height:'42px', borderRadius:'13px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:800, color:'#fff', cursor:'pointer' }}
                  >{inicial}</div>
                  <div>
                    <p style={{ fontSize:'15px', fontWeight:700, color:'rgba(255,255,255,0.95)' }}>{profile?.full_name}</p>
                    <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginTop:'1px' }}>ahora mismo</p>
                  </div>
                  {post.category && <span style={{ marginLeft:'auto', padding:'5px 13px', borderRadius:'20px', fontSize:'12px', fontWeight:600, background:'rgba(124,58,237,0.22)', color:'#A78BFA', border:'1px solid rgba(124,58,237,0.30)', textTransform:'capitalize' }}>{post.category}</span>}
                </div>
                <p style={{ fontSize:'17px', lineHeight:1.70, color:'rgba(255,255,255,0.78)' }}>{post.content}</p>
                <div style={{ display:'flex', gap:'8px', marginTop:'18px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  {[['👊🏿','Apoyo'],['💜','Me representa'],['🔥','Fuego']].map(([em,lb]) => (
                    <button key={lb}
                      style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:500, cursor:'pointer', transition:'all .2s', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', color:'rgba(255,255,255,0.50)', fontFamily:'inherit' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,0.22)'; e.currentTarget.style.color='#A78BFA'; e.currentTarget.style.borderColor='rgba(124,58,237,0.35)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.50)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}
                    >{em} {lb}</button>
                  ))}
                </div>
              </div>
            )) : (
              <div style={{ ...glass3d, padding:'72px 32px', textAlign:'center' }}>
                <span style={{ fontSize:'68px', display:'block', marginBottom:'20px', animation:'anim-float 5s ease-in-out infinite' }}>✊🏿</span>
                <h3 style={{ fontSize:'26px', fontWeight:800, color:'rgba(255,255,255,0.90)', marginBottom:'10px', letterSpacing:'-0.5px' }}>El feed espera sus primeras voces</h3>
                <p style={{ fontSize:'17px', color:'rgba(255,255,255,0.40)', maxWidth:'320px', margin:'0 auto 28px', lineHeight:1.65 }}>Comparte una historia, canción o testimonio de la comunidad afro.</p>
                <button onClick={() => setShowForm(true)}
                  style={{ padding:'15px 32px', borderRadius:'16px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', border:'none', color:'#fff', fontSize:'16px', fontWeight:700, cursor:'pointer', transition:'all .3s', boxShadow:'0 8px 32px rgba(124,58,237,0.55)', fontFamily:'inherit' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(124,58,237,0.65)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(124,58,237,0.55)'; }}
                >✦ Crear primera publicación</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.4);} }
        @keyframes anim-float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
      `}</style>
    </div>
  );
}