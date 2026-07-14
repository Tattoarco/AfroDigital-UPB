import { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';

const EVENTS = [
  { id:1, title:'Festival AfroDigital 2026',  date:'2026-08-15', time:'18:00', location:'Campus UPB — Bloque Central', community:'Afro UPB',          attendees:45,  cap:200, color:'#7C3AED', tag:'Festival',   desc:'El encuentro más grande de la comunidad afro universitaria. Música, arte, gastronomía y tecnología en un solo lugar.', featured:true,  rsvp:false },
  { id:2, title:'Noche de Currulao',          date:'2026-07-25', time:'20:00', location:'Teatro Pablo Tobón Uribe',     community:'Música Afro',         attendees:120, cap:150, color:'#FB923C', tag:'Música',     desc:'Una noche de tambores, cantos ancestrales y danza del Pacífico colombiano.',                                          featured:false, rsvp:true  },
  { id:3, title:'Exposición Arte Afro',       date:'2026-07-30', time:'10:00', location:'Centro Cultural de Medellín',  community:'Arte Afro Medellín',  attendees:67,  cap:100, color:'#2563EB', tag:'Arte',       desc:'Muestra colectiva de artistas afrocolombianos que habitamos la ciudad. Entrada libre.',                                featured:false, rsvp:false },
  { id:4, title:'Taller Gastronomía Afro',    date:'2026-08-05', time:'14:00', location:'UPB — Laboratorio Culinario', community:'Cocina Tradicional',  attendees:28,  cap:30,  color:'#0D9488', tag:'Taller',     desc:'Aprende a preparar sancocho de guineo, arroz con coco y pusandao con maestras del Chocó.',                            featured:false, rsvp:false },
  { id:5, title:'Conversatorio: Identidad',   date:'2026-08-12', time:'16:00', location:'UPB — Sala de Reuniones 3',   community:'Afro UPB',            attendees:35,  cap:60,  color:'#7C3AED', tag:'Académico',  desc:'Espacio de reflexión sobre identidad afro en contextos universitarios. Panelistas invitados de 4 ciudades.',           featured:false, rsvp:true  },
];

const G = {
  background:'rgba(255,255,255,0.07)', backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
  border:'1px solid rgba(255,255,255,0.13)', borderTop:'1px solid rgba(255,255,255,0.22)',
  boxShadow:'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)',
};

function fmtDate(d) {
  return new Date(d).toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}
function daysLeft(d) {
  const diff = new Date(d) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function EventsView() {
  const [events, setEvents] = useState(EVENTS);
  const [tab,    setTab]    = useState('upcoming');

  const featured  = events.find(e => e.featured);
  const upcoming  = events.filter(e => new Date(e.date) >= new Date());
  const myEvents  = events.filter(e => e.rsvp);

  const list = tab === 'upcoming' ? upcoming : tab === 'mine' ? myEvents : events;

  const toggleRSVP = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, rsvp: !e.rsvp, attendees: e.rsvp ? e.attendees-1 : e.attendees+1 } : e));
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', color:'#fff' }}>

      {/* FONDO */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:`
        radial-gradient(ellipse 65% 55% at 0%  0%,  rgba(251,146,60,0.50) 0%, transparent 55%),
        radial-gradient(ellipse 65% 65% at 100% 100%,rgba(124,58,237,0.55) 0%, transparent 55%),
        radial-gradient(ellipse 50% 50% at 100% 0%,  rgba(37,99,235,0.30)  0%, transparent 52%),
        radial-gradient(ellipse 40% 40% at 30%  80%, rgba(251,146,60,0.20) 0%, transparent 45%),
        linear-gradient(150deg, #1A0A08 0%, #0C0415 35%, #120828 70%, #080212 100%)
      `}}/>

      <Sidebar active="/events" dark />

      <div style={{ marginLeft:'90px', padding:'40px 48px 60px', position:'relative', zIndex:1 }}>

        {/* ── CABECERA ──────────────────────────────────────── */}
        <div style={{ marginBottom:'36px' }}>
          <p style={{ fontSize:'12px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', fontWeight:600, marginBottom:'6px' }}>AfroDigital UPB</p>
          <h1 style={{ fontSize:'64px', fontWeight:900, lineHeight:0.92, letterSpacing:'-3px' }}>
            <span style={{ background:'linear-gradient(135deg,#FCA87A,#F97316,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Even</span>
            <span style={{ color:'rgba(255,255,255,0.92)' }}>tos</span>
          </h1>
        </div>

        {/* ── EVENTO DESTACADO ──────────────────────────────── */}
        {featured && (
          <div style={{ ...G, borderRadius:'28px', overflow:'hidden', marginBottom:'32px', position:'relative', transition:'all .3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(0,0,0,0.40), 0 48px 96px ${featured.color}30`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)'; }}
          >
            {/* Banner de color */}
            <div style={{ height:'240px', position:'relative', overflow:'hidden', background:`linear-gradient(135deg, ${featured.color}CC 0%, #080212 100%)` }}>
              {/* Decoración */}
              <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:featured.color, filter:'blur(100px)', opacity:0.25 }}/>
              <div style={{ position:'absolute', bottom:'-40px', left:'30%', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.10)' }}/>

              {/* Badges */}
              <div style={{ position:'absolute', top:'20px', left:'24px', display:'flex', gap:'8px' }}>
                <span style={{ padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:700, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.22)', color:'#fff', textTransform:'uppercase', letterSpacing:'0.08em' }}>⭐ Destacado</span>
                <span style={{ padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:700, background:`${featured.color}40`, border:`1px solid ${featured.color}60`, color:'#fff' }}>{featured.tag}</span>
              </div>

              {/* Cuenta regresiva */}
              <div style={{ position:'absolute', top:'20px', right:'24px', padding:'8px 16px', borderRadius:'14px', background:'rgba(0,0,0,0.40)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.15)', textAlign:'center' }}>
                <p style={{ fontSize:'28px', fontWeight:900, color:'#fff', lineHeight:1 }}>{daysLeft(featured.date)}</p>
                <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)', fontWeight:600, marginTop:'2px' }}>días restantes</p>
              </div>

              {/* Título en el banner */}
              <div style={{ position:'absolute', bottom:'24px', left:'28px', right:'120px' }}>
                <h2 style={{ fontSize:'32px', fontWeight:900, color:'#fff', letterSpacing:'-1px', lineHeight:1.1, textShadow:'0 2px 20px rgba(0,0,0,0.50)' }}>{featured.title}</h2>
              </div>
            </div>

            {/* Contenido */}
            <div style={{ padding:'24px 28px' }}>
              <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.60)', lineHeight:1.65, marginBottom:'20px', maxWidth:'680px' }}>{featured.desc}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
                <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
                  {[
                    ['📅', fmtDate(featured.date)],
                    ['🕐', featured.time + ' hrs'],
                    ['📍', featured.location],
                    ['👥', `${featured.attendees} confirmados`],
                  ].map(([ic, txt]) => (
                    <div key={txt} style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                      <span style={{ fontSize:'16px' }}>{ic}</span>
                      <span style={{ fontSize:'14px', color:'rgba(255,255,255,0.55)', fontWeight:500 }}>{txt}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>toggleRSVP(featured.id)}
                  style={{ padding:'13px 28px', borderRadius:'16px', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer', transition:'all .3s', fontFamily:'inherit',
                    background: featured.rsvp ? 'rgba(255,255,255,0.12)' : `linear-gradient(135deg,${featured.color},#4F46E5)`,
                    boxShadow:  featured.rsvp ? 'none' : `0 8px 28px ${featured.color}55`,
                  }}
                  onMouseEnter={e=>{ if(!featured.rsvp) e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; }}
                >
                  {featured.rsvp ? '✓ Confirmada' : '✦ Confirmar asistencia'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TABS ──────────────────────────────────────────── */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'24px' }}>
          {[['upcoming',`Próximos · ${upcoming.length}`], ['mine',`Mis eventos · ${myEvents.length}`], ['all','Todos']].map(([k,l]) => (
            <button key={k} onClick={()=>setTab(k)}
              style={{ padding:'10px 20px', borderRadius:'12px', fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s', border:'1px solid', fontFamily:'inherit',
                background: tab===k ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.06)',
                color:      tab===k ? '#A78BFA'                : 'rgba(255,255,255,0.45)',
                borderColor:tab===k ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.10)',
              }}
            >{l}</button>
          ))}
        </div>

        {/* ── LISTA DE EVENTOS ──────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'18px' }}>
          {list.filter(e=>!e.featured).map(ev => {
            const pct = Math.round((ev.attendees / ev.cap) * 100);
            return (
              <div key={ev.id} style={{ ...G, borderRadius:'24px', overflow:'hidden', transition:'all .3s cubic-bezier(0.34,1.56,0.64,1)' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-8px) scale(1.01)'; e.currentTarget.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,0.20), 0 8px 24px rgba(0,0,0,0.40), 0 40px 80px ${ev.color}20`; e.currentTarget.style.borderColor=`${ev.color}40`; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.13)'; }}
              >
                {/* Color bar */}
                <div style={{ height:'5px', background:`linear-gradient(90deg,${ev.color},${ev.color}66)` }}/>

                <div style={{ padding:'22px 24px' }}>
                  {/* Tag + days left */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                    <span style={{ fontSize:'11px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background:`${ev.color}22`, color:ev.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>{ev.tag}</span>
                    <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>{daysLeft(ev.date)}d restantes</span>
                  </div>

                  <h3 style={{ fontSize:'20px', fontWeight:800, color:'rgba(255,255,255,0.95)', letterSpacing:'-0.5px', lineHeight:1.2, marginBottom:'10px' }}>{ev.title}</h3>
                  <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:'16px' }}>{ev.desc}</p>

                  {/* Detalles */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
                    {[['📅', fmtDate(ev.date)],['🕐', ev.time + ' hrs'],['📍', ev.location],['🏘️', ev.community]].map(([ic,txt]) => (
                      <div key={txt} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <span style={{ fontSize:'14px' }}>{ic}</span>
                        <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)' }}>{txt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Capacidad */}
                  <div style={{ marginBottom:'18px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                      <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', fontWeight:500 }}>{ev.attendees} / {ev.cap} asistentes</span>
                      <span style={{ fontSize:'12px', color: pct>80?'#FCA87A':'rgba(255,255,255,0.35)', fontWeight:600 }}>{pct}%</span>
                    </div>
                    <div style={{ height:'5px', borderRadius:'5px', background:'rgba(255,255,255,0.08)' }}>
                      <div style={{ height:'100%', borderRadius:'5px', background:`linear-gradient(90deg,${ev.color},${ev.color}88)`, width:`${pct}%`, transition:'width .6s', boxShadow:`0 0 8px ${ev.color}88` }}/>
                    </div>
                  </div>

                  <button onClick={()=>toggleRSVP(ev.id)}
                    style={{ width:'100%', padding:'11px', borderRadius:'14px', border:'none', fontSize:'14px', fontWeight:700, cursor:'pointer', transition:'all .2s', fontFamily:'inherit',
                      background: ev.rsvp ? 'rgba(255,255,255,0.10)' : `linear-gradient(135deg,${ev.color},${ev.color}AA)`,
                      color:      ev.rsvp ? 'rgba(255,255,255,0.50)' : '#fff',
                      boxShadow:  ev.rsvp ? 'none' : `0 4px 16px ${ev.color}44`,
                    }}
                    onMouseEnter={e=>{ if(!ev.rsvp) e.currentTarget.style.boxShadow=`0 8px 24px ${ev.color}66`; }}
                    onMouseLeave={e=>{ if(!ev.rsvp) e.currentTarget.style.boxShadow=`0 4px 16px ${ev.color}44`; }}
                  >
                    {ev.rsvp ? '✓ Asistencia confirmada' : '✦ Confirmar asistencia'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {list.filter(e=>!e.featured).length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 32px' }}>
            <span style={{ fontSize:'56px', display:'block', marginBottom:'16px' }}>📅</span>
            <p style={{ fontSize:'22px', fontWeight:700, color:'rgba(255,255,255,0.60)' }}>Sin eventos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
