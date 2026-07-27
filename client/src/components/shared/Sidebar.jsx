// ── Sidebar compartido para todas las vistas ─────────────────
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const SunIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);
const MoonIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const NAV = [
  { label:'Feed',        href:'/feed',         d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { label:'Comunidades', href:'/community',    d:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" },
  { label:'Eventos',     href:'/events',       d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label:'Mapa',        href:'/map',          d:"M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z" },
  { label:'Logros',      href:'/achievements', d:"M8 21h8m-4-4v4M5 3h14l-1 7H6L5 3z M5 10c0 3 3.1 5.5 7 5.5s7-2.5 7-5.5" },
];

const Ico = ({ d }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

export default function Sidebar({ active }) {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const inicial = profile?.full_name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() ?? '?';
  const offClr  = 'var(--text-4)';
  const hovBg   = 'var(--surface-hover)';
  const hovClr  = 'var(--text-1)';
  const divClr  = 'var(--divider)';

  return (
    <aside style={{
      width:'90px', position:'fixed', top:0, left:0, height:'100vh', zIndex:50,
      display:'flex', flexDirection:'column', alignItems:'center', padding:'28px 0',
      background:'var(--sidebar-surface)', backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
      borderRight:'1px solid var(--divider)',
      boxShadow: 'var(--shadow-soft)',
    }}>

      {/* Logo */}
      <div style={{ width:'52px', height:'52px', borderRadius:'18px', background:'linear-gradient(135deg,#7C3AED,#4F46E5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', marginBottom:'16px', boxShadow:'0 8px 24px rgba(124,58,237,0.40)', cursor:'pointer' }}
        onClick={()=>navigate('/feed')} title="Inicio">
        ✊🏿
      </div>

      {/* Toggle de tema */}
      <button onClick={toggleTheme} title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="theme-toggle" style={{ marginBottom:'20px' }}>
        {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
      </button>

      {/* Nav */}
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', width:'100%', paddingInline:'14px' }}>
        {NAV.map(item => {
          const on = active === item.href;
          return (
            <button key={item.href} onClick={()=>navigate(item.href)} title={item.label}
              style={{
                width:'100%', aspectRatio:'1', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center',
                border:'none', cursor:'pointer', transition:'all .2s', position:'relative',
                background: on ? 'rgba(124,58,237,0.18)' : 'transparent',
                color:      on ? '#A78BFA'                : offClr,
                boxShadow:  on ? '0 4px 16px rgba(124,58,237,0.22), inset 0 0 0 1px rgba(124,58,237,0.28)' : 'none',
              }}
              onMouseEnter={e=>{ if(!on){ e.currentTarget.style.background=hovBg; e.currentTarget.style.color=hovClr; }}}
              onMouseLeave={e=>{ if(!on){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=offClr; }}}
            >
              <Ico d={item.d}/>
              {on && <span style={{ position:'absolute', left:'-14px', top:'50%', transform:'translateY(-50%)', width:'4px', height:'32px', borderRadius:'0 4px 4px 0', background:'#7C3AED' }}/>}
            </button>
          );
        })}
      </div>

      <div style={{ flex:1 }}/>
      <div style={{ width:'40px', height:'1px', background:divClr, marginBottom:'16px' }}/>

      {/* Avatar / logout */}
      <div onClick={logout} title="Cerrar sesión"
        style={{ width:'48px', height:'48px', borderRadius:'16px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:800, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(251,146,60,0.40)', transition:'all .2s' }}
        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
        onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
      >{inicial}</div>
    </aside>
  );
}
