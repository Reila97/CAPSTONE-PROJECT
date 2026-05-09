// Esempio di componente LoginSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../CONTEXT/IsAdmin";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_BACK_END;

function LoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // 1. Estrai il token dai parametri dell'URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const handleGoogleAuth = async () => {
        try {
          const decoded = jwtDecode(token);
          
          // 2. Recupera i dati utente completi (come fai nel login normale)
          const res = await fetch(`${API_URL}/users/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const userData = await res.json();
            
            // 3. Salva nel Context e nel LocalStorage tramite la tua funzione login
            login(userData, token);

            // 4. Naviga verso la destinazione corretta
            if (userData.ruolo === "ADMIN" || userData.isAdmin) {
              navigate("/admin");
            } else {
              navigate("/profilo");
            }
          }
        } catch (err) {
          console.error("Errore recupero dati Google Login:", err);
          navigate("/login");
        }
      };

      handleGoogleAuth();
    } else {
      navigate("/login");
    }
  }, [location, navigate, login]);

  return <div>Accesso in corso...</div>;
}

export default LoginSuccess;