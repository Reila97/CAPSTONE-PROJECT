import { Routes, Route, Navigate } from "react-router-dom";

import MyNav from "./COMPONENTS/Navbar/MyNav.jsx";
import AllUser from "./COMPONENTS/User/AllUser.jsx";
import User from "./COMPONENTS/User/User.jsx";
import StruttureClient from "./COMPONENTS/Strutture/StruttureClient.jsx";
import AdminStrutture from "./COMPONENTS/Strutture/StruttureAdmin.jsx";

import Home from "./PAGES/Home/Home.jsx";
import Login from "./PAGES/Login/Login.jsx";

import { AuthProvider, useAuth } from "./CONTEXT/IsAdmin.jsx";
import StrutturaDettaglio from "./COMPONENTS/Strutture/StrutturaDettaglio.jsx";


// --- PROTEZIONE ROTTE ADMIN ---
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/profilo" replace />;
  }
  return children;
};

// --- PROTEZIONE ROTTE UTENTE (Opzionale ma consigliato) ---
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
};


function App() {
  return (
    <>
    <AuthProvider>


      <MyNav /> //TODO sistemare nav per admin, client e public
      
      <Routes>
        {/* PUBBLICHE */}
        <Route path="/" element={<Login />} />
        <Route path="/strutture" element={<StruttureClient />} />
        <Route path="/strutture/:id" element={<StrutturaDettaglio />} />

        {/* UTENTE LOGGATO */}
        <Route path="/home" element={<Home />} />
        <Route path="/profilo" element={
          <PrivateRoute>
            <User />
          </PrivateRoute>} 
          />
        

        {/* ADMIN */}
        <Route path="/admin/users" element={
          <AdminRoute>
          <AllUser/>
          </AdminRoute>}
        />

        <Route path="/admin/strutture" element={
          <AdminRoute>
            <AdminStrutture />
          </AdminRoute>
        } />

        {/* Fallback per pagine inesistenti */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* //TODO footer */}



      </AuthProvider>
    </>
  );
}

export default App;

