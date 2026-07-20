import { useState } from 'react';
import api from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';

const CATS = [['history','📜 Historia'],['music','🎵 Música'],['testimony','🗣️ Testimonio'],['culture','🌿 Cultura'],['news','📣 Noticia'],['other','✦ Otro']];

export default function PostForm({ onSuccess, onCancel, dark = false }) {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [cat,     setCat]     = useState('');
  const [tipo,    setTipo]    = useState('text');
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState(null);

  const inicial = profile?.full_name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() ?? '?';
  const textColor = dark ? 'rgba(255,255,255,0.90)' : '#1A1523';
  const subColor  = dark ? 'rgba(255,255,255,0.45)' : '#9187A4';
  const inputBg   = dark ? 'rgba(255,255,255,0.07)' : 'rgba(243,237,227,0.60)';
  const inputBorder = dark ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid rgba(124,58,237,0.12)';
  const btnBorder = dark ? '1px solid rgba(255,255,255,0.12)' : '1.5px solid rgba(124,58,237,0.12)';
  const btnColor  = dark ? 'rgba(255,255,255,0.50)' : '#3D3553';

  const submit = async (e) => {
    e.preventDefault(); if(!content.trim()) return;
    setErr(null); setLoading(true);
    try { const p = await api.post('/posts',{content_type:tipo,content:content.trim(),category:cat||null}); onSuccess?.(p); }
    catch(e){ setErr(e.message); } finally{ setLoading(false); }
  };

  return (
    <div style={{ padding:'26px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#FB923C,#F97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:800, color:'#fff', flexShrink:0 }}>{inicial}</div>
        <div>
          <p style={{ fontSize:'16px', fontWeight:700, color:textColor }}>{profile?.full_name}</p>
          <p style={{ fontSize:'13px', color:subColor }}>nueva publicación</p>
        </div>
        <button onClick={onCancel}
          style={{ marginLeft:'auto', width:'34px', height:'34px', borderRadius:'10px', background:'rgba(255,255,255,0.08)', border:btnBorder, color:subColor, cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s', fontFamily:'inherit' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(124,58,237,0.20)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
        >×</button>
      </div>

      <div style={{ display:'flex', gap:'7px', marginBottom:'16px' }}>
        {[['text','✍️ Texto'],['image','📷 Imagen'],['audio','🎵 Audio']].map(([v,lb]) => (
          <button key={v} onClick={()=>setTipo(v)} style={{ padding:'9px 15px', borderRadius:'12px', fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s', border:'1.5px solid', fontFamily:'inherit', background:tipo===v?'rgba(124,58,237,0.22)':'transparent', color:tipo===v?'#A78BFA':btnColor, borderColor:tipo===v?'rgba(124,58,237,0.45)':'rgba(255,255,255,0.12)' }}>{lb}</button>
        ))}
      </div>

      <form onSubmit={submit}>
        <textarea value={content} onChange={e=>setContent(e.target.value)} required rows={5}
          placeholder="Comparte una historia, testimonio, reflexión o canción con tu comunidad..."
          style={{ width:'100%', padding:'16px 18px', borderRadius:'16px', fontSize:'16px', lineHeight:1.65, resize:'none', outline:'none', transition:'all .25s', background:inputBg, border:inputBorder, color:textColor, marginBottom:'5px', boxSizing:'border-box', fontFamily:'inherit' }}
          onFocus={e=>{ e.target.style.borderColor='rgba(124,58,237,0.55)'; e.target.style.boxShadow='0 0 0 4px rgba(124,58,237,0.12)'; e.target.style.background=dark?'rgba(255,255,255,0.10)':'rgba(255,255,255,0.90)'; }}
          onBlur={e=>{  e.target.style.borderColor=dark?'rgba(255,255,255,0.12)':'rgba(124,58,237,0.12)'; e.target.style.boxShadow='none'; e.target.style.background=inputBg; }}
        />
        <p style={{ fontSize:'12px', color:content.length>450?'#FB923C':subColor, textAlign:'right', marginBottom:'16px', fontWeight:500 }}>{content.length}/500</p>

        <p style={{ fontSize:'12px', letterSpacing:'0.12em', textTransform:'uppercase', color:subColor, fontWeight:700, marginBottom:'9px' }}>Categoría</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'7px', marginBottom:'20px' }}>
          {CATS.map(([v,lb]) => (
            <button key={v} type="button" onClick={()=>setCat(cat===v?'':v)} style={{ padding:'7px 14px', borderRadius:'20px', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'all .2s', border:'1.5px solid', fontFamily:'inherit', background:cat===v?'rgba(124,58,237,0.22)':'transparent', color:cat===v?'#A78BFA':btnColor, borderColor:cat===v?'rgba(124,58,237,0.45)':'rgba(255,255,255,0.12)' }}>{lb}</button>
          ))}
        </div>

        {err && <div style={{ padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#FCA5A5', fontSize:'15px', marginBottom:'14px' }}>⚠ {err}</div>}

        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <button type="button" onClick={onCancel} style={{ padding:'11px 20px', borderRadius:'13px', background:'transparent', border:btnBorder, color:btnColor, fontSize:'15px', fontWeight:600, cursor:'pointer', transition:'all .2s', fontFamily:'inherit' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >Cancelar</button>
          <button type="submit" disabled={loading||!content.trim()} style={{ padding:'11px 26px', borderRadius:'13px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', border:'none', color:'#fff', fontSize:'15px', fontWeight:700, cursor:loading||!content.trim()?'not-allowed':'pointer', opacity:loading||!content.trim()?.55:1, boxShadow:'0 6px 22px rgba(124,58,237,0.45)', transition:'all .2s', display:'flex', alignItems:'center', gap:'9px', fontFamily:'inherit' }}
            onMouseEnter={e=>{ if(!loading&&content.trim()){ e.currentTarget.style.boxShadow='0 10px 32px rgba(124,58,237,0.60)'; e.currentTarget.style.transform='translateY(-2px)'; }}}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 6px 22px rgba(124,58,237,0.45)'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            {loading ? <><span style={{ width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .8s linear infinite',display:'inline-block' }}/> Publicando...</> : '✦ Publicar'}
          </button>
        </div>
      </form>
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.22);} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}