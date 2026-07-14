import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute      from './components/shared/ProtectedRoute';
import LoginView           from './views/LoginView';
import FeedView            from './views/FeedView';
import ProfileView         from './views/ProfileView';
import CommunityView       from './views/CommunityView';
import EventsView          from './views/EventsView';
import AchievementsView    from './views/AchievementsView';

const Pronto = ({ nombre }) => (
  <div style={{ marginLeft:'90px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:'12px', fontFamily:'sans-serif', color:'#fff', background:'#09090F' }}>
    <span style={{ fontSize:'48px' }}>🚧</span>
    <p style={{ fontSize:'22px', fontWeight:700 }}>{nombre}</p>
    <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.40)' }}>Vista en construcción</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/"      element={<Navigate to="/feed" replace />} />

        <Route path="/feed"         element={<ProtectedRoute><FeedView /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
        <Route path="/community"    element={<ProtectedRoute><CommunityView /></ProtectedRoute>} />
        <Route path="/events"       element={<ProtectedRoute><EventsView /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AchievementsView /></ProtectedRoute>} />
        <Route path="/map"          element={<ProtectedRoute><Pronto nombre="Mapa territorial" /></ProtectedRoute>} />
        <Route path="/moderation"   element={<ProtectedRoute role="moderator"><Pronto nombre="Panel de moderación" /></ProtectedRoute>} />

        <Route path="*" element={
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:'8px', fontFamily:'sans-serif', background:'#09090F', color:'#fff' }}>
            <p style={{ fontSize:'72px', fontWeight:900, color:'#7C3AED', lineHeight:1 }}>404</p>
            <p style={{ fontSize:'17px', color:'rgba(255,255,255,0.40)' }}>Esta página no existe</p>
            <a href="/feed" style={{ color:'#A78BFA', fontSize:'15px', marginTop:'8px' }}>← Volver al feed</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}