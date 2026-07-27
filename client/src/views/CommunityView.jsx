import { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import communityMural from '../assets/visuals/community-mural.svg';

/* ── Datos mock (reemplazar con API cuando esté listo) ────── */
const COMMUNITIES = [
  { id:1, name:'Afro UPB',            type:'university',   city:'Medellín',  members:142, desc:'Comunidad afro oficial de la UPB',                  icon:'🎓', color:'#7C3AED', joined:true  },
  { id:2, name:'Arte Afro Medellín',  type:'neighborhood', city:'Medellín',  members:67,  desc:'Artistas afrocolombianos que habitan la ciudad',     icon:'🎨', color:'#2563EB', joined:true  },
  { id:3, name:'Música Afro',         type:'interest',     city:'Nacional',  members:89,  desc:'Ritmos, cantaoras y tradiciones musicales afro',     icon:'🎵', color:'#FB923C', joined:false },
  { id:4, name:'Afro UdeA',           type:'university',   city:'Medellín',  members:98,  desc:'Comunidad afro de la Universidad de Antioquia',      icon:'📚', color:'#0D9488', joined:false },
  { id:5, name:'Cocina Tradicional',  type:'interest',     city:'Nacional',  members:156, desc:'Gastronomía, sabores y recetas afrocolombianas',     icon:'🍲', color:'#FB923C', joined:true  },
  { id:6, name:'Barrio Chocó',        type:'neighborhood', city:'Quibdó',    members:43,  desc:'Comunidad del corazón del Pacífico colombiano',      icon:'🌊', color:'#7C3AED', joined:false },
  { id:7, name:'Afro EAFIT',          type:'university',   city:'Medellín',  members:75,  desc:'Estudiantes afro de EAFIT construyendo comunidad',   icon:'🔬', color:'#2563EB', joined:false },
  { id:8, name:'Tejido y Artesanía',  type:'interest',     city:'Nacional',  members:62,  desc:'Tradición artesanal afrocolombiana en tus manos',    icon:'🧵', color:'#0D9488', joined:false },
];

const TYPE_LABEL = { university:'Universidad', neighborhood:'Barrio', interest:'Interés' };
const TYPE_COLOR = { university:'rgba(124,58,237,0.18)', neighborhood:'rgba(251,146,60,0.18)', interest:'rgba(37,99,235,0.18)' };
const TYPE_TEXT  = { university:'#A78BFA', neighborhood:'#FCA87A', interest:'#93C5FD' };

const G = {
  background: 'var(--surface-1)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  border: '1px solid var(--surface-1-border)',
  borderTop: '1px solid var(--surface-1-border-top)',
  boxShadow: 'var(--shadow-soft)',
};

export default function CommunityView() {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('all');
  const [,           setCreating]    = useState(false);

  const joined    = communities.filter(c => c.joined);
  const filtered  = communities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.type === filter;
    return matchSearch && matchFilter;
  });

  const toggleJoin = (id) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members-1 : c.members+1 } : c));
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflow:'hidden', color:'var(--text-1)' }}>

      {/* FONDO */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'var(--bg-community)' }}/>

      <Sidebar active="/community" />

      <div style={{ marginLeft:'90px', padding:'40px 48px 60px', position:'relative', zIndex:1 }}>

        {/* ── CABECERA ──────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'28px', marginBottom:'36px' }}>
          <div>
            <p style={{ fontSize:'12px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-4)', fontWeight:600, marginBottom:'6px' }}>
              AfroDigital UPB
            </p>
            <h1 style={{ fontSize:'64px', fontWeight:900, lineHeight:0.92, letterSpacing:'-3px' }}>
              <span style={{ background:'linear-gradient(135deg,#A78BFA,#60A5FA,#FCA87A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Comuni
              </span>
              <span style={{ color:'var(--text-1)' }}>dades</span>
            </h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'18px' }}>
            <img src={communityMural} alt="Mural ilustrado de comunidades afro conectadas" style={{ width:'270px', height:'150px', objectFit:'cover', borderRadius:'24px', border:'1px solid var(--surface-1-border)', boxShadow:'0 22px 70px rgba(0,0,0,0.34)' }} />
            <button onClick={()=>setCreating(true)}
              style={{ padding:'13px 24px', borderRadius:'16px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer', boxShadow:'0 8px 28px rgba(124,58,237,0.50)', transition:'all .3s', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'8px' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 14px 40px rgba(124,58,237,0.65)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,0.50)'; }}
            >+ Crear comunidad</button>
          </div>
        </div>

        {/* ── MIS COMUNIDADES ───────────────────────────────── */}
        {joined.length > 0 && (
          <div style={{ marginBottom:'40px' }}>
            <p style={{ fontSize:'13px', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-4)', fontWeight:700, marginBottom:'16px' }}>
              Mis comunidades · {joined.length}
            </p>
            <div style={{ display:'flex', gap:'14px', overflowX:'auto', paddingBottom:'8px' }}>
              {joined.map(c => (
                <div key={c.id} style={{ ...G, borderRadius:'20px', padding:'20px', minWidth:'180px', flexShrink:0, cursor:'pointer', transition:'all .25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px rgba(0,0,0,0.35), 0 32px 64px ${c.color}22`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)'; }}
                >
                  <div style={{ fontSize:'32px', marginBottom:'10px' }}>{c.icon}</div>
                  <p style={{ fontSize:'15px', fontWeight:700, color:'var(--text-1)', marginBottom:'3px', lineHeight:1.2 }}>{c.name}</p>
                  <p style={{ fontSize:'12px', color:'var(--text-4)' }}>{c.members} miembros</p>
                  <div style={{ marginTop:'10px', width:'100%', height:'3px', borderRadius:'3px', background:'var(--surface-1)' }}>
                    <div style={{ height:'100%', borderRadius:'3px', background:c.color, width:'60%', boxShadow:`0 0 8px ${c.color}` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BÚSQUEDA Y FILTROS ────────────────────────────── */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'28px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:'240px' }}>
            <svg style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-4)' }} width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar comunidades..."
              style={{ width:'100%', padding:'12px 16px 12px 40px', borderRadius:'14px', fontSize:'15px', border:'1px solid var(--surface-1-border)', outline:'none', background:'var(--surface-1)', color:'var(--text-1)', fontFamily:'inherit', backdropFilter:'blur(20px)', boxSizing:'border-box' }}
              onFocus={e=>{ e.target.style.borderColor='rgba(124,58,237,0.50)'; e.target.style.background='rgba(124,58,237,0.10)'; }}
              onBlur={e=>{  e.target.style.borderColor='var(--surface-1-border)'; e.target.style.background='var(--surface-1)'; }}
            />
          </div>
          <div style={{ display:'flex', gap:'6px' }}>
            {[['all','Todos'],['university','Universidad'],['neighborhood','Barrio'],['interest','Interés']].map(([v,l]) => (
              <button key={v} onClick={()=>setFilter(v)}
                style={{ padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all .2s', border:'1px solid', fontFamily:'inherit', background:filter===v?'rgba(124,58,237,0.22)':'transparent', color:filter===v?'#A78BFA':'var(--text-4)', borderColor:filter===v?'rgba(124,58,237,0.45)':'var(--surface-1-border)' }}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* ── GRID DE COMUNIDADES ───────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'18px' }}>
          {filtered.map(c => (
            <div key={c.id} style={{ ...G, borderRadius:'24px', overflow:'hidden', transition:'all .3s cubic-bezier(0.34,1.56,0.64,1)' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-8px) scale(1.01)'; e.currentTarget.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,0.20), 0 8px 24px rgba(0,0,0,0.35), 0 40px 80px ${c.color}25`; e.currentTarget.style.borderColor=`${c.color}40`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor='var(--surface-1-border)'; }}
            >
              {/* Tira de color superior */}
              <div style={{ height:'6px', background:`linear-gradient(90deg, ${c.color}, ${c.color}88)` }}/>

              <div style={{ padding:'22px 24px' }}>
                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'14px' }}>
                  <div style={{ width:'52px', height:'52px', borderRadius:'16px', background:`${c.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', border:`1px solid ${c.color}30`, flexShrink:0 }}>
                    {c.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ fontSize:'17px', fontWeight:800, color:'var(--text-1)', marginBottom:'4px', lineHeight:1.2, letterSpacing:'-0.3px' }}>{c.name}</h3>
                    <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 9px', borderRadius:'8px', background:TYPE_COLOR[c.type], color:TYPE_TEXT[c.type], textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      {TYPE_LABEL[c.type]}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.6, marginBottom:'18px' }}>{c.desc}</p>

                {/* Footer */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ display:'flex' }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width:'22px', height:'22px', borderRadius:'50%', background:`hsl(${260+i*30},60%,55%)`, border:'2px solid var(--surface-1)', marginLeft: i>0?'-7px':'0' }}/>
                      ))}
                    </div>
                    <span style={{ fontSize:'13px', color:'var(--text-4)', fontWeight:500 }}>{c.members} miembros</span>
                  </div>

                  <button onClick={()=>toggleJoin(c.id)}
                    style={{ padding:'8px 18px', borderRadius:'12px', fontSize:'13px', fontWeight:700, cursor:'pointer', transition:'all .2s', border:'none', fontFamily:'inherit',
                      background: c.joined ? 'var(--surface-2)'                                : `linear-gradient(135deg,${c.color},${c.color}BB)`,
                      color:      c.joined ? 'var(--text-3)'                                   : '#fff',
                      boxShadow:  c.joined ? 'none'                                            : `0 4px 14px ${c.color}55`,
                    }}
                    onMouseEnter={e=>{ if(!c.joined){ e.currentTarget.style.transform='scale(1.05)'; }}}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; }}
                  >
                    {c.joined ? '✓ Unida' : 'Unirse'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 32px' }}>
            <span style={{ fontSize:'56px', display:'block', marginBottom:'16px' }}>🔍</span>
            <p style={{ fontSize:'22px', fontWeight:700, color:'var(--text-2)' }}>Sin resultados para "{search}"</p>
            <p style={{ fontSize:'16px', color:'var(--text-4)', marginTop:'8px' }}>Intenta con otro término o crea la comunidad tú misma</p>
          </div>
        )}
      </div>
      <style>{`input::placeholder{color:var(--text-5);}`}</style>
    </div>
  );
}
