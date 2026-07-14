import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiClient';

/* ══ DATOS DE INSIGNIAS ══════════════════════════════════════ */
const ALL_BADGES = [
  { key:'profile_complete', name:'Perfil completo',    desc:'Completaste todos tus datos de perfil',          icon:'✊🏿', color:'#7C3AED', bg:'rgba(124,58,237,0.15)'  },
  { key:'first_post',       name:'Primer paso',        desc:'Publicaste tu primera historia en la comunidad', icon:'✍️',  color:'#2563EB', bg:'rgba(37,99,235,0.15)'   },
  { key:'ten_comments',     name:'Voz activa',         desc:'Dejaste 10 comentarios en la plataforma',       icon:'💬',  color:'#0D9488', bg:'rgba(13,148,136,0.15)'  },
  { key:'cultural_content', name:'Aporte cultural',    desc:'Compartiste contenido de historia o música',    icon:'🌿',  color:'#059669', bg:'rgba(5,150,105,0.15)'   },
  { key:'event_streak_3',   name:'Racha de eventos',   desc:'Asististe a 3 eventos culturales seguidos',     icon:'🎭',  color:'#FB923C', bg:'rgba(251,146,60,0.15)'  },
];

/* ══ ICONOS SVG ══════════════════════════════════════════════ */
const Ico = ({ d, s=20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const NAV = [
  { d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",                                                              label:'Feed',        href:'/feed'         },
  { d:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", label:'Comunidades', href:'/community'    },
  { d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",                                  label:'Eventos',     href:'/events'       },
  { d:"M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z",                    label:'Mapa',        href:'/map'          },
  { d:"M8 21h8m-4-4v4M5 3h14l-1 7H6L5 3z M5 10c0 3 3.1 5.5 7 5.5s7-2.5 7-5.5",                                                   label:'Logros',      href:'/achievements' },
];

/* ══ ESTILOS ═════════════════════════════════════════════════ */
const card = {
  background: 'rgba(255,255,255,0.80)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  border: '1px solid rgba(255,255,255,0.94)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.07)',
  borderRadius: '28px',
};
const inp = {
  width:'100%', padding:'13px 16px', borderRadius:'14px', fontSize:'16px',
  border:'1.5px solid rgba(124,58,237,0.18)', outline:'none', transition:'all .2s',
  background:'rgba(250,245,235,0.60)', color:'#1A1523', fontFamily:'inherit',
};

export default function ProfileView() {
  const { profile, user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState('posts');
  const [posts,    setPosts]    = useState([]);
  const [earned,   setEarned]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({});
  const [navPage,  setNavPage]  = useState('/feed');

  const inicial = profile?.full_name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() ?? '?';

  /* Cargar datos del perfil */
  useEffect(() => {
    if (!user) return;
    setForm({
      full_name:            profile?.full_name ?? '',
      bio:                  profile?.bio ?? '',
      university:           profile?.university ?? '',
      origin_municipality:  profile?.origin_municipality ?? '',
    });
    const load = async () => {
      try {
        const [p, b] = await Promise.all([
          api.get('/posts').catch(() => []),
          api.get('/badges').catch(() => []),
        ]);
        /* Filtramos posts del usuario actual */
        setPosts((p || []).filter(x => x.author?.id === user.id || x.author_id === user.id));
        /* Simulamos 1 insignia ganada hasta tener endpoint real */
        setEarned(['profile_complete']);
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, [user, profile]);

  const handleSave = async () => {
    setSaving(true);
    try { await updateProfile(form); setEditing(false); }
    catch (_) {}
    finally { setSaving(false); }
  };

  const foc = e => { e.target.style.borderColor='#7C3AED'; e.target.style.boxShadow='0 0 0 4px rgba(124,58,237,0.10)'; e.target.style.background='rgba(255,255,255,0.95)'; };
  const blu = e => { e.target.style.borderColor='rgba(124,58,237,0.18)'; e.target.style.boxShadow='none'; e.target.style.background='rgba(250,245,235,0.60)'; };

  return (
    <div className="page-bg" style={{ display:'flex' }}>

      {/* ══ SIDEBAR (idéntico al FeedView) ══════════════════════ */}
      <aside style={{
        width:'90px', position:'fixed', top:0, left:0, height:'100vh', zIndex:50,
        display:'flex', flexDirection:'column', alignItems:'center', padding:'28px 0',
        background:'rgba(250,250,248,0.90)', backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
        borderRight:'1px solid rgba(124,58,237,0.10)', boxShadow:'4px 0 32px rgba(0,0,0,0.04)',
      }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'18px', background:'linear-gradient(135deg,#7C3AED,#4F46E5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', marginBottom:'36px', boxShadow:'0 8px 24px rgba(124,58,237,0.38)' }}>✊🏿</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'4px', width:'100%', paddingInline:'14px' }}>
          {NAV.map(item => {
            const on = navPage === item.href;
            return (
              <button key={item.href} onClick={() => { setNavPage(item.href); navigate(item.href); }} title={item.label}
                style={{ width:'100%', aspectRatio:'1', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', transition:'all .2s', position:'relative', background:on?'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.12))':'transparent', color:on?'#7C3AED':'rgba(61,53,83,0.38)', boxShadow:on?'0 4px 16px rgba(124,58,237,0.18), inset 0 0 0 1px rgba(124,58,237,0.20)':'none' }}
                onMouseEnter={e=>{ if(!on){ e.currentTarget.style.background='rgba(124,58,237,0.07)'; e.currentTarget.style.color='#3D3553'; }}}
                onMouseLeave={e=>{ if(!on){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(61,53,83,0.38)'; }}}
              >
                <Ico d={item.d}/>
                {on && <span style={{ position:'absolute', left:'-14px', top:'50%', transform:'translateY(-50%)', width:'4px', height:'32px', borderRadius:'0 4px 4px 0', background:'#7C3AED' }}/>}
              </button>
            );
          })}
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ width:'40px', height:'1px', background:'rgba(124,58,237,0.12)', marginBottom:'16px' }}/>
        <div onClick={logout} title="Cerrar sesión"
          style={{ width:'48px', height:'48px', borderRadius:'16px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:800, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(251,146,60,0.38)', transition:'all .2s' }}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
        >{inicial}</div>
      </aside>

      {/* ══ CONTENIDO PRINCIPAL ══════════════════════════════════ */}
      <main style={{ marginLeft:'90px', flex:1, padding:'40px 52px 60px', maxWidth:'920px' }}>

        {/* ── COVER + AVATAR ─────────────────────────────────── */}
        <div style={{ ...card, overflow:'hidden', marginBottom:'24px' }} className="anim-up">

          {/* Cover banner */}
          <div style={{
            height:'200px', position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg, #3B0764 0%, #1D4ED8 45%, #FB923C 100%)',
          }}>
            {/* Elementos decorativos en el cover */}
            <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)' }}/>
            <div style={{ position:'absolute', bottom:'-40px', left:'20%', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(251,146,60,0.15)', border:'1px solid rgba(251,146,60,0.20)' }}/>
            <div style={{ position:'absolute', top:'20px', left:'40%', width:'8px', height:'8px', borderRadius:'50%', background:'rgba(255,255,255,0.60)', boxShadow:'0 0 20px 6px rgba(255,255,255,0.25)' }}/>
            <div style={{ position:'absolute', top:'60px', right:'25%', width:'5px', height:'5px', borderRadius:'50%', background:'rgba(251,146,60,0.90)', boxShadow:'0 0 16px 5px rgba(251,146,60,0.40)' }}/>

            {/* Etiqueta de rol */}
            <div style={{ position:'absolute', top:'20px', right:'24px', padding:'6px 16px', borderRadius:'20px', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.25)', fontSize:'12px', fontWeight:700, color:'#fff', letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {profile?.role ?? 'student'}
            </div>

            {/* Botón editar */}
            <button onClick={() => setEditing(!editing)}
              style={{ position:'absolute', top:'20px', left:'24px', padding:'7px 18px', borderRadius:'20px', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.25)', fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer', transition:'all .2s', display:'flex', alignItems:'center', gap:'6px', fontFamily:'inherit' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            >
              <Ico d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" s={14}/>
              {editing ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>

          {/* Avatar + info principal */}
          <div style={{ padding:'0 36px 32px' }}>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'-48px', marginBottom:'20px', flexWrap:'wrap', gap:'16px' }}>

              {/* Avatar grande */}
              <div style={{ width:'96px', height:'96px', borderRadius:'28px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', fontWeight:900, color:'#fff', border:'4px solid #fff', boxShadow:'0 8px 32px rgba(251,146,60,0.45)', flexShrink:0 }}>
                {inicial}
              </div>

              {/* Acciones */}
              {!editing && (
                <button onClick={() => navigate('/feed')}
                  style={{ padding:'10px 22px', borderRadius:'14px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', border:'none', color:'#fff', fontSize:'14px', fontWeight:700, cursor:'pointer', boxShadow:'0 6px 20px rgba(124,58,237,0.32)', transition:'all .2s', fontFamily:'inherit', marginTop:'52px' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(124,58,237,0.45)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(124,58,237,0.32)'; }}
                >← Volver al feed</button>
              )}
            </div>

            {/* Nombre e info */}
            {editing ? (
              /* ── MODO EDICIÓN ───────────────────────── */
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#9187A4', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>Nombre completo</label>
                  <input value={form.full_name ?? ''} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} placeholder="Tu nombre completo" style={inp} onFocus={foc} onBlur={blu}/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#9187A4', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>Universidad</label>
                  <input value={form.university ?? ''} onChange={e=>setForm(f=>({...f,university:e.target.value}))} placeholder="Ej. UPB" style={inp} onFocus={foc} onBlur={blu}/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#9187A4', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>Municipio de origen</label>
                  <input value={form.origin_municipality ?? ''} onChange={e=>setForm(f=>({...f,origin_municipality:e.target.value}))} placeholder="Ej. Quibdó, Chocó" style={inp} onFocus={foc} onBlur={blu}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#9187A4', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>Biografía</label>
                  <textarea value={form.bio ?? ''} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Cuéntale a la comunidad quién eres..." rows={3}
                    style={{ ...inp, resize:'none' }} onFocus={foc} onBlur={blu}/>
                </div>
                <div style={{ gridColumn:'1/-1', display:'flex', gap:'10px', justifyContent:'flex-end', paddingTop:'8px' }}>
                  <button onClick={()=>setEditing(false)} style={{ padding:'11px 22px', borderRadius:'14px', background:'transparent', border:'1.5px solid rgba(124,58,237,0.20)', color:'#9187A4', fontSize:'15px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}>Cancelar</button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ padding:'11px 28px', borderRadius:'14px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:saving?'not-allowed':'pointer', opacity:saving?.65:1, boxShadow:'0 6px 20px rgba(124,58,237,0.30)', fontFamily:'inherit' }}
                  >{saving ? 'Guardando...' : 'Guardar cambios'}</button>
                </div>
              </div>
            ) : (
              /* ── MODO VISTA ─────────────────────────── */
              <div>
                <h1 style={{ fontSize:'44px', fontWeight:900, letterSpacing:'-2px', color:'#1A1523', lineHeight:1, marginBottom:'8px' }}>
                  {profile?.full_name ?? 'Tu nombre'}
                </h1>

                {/* Meta-datos */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'18px', alignItems:'center' }}>
                  {profile?.university && (
                    <span style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'15px', color:'#9187A4', fontWeight:500 }}>
                      <Ico d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" s={16}/>
                      {profile.university}
                    </span>
                  )}
                  {profile?.origin_municipality && (
                    <span style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'15px', color:'#9187A4', fontWeight:500 }}>
                      <Ico d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z" s={16}/>
                      {profile.origin_municipality}
                    </span>
                  )}
                  <span style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'15px', color:'#9187A4', fontWeight:500 }}>
                    <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" s={16}/>
                    Miembro desde {new Date(user?.created_at ?? Date.now()).toLocaleDateString('es-CO',{month:'long',year:'numeric'})}
                  </span>
                </div>

                {/* Bio */}
                {profile?.bio
                  ? <p style={{ fontSize:'17px', color:'#3D3553', lineHeight:1.7, maxWidth:'600px', fontStyle:'italic', borderLeft:'3px solid rgba(124,58,237,0.30)', paddingLeft:'16px' }}>{profile.bio}</p>
                  : <p style={{ fontSize:'15px', color:'rgba(145,135,164,0.60)', fontStyle:'italic', cursor:'pointer' }} onClick={()=>setEditing(true)}>
                      + Agrega una biografía para que la comunidad te conozca...
                    </p>
                }
              </div>
            )}
          </div>
        </div>

        {/* ── ESTADÍSTICAS ───────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }} className="anim-up delay-1">
          {[
            { n:posts.length,  l:'Publicaciones', c:'#7C3AED', bg:'rgba(124,58,237,0.09)', icon:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
            { n:0,             l:'Comunidades',   c:'#2563EB', bg:'rgba(37,99,235,0.09)',  icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z' },
            { n:earned.length, l:'Insignias',     c:'#FB923C', bg:'rgba(251,146,60,0.09)', icon:'M8 21h8m-4-4v4M5 3h14l-1 7H6L5 3z' },
            { n:0,             l:'Eventos',       c:'#0D9488', bg:'rgba(13,148,136,0.09)', icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          ].map(s => (
            <div key={s.l} style={{ ...card, padding:'22px 20px', display:'flex', flexDirection:'column', gap:'12px', transition:'all .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.10)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.07)'; }}
            >
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', color:s.c }}>
                <Ico d={s.icon} s={20}/>
              </div>
              <div>
                <p style={{ fontSize:'40px', fontWeight:900, color:s.c, lineHeight:1, letterSpacing:'-2px' }}>{s.n}</p>
                <p style={{ fontSize:'13px', color:'#9187A4', marginTop:'4px', fontWeight:600 }}>{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ───────────────────────────────────────────── */}
        <div style={{ ...card, overflow:'hidden' }} className="anim-up delay-2">

          {/* Tab bar */}
          <div style={{ display:'flex', borderBottom:'1px solid rgba(124,58,237,0.10)', padding:'0 28px' }}>
            {[['posts','✍️ Publicaciones'],['badges','🏆 Insignias']].map(([k,l]) => (
              <button key={k} onClick={()=>setTab(k)}
                style={{ padding:'18px 20px', fontSize:'15px', fontWeight:700, border:'none', background:'transparent', cursor:'pointer', transition:'all .2s', fontFamily:'inherit', color:tab===k?'#7C3AED':'#9187A4', borderBottom:tab===k?'3px solid #7C3AED':'3px solid transparent', marginBottom:'-1px' }}
              >{l}</button>
            ))}
          </div>

          {/* ── TAB: PUBLICACIONES ─────────────────────────── */}
          {tab === 'posts' && (
            <div style={{ padding:'28px' }}>
              {loading ? (
                <div style={{ textAlign:'center', padding:'48px', color:'#9187A4', fontSize:'16px' }}>Cargando publicaciones...</div>
              ) : posts.length === 0 ? (
                <div style={{ textAlign:'center', padding:'64px 32px' }}>
                  <span style={{ fontSize:'56px', display:'block', marginBottom:'16px' }}>✍️</span>
                  <h3 style={{ fontSize:'22px', fontWeight:700, color:'#1A1523', marginBottom:'8px' }}>Aún no has publicado</h3>
                  <p style={{ fontSize:'16px', color:'#9187A4', marginBottom:'24px', lineHeight:1.6 }}>
                    Comparte tu primera historia, testimonio o canción con la comunidad.
                  </p>
                  <button onClick={()=>navigate('/feed')}
                    style={{ padding:'13px 28px', borderRadius:'16px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer', boxShadow:'0 6px 24px rgba(124,58,237,0.30)', fontFamily:'inherit', transition:'all .2s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 32px rgba(124,58,237,0.42)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(124,58,237,0.30)'; }}
                  >✦ Ir al feed a publicar</button>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  {posts.map((post, i) => (
                    <div key={i} style={{ padding:'22px 24px', borderRadius:'20px', background:'rgba(250,245,235,0.60)', border:'1px solid rgba(124,58,237,0.10)', transition:'all .2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background='rgba(237,233,254,0.40)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.25)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background='rgba(250,245,235,0.60)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.10)'; }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                        {post.category && <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:600, background:'rgba(124,58,237,0.10)', color:'#7C3AED', border:'1px solid rgba(124,58,237,0.18)', textTransform:'capitalize' }}>{post.category}</span>}
                        <span style={{ fontSize:'13px', color:'#9187A4', marginLeft:'auto' }}>{new Date(post.created_at).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'})}</span>
                      </div>
                      <p style={{ fontSize:'17px', lineHeight:1.70, color:'#3D3553' }}>{post.content}</p>
                      {/* Reacciones */}
                      <div style={{ display:'flex', gap:'8px', marginTop:'14px', paddingTop:'12px', borderTop:'1px solid rgba(124,58,237,0.08)' }}>
                        {(post.reactions ?? []).length > 0
                          ? post.reactions.map((r,j) => <span key={j} style={{ fontSize:'15px' }}>{r.type==='apoyo'?'👊🏿':r.type==='me_representa'?'💜':'🔥'}</span>)
                          : <span style={{ fontSize:'13px', color:'rgba(145,135,164,0.55)', fontStyle:'italic' }}>Sin reacciones aún</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: INSIGNIAS ─────────────────────────────── */}
          {tab === 'badges' && (
            <div style={{ padding:'28px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
                {ALL_BADGES.map(badge => {
                  const isEarned = earned.includes(badge.key);
                  return (
                    <div key={badge.key}
                      style={{
                        padding:'24px', borderRadius:'20px', position:'relative', overflow:'hidden', transition:'all .25s',
                        background: isEarned ? badge.bg : 'rgba(243,244,246,0.80)',
                        border: isEarned ? `1px solid ${badge.color}30` : '1px solid rgba(0,0,0,0.06)',
                        filter: isEarned ? 'none' : 'grayscale(1)',
                        opacity: isEarned ? 1 : 0.55,
                      }}
                      onMouseEnter={e=>{ if(isEarned){ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${badge.color}25`; }}}
                      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                    >
                      {/* Glow decorativo */}
                      {isEarned && (
                        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'100px', height:'100px', borderRadius:'50%', background:badge.color, filter:'blur(40px)', opacity:0.25 }}/>
                      )}

                      <div style={{ position:'relative', zIndex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                          <span style={{ fontSize:'36px', lineHeight:1 }}>{badge.icon}</span>
                          {isEarned
                            ? <span style={{ padding:'4px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:700, background:`${badge.color}20`, color:badge.color, border:`1px solid ${badge.color}30` }}>Obtenida ✓</span>
                            : <span style={{ padding:'4px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:600, background:'rgba(0,0,0,0.06)', color:'#9CA3AF' }}>🔒 Bloqueada</span>
                          }
                        </div>
                        <h4 style={{ fontSize:'17px', fontWeight:800, color: isEarned ? '#1A1523' : '#6B7280', marginBottom:'5px', letterSpacing:'-0.3px' }}>{badge.name}</h4>
                        <p style={{ fontSize:'14px', color: isEarned ? '#3D3553' : '#9CA3AF', lineHeight:1.5 }}>{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progreso */}
              <div style={{ marginTop:'24px', padding:'20px 24px', borderRadius:'20px', background:'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(37,99,235,0.06))', border:'1px solid rgba(124,58,237,0.14)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <p style={{ fontSize:'15px', fontWeight:700, color:'#1A1523' }}>Progreso de insignias</p>
                  <p style={{ fontSize:'15px', fontWeight:700, color:'#7C3AED' }}>{earned.length} / {ALL_BADGES.length}</p>
                </div>
                <div style={{ height:'8px', borderRadius:'8px', background:'rgba(124,58,237,0.12)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:'8px', background:'linear-gradient(90deg,#7C3AED,#2563EB)', width:`${(earned.length/ALL_BADGES.length)*100}%`, transition:'width .6s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:'0 0 12px rgba(124,58,237,0.40)' }}/>
                </div>
                <p style={{ fontSize:'13px', color:'#9187A4', marginTop:'8px' }}>
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
