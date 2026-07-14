import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/shared/Sidebar';

const ALL_BADGES = [
  { key:'profile_complete', name:'Primer paso',       xp:50,  desc:'Completa todos tus datos de perfil',               icon:'✊🏿', color:'#7C3AED', how:'Llena universidad, municipio y bio en tu perfil', earned:true  },
  { key:'first_post',       name:'Voz propia',         xp:100, desc:'Publica tu primera historia en la comunidad',      icon:'✍️',  color:'#2563EB', how:'Crea tu primera publicación en el feed',           earned:false },
  { key:'ten_comments',     name:'Voz activa',         xp:150, desc:'Deja 10 comentarios en publicaciones',             icon:'💬',  color:'#0D9488', how:'Participa comentando en el feed',                  earned:false },
  { key:'cultural_content', name:'Aporte cultural',   xp:200, desc:'Comparte contenido de historia o música afro',     icon:'🌿',  color:'#059669', how:'Publica con categoría Historia o Música',          earned:false },
  { key:'event_streak_3',   name:'Racha de eventos',  xp:250, desc:'Asiste a 3 eventos culturales consecutivos',       icon:'🎭',  color:'#FB923C', how:'Confirma asistencia y asiste a 3 eventos',        earned:false },
  { key:'community_founder',name:'Fundadora',          xp:300, desc:'Crea una comunidad propia en la plataforma',       icon:'🏛️',  color:'#7C3AED', how:'Crea tu primera comunidad en Comunidades',        earned:false },
  { key:'fifty_reactions',  name:'Inspiradora',        xp:180, desc:'Recibe 50 reacciones en tus publicaciones',        icon:'💜',  color:'#EC4899', how:'Sigue publicando contenido que conecte',          earned:false },
  { key:'map_pin',          name:'Raíces visibles',    xp:80,  desc:'Pones tu municipio de origen en el mapa',          icon:'📍',  color:'#FB923C', how:'Agrega tu municipio de origen al perfil',         earned:true  },
];

const CHALLENGES = [
  { title:'Primera publicación',  desc:'Comparte algo con la comunidad hoy',     progress:0,  total:1,   xp:100, color:'#2563EB', icon:'✍️'  },
  { title:'Comenta 3 veces',      desc:'Participa en conversaciones del feed',   progress:0,  total:3,   xp:60,  color:'#0D9488', icon:'💬'  },
  { title:'Explora comunidades',  desc:'Únete a al menos 2 comunidades',          progress:1,  total:2,   xp:80,  color:'#7C3AED', icon:'👥'  },
  { title:'Asiste a un evento',   desc:'Confirma asistencia a tu primer evento', progress:0,  total:1,   xp:120, color:'#FB923C', icon:'🎭'  },
];

const LEADERBOARD = [
  { name:'Sofía Palacios',   xp:1240, rank:1, color:'#FB923C' },
  { name:'Diego Mosquera',   xp:980,  rank:2, color:'#A78BFA' },
  { name:'Valentina Córdoba',xp:860,  rank:3, color:'#60A5FA' },
  { name:'Carlos Angulo',    xp:720,  rank:4, color:'rgba(255,255,255,0.35)' },
  { name:'Tú',               xp:50,   rank:8, color:'#FCA87A', isMe:true },
];

const G = {
  background:'rgba(255,255,255,0.07)', backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
  border:'1px solid rgba(255,255,255,0.13)', borderTop:'1px solid rgba(255,255,255,0.22)',
  boxShadow:'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)',
};

export default function AchievementsView() {
  const { profile } = useAuth();
  const [tab, setTab] = useState('badges');

  const earned     = ALL_BADGES.filter(b => b.earned);
  const locked     = ALL_BADGES.filter(b => !b.earned);
  const totalXP    = earned.reduce((s,b)=>s+b.xp, 0);
  const maxXP      = ALL_BADGES.reduce((s,b)=>s+b.xp, 0);
  const pct        = Math.round((totalXP / maxXP) * 100);

  return (
    <div style={{ minHeight:'100vh', position:'relative', color:'#fff' }}>

      {/* FONDO */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:`
        radial-gradient(ellipse 70% 60% at 100% 0%,  rgba(251,146,60,0.55) 0%, transparent 55%),
        radial-gradient(ellipse 65% 65% at 0%  100%, rgba(124,58,237,0.60) 0%, transparent 55%),
        radial-gradient(ellipse 50% 50% at 50%  50%, rgba(5,150,105,0.15)  0%, transparent 55%),
        radial-gradient(ellipse 45% 45% at 0%  0%,  rgba(37,99,235,0.30)  0%, transparent 52%),
        linear-gradient(150deg, #0C0518 0%, #0A0415 35%, #100828 70%, #080212 100%)
      `}}/>

      <Sidebar active="/achievements" dark />

      <div style={{ marginLeft:'90px', padding:'40px 48px 60px', position:'relative', zIndex:1, maxWidth:'1100px' }}>

        {/* ── CABECERA ──────────────────────────────────────── */}
        <div style={{ marginBottom:'36px' }}>
          <p style={{ fontSize:'12px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', fontWeight:600, marginBottom:'6px' }}>AfroDigital UPB</p>
          <h1 style={{ fontSize:'64px', fontWeight:900, lineHeight:0.92, letterSpacing:'-3px' }}>
            <span style={{ background:'linear-gradient(135deg,#FCA87A,#A78BFA,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Log</span>
            <span style={{ color:'rgba(255,255,255,0.92)' }}>ros</span>
          </h1>
        </div>

        {/* ── HERO: XP + PROGRESO ───────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'28px' }}>

          {/* XP Total */}
          <div style={{ ...G, borderRadius:'24px', padding:'28px', position:'relative', overflow:'hidden', gridColumn:'span 2' }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:'#FB923C', filter:'blur(70px)', opacity:0.20 }}/>
            <div style={{ position:'absolute', bottom:'-30px', left:'40%', width:'150px', height:'150px', borderRadius:'50%', background:'#7C3AED', filter:'blur(60px)', opacity:0.20 }}/>
            <div style={{ position:'relative', zIndex:1 }}>
              <p style={{ fontSize:'13px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.40)', fontWeight:600, marginBottom:'6px' }}>Puntos XP</p>
              <p style={{ fontSize:'80px', fontWeight:900, lineHeight:1, letterSpacing:'-4px', background:'linear-gradient(135deg,#FCA87A,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {totalXP}
              </p>
              <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.40)', marginTop:'4px' }}>de {maxXP} XP posibles</p>

              {/* Barra de XP */}
              <div style={{ marginTop:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.40)' }}>Progreso total</span>
                  <span style={{ fontSize:'13px', color:'#FCA87A', fontWeight:700 }}>{pct}%</span>
                </div>
                <div style={{ height:'10px', borderRadius:'10px', background:'rgba(255,255,255,0.08)' }}>
                  <div style={{ height:'100%', borderRadius:'10px', background:'linear-gradient(90deg,#7C3AED,#FB923C)', width:`${pct}%`, transition:'width .8s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:'0 0 16px rgba(251,146,60,0.50)' }}/>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {[
              { n:earned.length,          l:'Insignias',  c:'#A78BFA' },
              { n:ALL_BADGES.length - earned.length, l:'Bloqueadas', c:'rgba(255,255,255,0.25)' },
              { n:CHALLENGES.filter(c=>c.progress>=c.total).length, l:'Retos completados', c:'#FCA87A' },
            ].map(s => (
              <div key={s.l} style={{ ...G, borderRadius:'16px', padding:'16px 18px', flex:1, display:'flex', alignItems:'center', gap:'12px' }}>
                <p style={{ fontSize:'36px', fontWeight:900, color:s.c, lineHeight:1, letterSpacing:'-1px' }}>{s.n}</p>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.40)', fontWeight:500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ──────────────────────────────────────────── */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'24px' }}>
          {[['badges','🏆 Insignias'], ['challenges','⚡ Retos activos'], ['leaderboard','🌟 Tabla de honor']].map(([k,l]) => (
            <button key={k} onClick={()=>setTab(k)}
              style={{ padding:'10px 20px', borderRadius:'12px', fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s', border:'1px solid', fontFamily:'inherit',
                background: tab===k ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.06)',
                color:      tab===k ? '#A78BFA'                : 'rgba(255,255,255,0.45)',
                borderColor:tab===k ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.10)',
              }}
            >{l}</button>
          ))}
        </div>

        {/* ── TAB: INSIGNIAS ────────────────────────────────── */}
        {tab === 'badges' && (
          <div>
            {/* Obtenidas */}
            {earned.length > 0 && (
              <div style={{ marginBottom:'28px' }}>
                <p style={{ fontSize:'13px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', fontWeight:600, marginBottom:'14px' }}>Obtenidas · {earned.length}</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'14px' }}>
                  {earned.map(b => (
                    <div key={b.key} style={{ ...G, borderRadius:'20px', padding:'22px', position:'relative', overflow:'hidden', transition:'all .3s cubic-bezier(0.34,1.56,0.64,1)', border:`1px solid ${b.color}30`, borderTop:`1px solid ${b.color}50` }}
                      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow=`inset 0 1px 0 ${b.color}40, 0 8px 24px rgba(0,0,0,0.35), 0 40px 80px ${b.color}25`; }}
                      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)'; }}
                    >
                      <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:b.color, filter:'blur(50px)', opacity:0.30 }}/>
                      <div style={{ position:'relative', zIndex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
                          <span style={{ fontSize:'40px', lineHeight:1 }}>{b.icon}</span>
                          <span style={{ fontSize:'11px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background:`${b.color}25`, color:b.color }}>+{b.xp} XP</span>
                        </div>
                        <h4 style={{ fontSize:'17px', fontWeight:800, color:'rgba(255,255,255,0.95)', marginBottom:'5px', letterSpacing:'-0.3px' }}>{b.name}</h4>
                        <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)', lineHeight:1.5 }}>{b.desc}</p>
                        <div style={{ marginTop:'14px', display:'flex', alignItems:'center', gap:'6px' }}>
                          <span style={{ fontSize:'12px', color:b.color, fontWeight:700 }}>✓ Obtenida</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloqueadas */}
            <p style={{ fontSize:'13px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', fontWeight:600, marginBottom:'14px' }}>Por desbloquear · {locked.length}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'14px' }}>
              {locked.map(b => (
                <div key={b.key} style={{ ...G, borderRadius:'20px', padding:'22px', filter:'grayscale(0.7)', opacity:0.55, transition:'all .25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.filter='grayscale(0)'; e.currentTarget.style.opacity='0.85'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.filter='grayscale(0.7)'; e.currentTarget.style.opacity='0.55'; e.currentTarget.style.transform='translateY(0)'; }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
                    <span style={{ fontSize:'40px', lineHeight:1 }}>{b.icon}</span>
                    <span style={{ fontSize:'14px' }}>🔒</span>
                  </div>
                  <h4 style={{ fontSize:'17px', fontWeight:800, color:'rgba(255,255,255,0.70)', marginBottom:'5px' }}>{b.name}</h4>
                  <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', lineHeight:1.5, marginBottom:'10px' }}>{b.desc}</p>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.30)', fontStyle:'italic' }}>→ {b.how}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: RETOS ────────────────────────────────────── */}
        {tab === 'challenges' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
            {CHALLENGES.map((ch, i) => {
              const done = ch.progress >= ch.total;
              const pct  = Math.round((ch.progress / ch.total) * 100);
              return (
                <div key={i} style={{ ...G, borderRadius:'22px', padding:'26px', border:done?`1px solid ${ch.color}40`:'1px solid rgba(255,255,255,0.13)', borderTop:done?`1px solid ${ch.color}60`:'1px solid rgba(255,255,255,0.22)', transition:'all .3s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(0,0,0,0.35), 0 32px 64px ${ch.color}20`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)'; }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
                    <span style={{ fontSize:'32px' }}>{ch.icon}</span>
                    <span style={{ fontSize:'13px', fontWeight:700, padding:'5px 12px', borderRadius:'10px', background:`${ch.color}22`, color:ch.color }}>+{ch.xp} XP</span>
                  </div>
                  <h4 style={{ fontSize:'18px', fontWeight:800, color:done?ch.color:'rgba(255,255,255,0.95)', marginBottom:'6px' }}>{ch.title}</h4>
                  <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.45)', lineHeight:1.5, marginBottom:'18px' }}>{ch.desc}</p>

                  <div style={{ marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                      <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)' }}>{ch.progress} / {ch.total}</span>
                      <span style={{ fontSize:'12px', color:done?ch.color:'rgba(255,255,255,0.35)', fontWeight:600 }}>{done?'✓ Completado':pct+'%'}</span>
                    </div>
                    <div style={{ height:'8px', borderRadius:'8px', background:'rgba(255,255,255,0.08)' }}>
                      <div style={{ height:'100%', borderRadius:'8px', background:`linear-gradient(90deg,${ch.color},${ch.color}AA)`, width:`${pct}%`, transition:'width .6s', boxShadow:done?`0 0 12px ${ch.color}88`:'none' }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: LEADERBOARD ──────────────────────────────── */}
        {tab === 'leaderboard' && (
          <div style={{ maxWidth:'560px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {LEADERBOARD.map((u, i) => (
                <div key={i} style={{ ...G, borderRadius:'18px', padding:'18px 22px', display:'flex', alignItems:'center', gap:'16px',
                  background: u.isMe ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.07)',
                  border: u.isMe ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(255,255,255,0.13)',
                  transition:'all .3s' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateX(4px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateX(0)'}
                >
                  <div style={{ width:'36px', textAlign:'center' }}>
                    {u.rank <= 3
                      ? <span style={{ fontSize:'24px' }}>{['🥇','🥈','🥉'][u.rank-1]}</span>
                      : <span style={{ fontSize:'18px', fontWeight:700, color:'rgba(255,255,255,0.35)' }}>#{u.rank}</span>
                    }
                  </div>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:u.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:800, color: u.isMe?'#fff':'rgba(15,5,32,0.80)' }}>
                    {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'16px', fontWeight:700, color: u.isMe?'#A78BFA':'rgba(255,255,255,0.90)', lineHeight:1 }}>
                      {u.name} {u.isMe && <span style={{ fontSize:'12px', fontWeight:500, color:'#A78BFA', marginLeft:'6px' }}>← tú</span>}
                    </p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:'22px', fontWeight:900, color:u.rank<=3?['#FB923C','rgba(167,139,250,0.80)','rgba(96,165,250,0.80)'][u.rank-1]:'rgba(255,255,255,0.50)', lineHeight:1, letterSpacing:'-1px' }}>{u.xp}</p>
                    <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.30)', marginTop:'2px' }}>XP</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.25)', marginTop:'20px', textAlign:'center', fontStyle:'italic' }}>
              Tabla actualizada semanalmente · Gana XP publicando y participando
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
