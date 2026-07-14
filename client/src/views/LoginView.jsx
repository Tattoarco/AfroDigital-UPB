import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginView() {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const { login, register, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname ?? "/feed";

  const submit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);
    try {
      if (modo === "login") {
        await login({ email, password });
        navigate(destino, { replace: true });
      } else {
        await register({ email, password, fullName: nombre });
        setMensaje("Revisa tu correo para confirmar.");
      }
    } catch (err) {
      console.error(err);
      setMensaje(err?.message || "Ocurrió un error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: "100vh", display: "flex", overflow: "hidden" }}>
      {" "}
      {/* ── IZQUIERDA — Hero visual ─────────────────────────── */}
      <div style={{ flex: "0 0 52%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 64px", overflow: "hidden" }}>
        {/* Aura de fondo izquierdo */}
        <div style={{ position: "absolute", top: "-120px", left: "-120px", width: "560px", height: "560px", borderRadius: "50%", background: "var(--purple)", filter: "blur(140px)", opacity: 0.14 }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-40px", width: "400px", height: "400px", borderRadius: "50%", background: "var(--blue)", filter: "blur(120px)", opacity: 0.1 }} />
        <div style={{ position: "absolute", top: "55%", left: "55%", width: "260px", height: "260px", borderRadius: "50%", background: "var(--orange)", filter: "blur(100px)", opacity: 0.12 }} />

        {/* Anillo decorativo grande */}
        <div className="anim-ring" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-52%)", width: "520px", height: "520px", borderRadius: "50%", border: "1px solid rgba(124,58,237,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-52%)", width: "380px", height: "380px", borderRadius: "50%", border: "1px dashed rgba(124,58,237,0.10)", pointerEvents: "none" }} />

        {/* Icono flotante central */}
        <div
          className="anim-float"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-58%)", width: "160px", height: "160px", borderRadius: "40px", background: "rgba(255,255,255,0.70)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 20px 80px rgba(124,58,237,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "72px" }}
        >
          ✊🏿
        </div>

        {/* Texto inferior */}
        <div style={{ position: "relative", zIndex: 2, marginTop: "auto" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--purple)", fontWeight: 700, marginBottom: "14px" }}>Comunidad Afro · UPB · Medellín</p>

          <h1 style={{ fontSize: "80px", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-4px", marginBottom: "20px" }}>
            <span className="text-chrome">Afro</span>
            <br />
            <span style={{ color: "var(--ink)", WebkitTextFillColor: "var(--ink)" }}>Digital</span>
          </h1>

          <p style={{ fontSize: "18px", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "320px", marginBottom: "32px" }}>El espacio digital donde la cultura afro de la UPB cobra vida, se documenta y se celebra.</p>

          {/* Estadísticas decorativas */}
          <div style={{ display: "flex", gap: "36px" }}>
            {[
              ["3+", "Facultades"],
              ["200+", "Miembros"],
              ["8", "Módulos"],
            ].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--purple)", lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "3px", fontWeight: 500 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── DERECHA — Formulario ────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 56px", borderLeft: "1px solid rgba(124,58,237,0.08)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)" }}>
        <div style={{ width: "100%", maxWidth: "420px" }} className="anim-up">
          <p style={{ fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--purple)", fontWeight: 700, marginBottom: "8px" }}>{modo === "login" ? "— Acceso" : "— Registro"}</p>

          <h2 style={{ fontSize: "44px", fontWeight: 900, letterSpacing: "-2px", color: "var(--ink)", marginBottom: "36px", lineHeight: 1 }}>{modo === "login" ? "Bienvenida\nde vuelta." : "Crea tu\ncuenta."}</h2>

          {/* Toggle tab */}
          <div className="glass" style={{ display: "flex", padding: "5px", borderRadius: "18px", marginBottom: "30px" }}>
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModo(m);
                  setMensaje(null);
                }}
                style={{ flex: 1, padding: "12px", borderRadius: "13px", fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all .25s", background: modo === m ? "linear-gradient(135deg,var(--purple),#4F46E5)" : "transparent", color: modo === m ? "#fff" : "var(--muted)", boxShadow: modo === m ? "0 4px 20px var(--purple-glow)" : "none" }}
              >
                {m === "login" ? "Ingresar" : "Registrarse"}
              </button>
            ))}
          </div>

          {error && <div style={{ padding: "14px 18px", borderRadius: "14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#C53030", fontSize: "15px", marginBottom: "20px" }}>⚠ {error}</div>}
          {mensaje && <div style={{ padding: "14px 18px", borderRadius: "14px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.18)", color: "var(--blue)", fontSize: "15px", marginBottom: "20px" }}>✓ {mensaje}</div>}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {modo === "register" && (
              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Nombre completo
                <input type="text" placeholder="Ej. María Mosquera" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inpStyle} onFocus={focIn} onBlur={focOut} />
              </label>
            )}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Correo electrónico
              <input type="email" placeholder="correo@upb.edu.co" value={email} onChange={(e) => setEmail(e.target.value)} required style={inpStyle} onFocus={focIn} onBlur={focOut} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Contraseña
              <input type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={inpStyle} onFocus={focIn} onBlur={focOut} />
            </label>

            <button
              type="submit"
              disabled={cargando}
              style={{ width: "100%", padding: "17px", marginTop: "8px", borderRadius: "18px", border: "none", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: cargando ? "not-allowed" : "pointer", opacity: cargando ? 0.6 : 1, transition: "all .25s", background: "linear-gradient(135deg, var(--purple) 0%, #4F46E5 50%, var(--blue) 100%)", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}
              onMouseEnter={(e) => {
                if (!cargando) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 14px 44px rgba(124,58,237,0.45)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.35)";
              }}
            >
              {cargando ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span className="anim-spin" style={{ width: "18px", height: "18px", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                  Cargando...
                </span>
              ) : modo === "login" ? (
                "Ingresar →"
              ) : (
                "Crear cuenta ✦"
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)", marginTop: "28px", lineHeight: 1.5 }}>
            Universidad Pontificia Bolivariana
            <br />
            <span style={{ color: "var(--purple)", fontWeight: 600 }}>Comunidad Afro Digital</span>
          </p>
        </div>
      </div>
      <style>{`input::placeholder{color:#BDB5CC;} input{font-size:16px;}`}</style>
    </div>
  );
}

const inpStyle = {
  width: "100%",
  padding: "15px 18px",
  borderRadius: "14px",
  fontSize: "16px",
  border: "1.5px solid rgba(124,58,237,0.15)",
  outline: "none",
  transition: "all .2s",
  background: "rgba(255,255,255,0.80)",
  color: "#1A1523",
  fontFamily: "inherit",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};
const focIn = (e) => {
  e.target.style.borderColor = "var(--purple)";
  e.target.style.boxShadow = "0 0 0 4px rgba(124,58,237,0.12)";
  e.target.style.background = "rgba(255,255,255,0.95)";
};
const focOut = (e) => {
  e.target.style.borderColor = "rgba(124,58,237,0.15)";
  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
  e.target.style.background = "rgba(255,255,255,0.80)";
};
