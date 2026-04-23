import { Routes, Route, Navigate } from "react-router-dom";
import MyNav from "./COMPONENTS/Navbar/MyNav.jsx";
import Home from "./PAGES/Home/Home.jsx";
import User from "./PAGES/User/User.jsx";
import Login from "./PAGES/Login/Login.jsx";

// --- 1. DEFINIZIONE DI ADMINROUTE ---
// Questo componente protegge le rotte riservate agli admin
const AdminRoute = ({ children, user }) => {
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  // --- 2. RECUPERO DATI UTENTE ---
  // Qui andrai a prendere i dati dal tuo sistema di autenticazione
  // Esempio con localStorage:
  const userData = JSON.parse(localStorage.getItem('user')); 

  return (
    <>
      <MyNav />
      
      <Routes>
        {/* Rotte Pubbliche */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profilo" element={<User />} />
        <Route path="/strutture" element={<User />} />

        {/* --- 3. ROTTA ADMIN PROTETTA --- */}
        <Route
          path="/admin"
          element={
            <AdminRoute user={userData}>
              {/* Qui inserisci il componente della Dashboard Admin */}
              <div className="container mt-5"><h1>Pannello Admin</h1></div>
            </AdminRoute>
          }
        />

        {/* Fallback per pagine inesistenti */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* //TODO footer */}
    </>
  );
}

export default App;

//TODO context stato globale