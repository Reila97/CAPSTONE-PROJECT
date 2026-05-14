import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
  Tab,
  Nav,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { 
  Person, 
  House, 
  DoorOpen, 
  Gear, 
  People, 
  ShieldCheck,
  BoxArrowRight,
  CalendarDate 
} from "react-bootstrap-icons";

// Componenti Admin
import StruttureAdmin from "../../Strutture/StruttureAdmin.jsx";
import UserAdmin from "../UserAdmin/UserAdmin.jsx";
import CamereAdmin from "../../Camere/CamereAdmin/CamereAdmin.jsx";
import ServiziAdmin from "../../Servizi/ServiziAdmin.jsx";
import PrenotazioniAdmin from "../../Prenotazioni/PrenotazioniAdmin.jsx";

// Bottoni Azione Profilo
import EditProfile from "../../Button/EditProfile";
import DeleteProfile from "../../Button/DeleteProfile";

import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_BACK_END;

function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Memoizzazione dell'aggiornamento per evitare render non necessari
  const handleUserUpdate = useCallback((newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  }, []);

  // 2. Funzione di Logout centralizzata
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        // Utilizzo di API_URL e backticks per l'endpoint corretto
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          
          // LOGICA RICHIESTA: Verifica che isAdmin sia strettamente true
          if (data.isAdmin !== true) {
            throw new Error("Accesso negato: non sei un amministratore");
          }
          
          setUserData(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          throw new Error("Sessione scaduta o non valida");
        }
      } catch (err) {
        setError(err.message);
        // Pulizia token se la sessione è invalida
        localStorage.removeItem("token");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Verifica autorizzazioni...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="shadow-sm border-0">
          <ShieldCheck className="me-2" />
          {error}. Reindirizzamento in corso...
        </Alert>
      </Container>
    );

  return (
    <Container fluid className="mt-4 px-4 pb-5 bodyCopy">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">
          Pannello di Controllo <small className="text-muted fs-6 fw-normal">Administrator</small>
        </h2>
        <Badge bg="dark" className="p-2 px-3 shadow-sm">
          <ShieldCheck className="me-1" /> ONLINE
        </Badge>
      </div>
      
      <Tab.Container id="admin-tabs" defaultActiveKey="profilo">
        <Row className="gy-4">
          {/* Sidebar di Navigazione */}
          <Col lg={3}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
              <Card.Body className="p-0">
                <div className="bg-primary text-white p-4 text-center rounded-top">
                    <div className="profile-avatar-circle mb-3 mx-auto shadow-lg border border-2 border-white">
                        <span className="initials fs-4 fw-bold">
                            {userData.nome?.charAt(0)}{userData.cognome?.charAt(0)}
                        </span>
                    </div>
                    <h5 className="mb-1 fw-bold">{userData.nome} {userData.cognome}</h5>
                    <Badge bg="light" text="dark" className="text-uppercase tracking-wider">
                        {userData.isAdmin ? "Amministratore" : "User"}
                    </Badge>
                </div>
                
                <Nav variant="pills" className="flex-column p-2 admin-nav">
                  <Nav.Link eventKey="profilo" className="d-flex align-items-center gap-2 py-3">
                    <Person /> Il Mio Profilo
                  </Nav.Link>
                  <Nav.Link eventKey="strutture" className="d-flex align-items-center gap-2 py-3">
                    <House /> Gestione Strutture
                  </Nav.Link>
                  <Nav.Link eventKey="camere" className="d-flex align-items-center gap-2 py-3">
                    <DoorOpen /> Gestione Camere
                  </Nav.Link>
                  <Nav.Link eventKey="servizi" className="d-flex align-items-center gap-2 py-3">
                    <Gear /> Gestione Servizi
                  </Nav.Link>
                  <Nav.Link eventKey="utenti" className="d-flex align-items-center gap-2 py-3">
                    <People /> Gestione Utenti
                  </Nav.Link>
                  <Nav.Link eventKey="prenotazioni" className="d-flex align-items-center gap-2 py-3">
                    <CalendarDate /> Prenotazioni
                  </Nav.Link>
                  <hr className="mx-3 my-2" />
                  <Nav.Link onClick={handleLogout} className="text-danger d-flex align-items-center gap-2 py-3">
                    <BoxArrowRight /> Esci
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Area Contenuto */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm min-vh-75 overflow-hidden">
              <Card.Body className="p-4 p-md-5">
                <Tab.Content>
                  
                  {/* Sezione Profilo */}
                  <Tab.Pane eventKey="profilo">
                    <h4 className="fw-bold mb-4 border-bottom pb-2">Dettagli Account</h4>
                    <Row className="gy-4">
                        <Col md={6}>
                            <div className="p-3 bg-light rounded-3 border">
                                <p className="mb-1 text-muted small text-uppercase">Email Aziendale</p>
                                <p className="fw-bold mb-0 text-truncate">{userData.email}</p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="p-3 bg-light rounded-3 border">
                                <p className="mb-1 text-muted small text-uppercase">Data di Nascita</p>
                                <p className="fw-bold mb-0">
                                    {userData.dataDiNascita ? new Date(userData.dataDiNascita).toLocaleDateString() : "Dato mancante"}
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex gap-3 mt-5">
                        <EditProfile user={userData} onUpdate={handleUserUpdate} />
                        <DeleteProfile userId={userData._id} userName={`${userData.nome} ${userData.cognome}`} />
                    </div>
                  </Tab.Pane>

                  {/* Sezioni Gestionali - Caricate solo quando selezionate */}
                  <Tab.Pane eventKey="camere">
                    <CamereAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="servizi">
                    <ServiziAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="strutture">
                    <StruttureAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="utenti">
                    <UserAdmin />
                  </Tab.Pane>

                   <Tab.Pane eventKey="prenotazioni">
                    <PrenotazioniAdmin />
                  </Tab.Pane>

                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AdminDashboard;