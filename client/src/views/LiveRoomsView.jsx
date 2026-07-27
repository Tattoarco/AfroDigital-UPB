import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseClient';
import Sidebar from '../components/shared/Sidebar';

/* ══ SALAS DISPONIBLES ══════════════════════════════════════════ */
const SALAS = [
  { id:'sala-general',  nombre:'Sala General',       desc:'Espacio abierto para toda la comunidad',         icon:'💬', color:'#7C3AED' },
  { id:'sala-musica',   nombre:'Música Afro',         desc:'Comparte ritmos y tradiciones musicales',        icon:'🎵', color:'#FB923C' },
  { id:'sala-historia', nombre:'Historia y Cultura',  desc:'Conversaciones sobre patrimonio afrocolombian',  icon:'📜', color:'#2563EB' },
  { id:'sala-upb',      nombre:'Afro UPB',            desc:'Estudiantes afro de la Pontificia Bolivariana', icon:'🎓', color:'#0D9488' },
  { id:'sala-arte',     nombre:'Arte y Creación',     desc:'Artistas afrocolombianos comparten su obra',    icon:'🎨', color:'#059669' },
];

const G = {
  background: 'var(--surface-1)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  border: '1px solid var(--surface-1-border)',
  borderTop: '1px solid var(--surface-1-border-top)',
  boxShadow: 'var(--shadow-soft)',
  borderRadius: '20px',
};

export default function LiveRoomsView() {
  const { user, profile } = useAuth();

  const [salaActiva,  setSalaActiva]  = useState(null);
  const [messages,    setMessages]    = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [input,       setInput]       = useState('');
  const [sending,     setSending]     = useState(false);
  const [connecting,  setConnecting]  = useState(false);

  const channelRef    = useRef(null);
  const messagesEndRef = useRef(null);

  const inicial = profile?.full_name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() ?? '?';

  /* ── Auto-scroll al fondo cuando llegan mensajes ─────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  /* ── Limpiar canal al desmontar ───────────────────────────── */
  useEffect(() => {
    return () => { channelRef.current?.unsubscribe(); };
  }, []);

  /* ── Entrar a una sala ────────────────────────────────────── */
  const joinRoom = useCallback(async (sala) => {
    if (connecting) return;

    // Salir de la sala anterior
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setSalaActiva(sala);
    setMessages([]);
    setOnlineUsers([]);
    setConnecting(true);

    const channel = supabase.channel(`afrodigital:${sala.id}`, {
      config: { presence: { key: user?.id ?? 'anon' } },
    });

    /* Escuchar mensajes broadcast */
    channel.on('broadcast', { event:'message' }, ({ payload }) => {
      setMessages(prev => [...prev, payload]);
    });

    /* Sincronizar presencia */
    channel.on('presence', { event:'sync' }, () => {
      const state = channel.presenceState();
      setOnlineUsers(Object.values(state).flat());
    });

    channel.on('presence', { event:'join' }, ({ newPresences }) => {
      if (newPresences[0]?.user_id !== user?.id) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          type: 'system',
          content: `${newPresences[0]?.full_name ?? 'Alguien'} entró a la sala`,
          created_at: new Date().toISOString(),
        }]);
      }
    });

    channel.on('presence', { event:'leave' }, ({ leftPresences }) => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'system',
        content: `${leftPresences[0]?.full_name ?? 'Alguien'} salió de la sala`,
        created_at: new Date().toISOString(),
      }]);
    });

    /* Suscribir y registrar presencia */
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id:   user?.id   ?? 'anon',
          full_name: profile?.full_name ?? 'Usuario',
          inicial,
          color:     sala.color,
          online_at: new Date().toISOString(),
        });
        setConnecting(false);

        /* Mensaje de bienvenida */
        setMessages([{
          id: crypto.randomUUID(),
          type: 'system',
          content: `Bienvenida a ${sala.nombre} ✊🏿`,
          created_at: new Date().toISOString(),
        }]);
      }
    });

    channelRef.current = channel;
  }, [user, profile, inicial, connecting]);

  /* ── Enviar mensaje ───────────────────────────────────────── */
  const sendMessage = async () => {
    if (!input.trim() || !channelRef.current || sending) return;
    setSending(true);
    const msg = {
      id:         crypto.randomUUID(),
      type:       'message',
      user_id:    user?.id,
      full_name:  profile?.full_name ?? 'Usuario',
      inicial,
      color:      salaActiva?.color ?? '#7C3AED',
      content:    input.trim(),
      created_at: new Date().toISOString(),
    };
    await channelRef.current.send({ type:'broadcast', event:'message', payload:msg });
    setInput('');
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const fmtTime = (iso) => new Date(iso).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
  const isOwn   = (msg) => msg.user_id === user?.id;

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflow:'hidden', color:'var(--text-1)' }}>

      {/* ── Fondo ──────────────────────────────────────────── */}
      <div className="feed-bg fixed inset-0 z-0"/>
      <div className="noise fixed inset-0 z-0 opacity-[0.04]"/>

      <Sidebar active="/live" />

      <div style={{ marginLeft:'90px', display:'flex', flexDirection:'column', height:'100vh', position:'relative', zIndex:1 }}>

        {/* ── Top bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] t4 font-semibold mb-1">AfroDigital UPB</p>
            <h1 className="text-[52px] font-black leading-none tracking-[-3px]">
              <span style={{ background:'linear-gradient(135deg,#A78BFA,#FB923C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Salas</span>
              <span className="t1"> en vivo</span>
            </h1>
          </div>

          {/* Indicador de conexión */}
          {salaActiva && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={G}>
              <span className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: connecting ? '#FB923C' : '#059669', boxShadow:`0 0 8px ${connecting?'#FB923C':'#059669'}` }}/>
              <span className="text-[13px] font-semibold t2">
                {connecting ? 'Conectando...' : `${onlineUsers.length} en línea`}
              </span>
            </div>
          )}
        </div>

        {/* ── Grid: salas + chat ───────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'16px', flex:1, padding:'0 32px 24px', minHeight:0 }}>

          {/* PANEL IZQUIERDO — lista de salas ───────────────── */}
          <div className="flex flex-col gap-3 overflow-y-auto" style={{ scrollbarWidth:'thin' }}>

            <p className="text-xs uppercase tracking-[0.14em] t4 font-semibold px-1">Salas disponibles</p>

            {SALAS.map(sala => {
              const isActive = salaActiva?.id === sala.id;
              return (
                <div key={sala.id}
                  onClick={() => joinRoom(sala)}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    ...G,
                    padding:'16px 18px',
                    border: isActive ? `1px solid ${sala.color}50` : '1px solid var(--surface-1-border)',
                    borderTop: isActive ? `1px solid ${sala.color}80` : '1px solid var(--surface-1-border-top)',
                    background: isActive ? `${sala.color}15` : 'var(--surface-1)',
                    transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='var(--surface-hover)'; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='var(--surface-1)'; }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background:`${sala.color}22`, border:`1px solid ${sala.color}40` }}>
                      {sala.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-bold t1 truncate">{sala.nombre}</p>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                            style={{ background:'#059669', boxShadow:'0 0 6px #059669' }}/>
                        )}
                      </div>
                      <p className="text-[11px] t4 truncate">{sala.desc}</p>
                    </div>
                  </div>

                  {isActive && onlineUsers.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t bd-divider">
                      <div className="flex">
                        {onlineUsers.slice(0,5).map((u,i) => (
                          <div key={i}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white border-2 border-[rgba(0,0,0,0.30)]"
                            style={{ background:sala.color, marginLeft: i>0?'-6px':'0', zIndex:5-i }}>
                            {u.inicial ?? '?'}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] t4">{onlineUsers.length} en línea</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ÁREA DE CHAT ────────────────────────────────────── */}
          {salaActiva ? (
            <div style={{ ...G, display:'flex', flexDirection:'column', minHeight:0, overflow:'hidden' }}>

              {/* Header del chat */}
              <div className="flex items-center gap-3 px-6 py-4 border-b bd-divider flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background:`${salaActiva.color}22`, border:`1px solid ${salaActiva.color}40` }}>
                  {salaActiva.icon}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold t1">{salaActiva.nombre}</h2>
                  <p className="text-[12px] t4">{salaActiva.desc}</p>
                </div>

                {/* Avatares online */}
                {onlineUsers.length > 0 && (
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex">
                      {onlineUsers.slice(0,6).map((u,i) => (
                        <div key={i} title={u.full_name}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white border-2 border-[rgba(0,0,0,0.30)]"
                          style={{ background:salaActiva.color, marginLeft:i>0?'-8px':'0', zIndex:6-i }}>
                          {u.inicial ?? '?'}
                        </div>
                      ))}
                    </div>
                    {onlineUsers.length > 6 && (
                      <span className="text-[12px] t4">+{onlineUsers.length-6}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3" style={{ scrollbarWidth:'thin' }}>
                {messages.map(msg => (
                  msg.type === 'system'
                    /* Mensaje de sistema */
                    ? <div key={msg.id} className="text-center">
                        <span className="text-[11px] t4 px-3 py-1 rounded-full sf1">
                          {msg.content}
                        </span>
                      </div>

                    /* Mensaje de usuario */
                    : <div key={msg.id}
                        className={`flex gap-3 ${isOwn(msg) ? 'flex-row-reverse' : 'flex-row'}`}>

                        {/* Avatar */}
                        {!isOwn(msg) && (
                          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 self-end"
                            style={{ background:msg.color ?? '#7C3AED' }}>
                            {msg.inicial ?? '?'}
                          </div>
                        )}

                        {/* Burbuja */}
                        <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn(msg) ? 'items-end' : 'items-start'}`}>
                          {!isOwn(msg) && (
                            <span className="text-[11px] t4 font-medium px-1">{msg.full_name}</span>
                          )}
                          <div className="px-4 py-[10px] rounded-[16px] text-[15px] leading-[1.55]"
                            style={{
                              background: isOwn(msg)
                                ? `linear-gradient(135deg, ${salaActiva.color}, ${salaActiva.color}CC)`
                                : 'var(--surface-2)',
                              color: isOwn(msg) ? '#fff' : 'var(--text-1)',
                              borderRadius: isOwn(msg) ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                              boxShadow: isOwn(msg) ? `0 4px 14px ${salaActiva.color}55` : 'none',
                            }}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] t5 px-1">{fmtTime(msg.created_at)}</span>
                        </div>
                      </div>
                ))}

                {/* Indicador de carga */}
                {connecting && (
                  <div className="flex items-center gap-2 t4 text-[13px]">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/>
                    Conectando a la sala...
                  </div>
                )}

                <div ref={messagesEndRef}/>
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t bd-divider flex-shrink-0">
                <div className="flex gap-3 items-end">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${salaActiva.color},${salaActiva.color}BB)` }}>
                    {inicial}
                  </div>

                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Escribe en ${salaActiva.nombre}... (Enter para enviar)`}
                    rows={1}
                    className="flex-1 resize-none text-[15px] t1 outline-none border rounded-[14px] px-4 py-[10px] transition-all duration-200 font-[inherit]"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: input ? `${salaActiva.color}60` : 'var(--surface-1-border)',
                      lineHeight: 1.5,
                      maxHeight: '100px',
                    }}
                    onFocus={e => e.target.style.borderColor = `${salaActiva.color}80`}
                    onBlur={e  => e.target.style.borderColor = input ? `${salaActiva.color}60` : 'var(--surface-1-border)'}
                  />

                  <button onClick={sendMessage}
                    disabled={!input.trim() || sending || connecting}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: input.trim() ? `linear-gradient(135deg,${salaActiva.color},${salaActiva.color}BB)` : 'var(--surface-1)',
                      boxShadow:  input.trim() ? `0 4px 14px ${salaActiva.color}55` : 'none',
                    }}
                    onMouseEnter={e => { if(input.trim()) e.currentTarget.style.transform='scale(1.08)'; }}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  >
                    {sending
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      : <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13 M22 2L15 22l-4-9-9-4 20-7z"/>
                        </svg>
                    }
                  </button>
                </div>
                <p className="text-[11px] t5 mt-2 pl-12">Enter para enviar · Shift+Enter para nueva línea</p>
              </div>
            </div>

          ) : (
            /* Estado vacío — sin sala seleccionada */
            <div style={{ ...G, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
              <span className="text-[64px]" style={{ animation:'anim-float 5s ease-in-out infinite' }}>🎙️</span>
              <h2 className="text-[24px] font-bold t2 tracking-tight">Elige una sala para entrar</h2>
              <p className="text-[15px] t4 text-center max-w-[300px] leading-[1.6]">
                Selecciona una sala a la izquierda y comienza a chatear en tiempo real con la comunidad afro.
              </p>
              <div className="flex gap-2 mt-2">
                {SALAS.slice(0,3).map(s => (
                  <button key={s.id} onClick={() => joinRoom(s)}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 border font-[inherit]"
                    style={{ background:`${s.color}18`, borderColor:`${s.color}40`, color:s.color }}
                    onMouseEnter={e => e.currentTarget.style.background=`${s.color}28`}
                    onMouseLeave={e => e.currentTarget.style.background=`${s.color}18`}
                  >
                    {s.icon} {s.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        textarea::placeholder { color: var(--text-5); }
        @keyframes anim-float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
      `}</style>
    </div>
  );
}
