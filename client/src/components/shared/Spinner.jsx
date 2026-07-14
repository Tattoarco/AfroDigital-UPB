// ── AfroDigital UPB — Spinner de carga ──────────────────────────

export default function Spinner({ mensaje = 'Cargando...' }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      height:         '100vh',
      gap:            '16px',
      color:          '#6b7280',
      fontFamily:     'sans-serif',
    }}>
      <div style={{
        width:           '36px',
        height:          '36px',
        border:          '3px solid #e5e7eb',
        borderTopColor:  '#1D9E75',
        borderRadius:    '50%',
        animation:       'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '14px' }}>{mensaje}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
