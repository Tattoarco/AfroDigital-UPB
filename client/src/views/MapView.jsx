// ── AfroDigital UPB — Mapa territorial ──────────────────────────
// Dependencias: npm install leaflet react-leaflet

import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from '../components/shared/Sidebar';
import { useTheme } from '../hooks/useTheme';

/* ══ DATOS: municipios de origen de miembros ═════════════════════
   (en producción estos vendrían de la API: GET /api/users/map     */
const MUNICIPIOS = [
  { nombre:'Quibdó',                 depto:'Chocó',             lat:5.6947,  lng:-76.6611, miembros:28, region:'Pacífico'   },
  { nombre:'Buenaventura',           depto:'Valle del Cauca',   lat:3.8831,  lng:-77.0311, miembros:22, region:'Pacífico'   },
  { nombre:'Tumaco',                 depto:'Nariño',            lat:1.8092,  lng:-78.7633, miembros:15, region:'Pacífico'   },
  { nombre:'Turbo',                  depto:'Antioquia',         lat:8.0925,  lng:-76.7235, miembros:10, region:'Pacífico'   },
  { nombre:'Nuquí',                  depto:'Chocó',             lat:5.7083,  lng:-77.2694, miembros:4,  region:'Pacífico'   },
  { nombre:'Bahía Solano',           depto:'Chocó',             lat:6.2253,  lng:-77.3995, miembros:3,  region:'Pacífico'   },
  { nombre:'Istmina',                depto:'Chocó',             lat:5.1597,  lng:-76.6833, miembros:7,  region:'Pacífico'   },
  { nombre:'Condoto',                depto:'Chocó',             lat:5.0938,  lng:-76.6472, miembros:5,  region:'Pacífico'   },
  { nombre:'Cartagena',              depto:'Bolívar',           lat:10.3910, lng:-75.4794, miembros:18, region:'Caribe'     },
  { nombre:'San Basilio de Palenque',depto:'Bolívar',           lat:10.1683, lng:-75.2167, miembros:8,  region:'Caribe'     },
  { nombre:'Barranquilla',           depto:'Atlántico',         lat:10.9639, lng:-74.7964, miembros:12, region:'Caribe'     },
  { nombre:'Montería',               depto:'Córdoba',           lat:8.7479,  lng:-75.8814, miembros:6,  region:'Caribe'     },
  { nombre:'Medellín',               depto:'Antioquia',         lat:6.2442,  lng:-75.5812, miembros:35, region:'Andina'     },
  { nombre:'Cali',                   depto:'Valle del Cauca',   lat:3.4516,  lng:-76.5320, miembros:20, region:'Andina'     },
  { nombre:'Bogotá',                 depto:'Cundinamarca',      lat:4.7110,  lng:-74.0721, miembros:14, region:'Andina'     },
  { nombre:'Popayán',                depto:'Cauca',             lat:2.4448,  lng:-76.6147, miembros:9,  region:'Andina'     },
  { nombre:'Puerto Inírida',         depto:'Guainía',           lat:3.8653,  lng:-67.9239, miembros:2,  region:'Orinoquía'  },
  { nombre:'Leticia',                depto:'Amazonas',          lat:-4.2152, lng:-69.9406, miembros:2,  region:'Amazonía'   },
];

const REGION_COLOR = {
  'Pacífico':   '#7C3AED',
  'Caribe':     '#2563EB',
  'Andina':     '#FB923C',
  'Orinoquía':  '#0D9488',
  'Amazonía':   '#059669',
};

const G = {
  background: 'var(--surface-1)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  border: '1px solid var(--surface-1-border)',
  borderTop: '1px solid var(--surface-1-border-top)',
  boxShadow: 'var(--shadow-soft)',
};

export default function MapView() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(null);
  const [filtroRegion, setFiltroRegion] = useState('Todas');

  const total     = MUNICIPIOS.reduce((s, m) => s + m.miembros, 0);
  const regiones  = ['Todas', ...Object.keys(REGION_COLOR)];
  const filtrados = filtroRegion === 'Todas'
    ? MUNICIPIOS
    : MUNICIPIOS.filter(m => m.region === filtroRegion);

  const porRegion = Object.keys(REGION_COLOR).map(r => ({
    region: r,
    total:  MUNICIPIOS.filter(m => m.region === r).reduce((s, m) => s + m.miembros, 0),
    color:  REGION_COLOR[r],
  })).filter(r => r.total > 0).sort((a, b) => b.total - a.total);

  const topMunicipios = [...MUNICIPIOS].sort((a, b) => b.miembros - a.miembros).slice(0, 6);

  // Radio del círculo escalado por miembros
  const radio = (n) => Math.max(8, Math.min(32, n * 0.8 + 4));

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflow:'hidden', color:'var(--text-1)' }}>

      {/* ── Fondo atmosférico ──────────────────────────────── */}
      <div className="feed-bg fixed inset-0 z-0"/>
      <div className="noise fixed inset-0 z-0 opacity-[0.04]"/>

      <Sidebar active="/map" />

      {/* ── Contenido ──────────────────────────────────────── */}
      <div style={{ marginLeft:'90px', display:'flex', flexDirection:'column', height:'100vh', position:'relative', zIndex:1 }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] t4 font-semibold mb-1">AfroDigital UPB</p>
            <h1 className="text-[56px] font-black leading-none tracking-[-3px]">
              <span style={{ background:'linear-gradient(135deg,#A78BFA,#60A5FA,#FCA87A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Mapa</span>
              <span className="t1"> territorial</span>
            </h1>
          </div>

          {/* Filtro de región */}
          <div className="flex gap-2 flex-wrap justify-end">
            {regiones.map(r => (
              <button key={r} onClick={() => setFiltroRegion(r)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold border cursor-pointer transition-all duration-200 font-[inherit]"
                style={{
                  background:   filtroRegion === r ? `${REGION_COLOR[r] ?? 'rgba(124,58,237,0.22)'}33` : 'var(--surface-1)',
                  borderColor:  filtroRegion === r ? (REGION_COLOR[r] ?? '#7C3AED') + '55'             : 'var(--surface-1-border)',
                  color:        filtroRegion === r ? (REGION_COLOR[r] ?? '#A78BFA')                    : 'var(--text-3)',
                }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid: panel izquierdo + mapa */}
        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'16px', flex:1, padding:'0 32px 24px', minHeight:0 }}>

          {/* ── PANEL IZQUIERDO ──────────────────────────── */}
          <div className="flex flex-col gap-4 overflow-y-auto pb-2" style={{ scrollbarWidth:'thin' }}>

            {/* Resumen */}
            <div style={{ ...G, borderRadius:'20px', padding:'22px 20px' }}>
              <p className="text-xs uppercase tracking-[0.14em] t4 font-semibold mb-3">Miembros en el mapa</p>
              <p className="text-[56px] font-black leading-none tracking-[-3px]"
                style={{ background:'linear-gradient(135deg,#A78BFA,#FB923C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {total}
              </p>
              <p className="text-[13px] t4 mt-1">{MUNICIPIOS.length} municipios · {Object.keys(REGION_COLOR).length} regiones</p>
            </div>

            {/* Por región */}
            <div style={{ ...G, borderRadius:'20px', padding:'20px' }}>
              <p className="text-xs uppercase tracking-[0.14em] t4 font-semibold mb-4">Por región</p>
              <div className="flex flex-col gap-3">
                {porRegion.map(r => (
                  <div key={r.region}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:r.color, boxShadow:`0 0 8px ${r.color}` }}/>
                        <span className="text-[13px] font-medium t2">{r.region}</span>
                      </div>
                      <span className="text-[13px] font-bold" style={{ color:r.color }}>{r.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full sf1 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width:`${(r.total/total)*100}%`, background:r.color, boxShadow:`0 0 8px ${r.color}88` }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top municipios */}
            <div style={{ ...G, borderRadius:'20px', padding:'20px' }}>
              <p className="text-xs uppercase tracking-[0.14em] t4 font-semibold mb-4">Top municipios</p>
              <div className="flex flex-col gap-1">
                {topMunicipios.map((m, i) => (
                  <div key={m.nombre}
                    onClick={() => setSelected(m)}
                    className="flex items-center gap-3 p-[10px] rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: selected?.nombre === m.nombre ? `${REGION_COLOR[m.region]}22` : 'transparent',
                      borderLeft: selected?.nombre === m.nombre ? `3px solid ${REGION_COLOR[m.region]}` : '3px solid transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = selected?.nombre === m.nombre ? `${REGION_COLOR[m.region]}22` : 'transparent'}
                  >
                    <span className="text-[13px] font-bold t4 w-5 text-center">#{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold t1 truncate">{m.nombre}</p>
                      <p className="text-[11px] t4">{m.depto}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background:REGION_COLOR[m.region] }}/>
                      <span className="text-[13px] font-bold" style={{ color:REGION_COLOR[m.region] }}>{m.miembros}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Municipio seleccionado */}
            {selected && (
              <div style={{ ...G, borderRadius:'20px', padding:'20px', border:`1px solid ${REGION_COLOR[selected.region]}40`, borderTop:`1px solid ${REGION_COLOR[selected.region]}60` }}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs uppercase tracking-[0.14em] font-semibold t4">Seleccionado</p>
                  <button onClick={() => setSelected(null)}
                    className="t4 hover:t2 bg-transparent border-none cursor-pointer text-lg leading-none font-[inherit]">×</button>
                </div>
                <h3 className="text-xl font-black t1 mb-1 tracking-tight">{selected.nombre}</h3>
                <p className="text-[13px] t3 mb-4">{selected.depto} · {selected.region}</p>
                <div className="flex gap-3">
                  <div className="flex-1 text-center py-3 rounded-[14px] sf1 border bd1">
                    <p className="text-2xl font-black" style={{ color:REGION_COLOR[selected.region] }}>{selected.miembros}</p>
                    <p className="text-[11px] t4 mt-0.5">miembros</p>
                  </div>
                  <div className="flex-1 text-center py-3 rounded-[14px] sf1 border bd1">
                    <p className="text-2xl font-black t2">{Math.round((selected.miembros/total)*100)}%</p>
                    <p className="text-[11px] t4 mt-0.5">del total</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── MAPA ─────────────────────────────────────── */}
          <div style={{ ...G, borderRadius:'20px', overflow:'hidden', position:'relative' }}>
            <MapContainer
              center={[4.5709, -74.2973]}
              zoom={6}
              style={{ height:'100%', width:'100%', background: theme === 'dark' ? '#0C0418' : '#E5E3E8' }}
              zoomControl={false}
            >
              {/* Tile layer reactivo al tema (CartoDB Dark / Positron) */}
              <TileLayer
                key={theme}
                url={theme === 'dark'
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains="abcd"
                maxZoom={19}
              />

              {/* Marcadores circulares por municipio */}
              {filtrados.map(m => {
                const color   = REGION_COLOR[m.region];
                const isSelected = selected?.nombre === m.nombre;
                return (
                  <CircleMarker
                    key={m.nombre}
                    center={[m.lat, m.lng]}
                    radius={isSelected ? radio(m.miembros) + 4 : radio(m.miembros)}
                    pathOptions={{
                      fillColor:   color,
                      fillOpacity: isSelected ? 0.95 : 0.75,
                      color:       isSelected ? (theme === 'dark' ? '#fff' : '#1A1523') : color,
                      weight:      isSelected ? 2.5   : 1,
                    }}
                    eventHandlers={{ click: () => setSelected(m) }}
                  >
                    <Tooltip
                      permanent={m.miembros >= 20}
                      direction="top"
                      offset={[0, -radio(m.miembros) - 4]}
                      className="map-tooltip"
                    >
                      <span style={{ fontFamily:'sans-serif', fontSize:'11px', fontWeight:700, color: theme === 'dark' ? '#fff' : '#1A1523', background:'transparent', border:'none', padding:0 }}>
                        {m.nombre} · {m.miembros}
                      </span>
                    </Tooltip>
                    <Popup className="map-popup">
                      <div style={{ fontFamily:'sans-serif', minWidth:'160px' }}>
                        <p style={{ fontSize:'15px', fontWeight:800, color:'#1A1523', marginBottom:'2px' }}>{m.nombre}</p>
                        <p style={{ fontSize:'12px', color:'#9187A4', marginBottom:'10px' }}>{m.depto} · {m.region}</p>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <div style={{ flex:1, textAlign:'center', padding:'8px', borderRadius:'10px', background:color+'18' }}>
                            <p style={{ fontSize:'22px', fontWeight:900, color, lineHeight:1 }}>{m.miembros}</p>
                            <p style={{ fontSize:'10px', color:'#9187A4', marginTop:'2px' }}>miembros</p>
                          </div>
                          <div style={{ flex:1, textAlign:'center', padding:'8px', borderRadius:'10px', background:'rgba(0,0,0,0.05)' }}>
                            <p style={{ fontSize:'22px', fontWeight:900, color:'#3D3553', lineHeight:1 }}>{Math.round((m.miembros/total)*100)}%</p>
                            <p style={{ fontSize:'10px', color:'#9187A4', marginTop:'2px' }}>del total</p>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Leyenda de colores superpuesta */}
            <div style={{
              position:'absolute', bottom:'16px', right:'16px', zIndex:1000,
              ...G, borderRadius:'14px', padding:'12px 16px',
            }}>
              <p className="text-[10px] uppercase tracking-[0.12em] t4 font-semibold mb-2">Regiones</p>
              {Object.entries(REGION_COLOR).map(([r, c]) => (
                <div key={r} className="flex items-center gap-2 mb-1 last:mb-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:c, boxShadow:`0 0 6px ${c}` }}/>
                  <span className="text-[12px] t2 font-medium">{r}</span>
                </div>
              ))}
            </div>

            {/* Indicador de zoom */}
            <div style={{ position:'absolute', top:'16px', right:'16px', zIndex:1000, ...G, borderRadius:'12px', padding:'6px' }}>
              <p className="text-[11px] t4 text-center font-medium px-2">Scroll para zoom</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos específicos del mapa */}
      <style>{`
        .leaflet-container { font-family: sans-serif; }
        .leaflet-popup-content-wrapper {
          background: rgba(255,255,255,0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(124,58,237,0.15) !important;
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.20) !important;
        }
        .leaflet-popup-tip { background: rgba(255,255,255,0.95) !important; }
        .leaflet-popup-close-button { color: #9187A4 !important; font-size: 18px !important; }
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          padding: 0 !important;
        }
        .leaflet-tooltip::before { display: none !important; }
        .leaflet-control-attribution {
          background: var(--surface-2) !important;
          color: var(--text-4) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: var(--text-3) !important; }
      `}</style>
    </div>
  );
}
