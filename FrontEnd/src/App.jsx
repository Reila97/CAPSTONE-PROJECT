import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./CONTEXT/IsAdmin.jsx";

import Home from "./PAGES/Home/Home.jsx";
import Login from "./PAGES/Login/Login.jsx";

import MyNav from "./COMPONENTS/Navbar/MyNav.jsx";
import User from "./COMPONENTS/User/User/User.jsx";
import UserAdmin from "./COMPONENTS/User/UserAdmin/UserAdmin.jsx";
import StruttureClient from "./COMPONENTS/Strutture/Struttura Clienti/StruttureClient.jsx";
import AdminStrutture from "./COMPONENTS/Strutture/StruttureAdmin.jsx";
import StrutturaDettaglio from "./COMPONENTS/Strutture/Struttura Dettaglio/StrutturaDettaglio.jsx";
import AdminDashboard from "./COMPONENTS/User/AdminDashboard/AdminDashboard.jsx";
import CameraDettaglio from "./COMPONENTS/Camere/CameraDettaglio/CameraDettaglio.jsx";
import CamereClient from "./COMPONENTS/Camere/CamereClient/CamereClient.jsx";
import Footer from "./COMPONENTS/Footer/Footer.jsx";
import LoginSuccess from "./PAGES/Login/LoginSuccess.jsx";
import WhatsappButton from "./COMPONENTS/Button/WhatsappButton.jsx";

// --- PROTEZIONE ROTTE ADMIN ---
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/profilo" replace />;
  }
  return children;
};

// --- PROTEZIONE ROTTE UTENTE  ---
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <AuthProvider>
        <MyNav />

        <Routes>
          {/* PUBBLICHE */}

          <Route path="/" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/home" element={<Home />} />

          <Route path="/strutture" element={<StruttureClient />} />
          <Route path="/strutture/:id" element={<StrutturaDettaglio />} />

          <Route path="/camere" element={<CamereClient />} />
          <Route path="/camere/:id" element={<CameraDettaglio />} />

          {/* UTENTE LOGGATO */}
          <Route
            path="/profilo"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />

          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback per pagine inesistenti */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

         {/* <WhatsappButton/> */}


        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
