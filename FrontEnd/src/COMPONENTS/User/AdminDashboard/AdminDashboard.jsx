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
import ServiziAdmin from"../../Servizi/ServiziAdmin/ServiziAdmin.jsx"
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

  const handleUserUpdate = useCallback((newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  }, []);

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
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          
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
      <div className="d-flex justify-content-center align-items-center vh-100 v-fenix-loading-screen">
        <div className="text-center">
          <Spinner animation="border" className="spinner-fenix-dashboard" />
          <p className="mt-3 text-muted tracking-wider text-uppercase small">Verifica autorizzazioni...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="border-0 shadow-sm v-fenix-alert">
          <ShieldCheck className="me-2" size={18} />
          {error}. Reindirizzamento alla pagina di login...
        </Alert>
      </Container>
    );

  return (
    <Container fluid className="px-4 py-4 v-fenix-dashboard-container">
      
      {/* Intestazione Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header-block">
        <div>
          <h2 className="fw-bold mb-0 v-fenix-dashboard-title">
            Pannello di Controllo <small className="title-sub-role">Administrator</small>
          </h2>
        </div>
        <Badge bg="none" className="badge-fenix-status">
          <ShieldCheck className="me-1" size={14} /> ACCOUNT ATTIVO
        </Badge>
      </div>
      
      <Tab.Container id="admin-tabs" defaultActiveKey="profilo">
        <Row className="gy-4">
          
          {/* Sidebar Left di Navigazione */}
          <Col lg={3}>
            <Card className="border-0 shadow-sm sticky-top sidebar-fenix-card">
              <Card.Body className="p-0">
                
                {/* Profilo Header Mini */}
                <div className="profile-header-widget text-center">
                    <div className="profile-avatar-circle mb-3 mx-auto shadow-sm">
                        <span className="initials fw-bold">
                            {userData.nome?.charAt(0)}{userData.cognome?.charAt(0)}
                        </span>
                    </div>
                    <h5 className="mb-1 fw-bold profile-widget-name">{userData.nome} {userData.cognome}</h5>
                    <Badge bg="none" className="badge-fenix-role text-uppercase">
                        Amministratore
                    </Badge>
                </div>
                
                {/* Menu Pills */}
                <Nav variant="pills" className="flex-column p-2 admin-nav-pills">
                  <Nav.Link eventKey="profilo" className="d-flex align-items-center gap-3 py-2.5 px-3">
                    <Person size={18} /> Il Mio Profilo
                  </Nav.Link>
                  <Nav.Link eventKey="strutture" className="d-flex align-items-center gap-3 py-2.5 px-3">
                    <House size={18} /> Gestione Strutture
                  </Nav.Link>
                  <Nav.Link eventKey="camere" className="d-flex align-items-center gap-3 py-2.5 px-3">
                    <DoorOpen size={18} /> Gestione Camere
                  </Nav.Link>
                  <Nav.Link eventKey="servizi" className="d-flex align-items-center gap-3 py-2.5 px-3">
                    <Gear size={18} /> Gestione Servizi
                  </Nav.Link>
                  <Nav.Link eventKey="utenti" className="d-flex align-items-center gap-3 py-2.5 px-3">
                    <People size={18} /> Gestione Utenti
                  </Nav.Link>
                  <Nav.Link eventKey="prenotazioni" className="d-flex align-items-center gap-3 py-2.5 px-3">
                    <CalendarDate size={18} /> Prenotazioni
                  </Nav.Link>
                  
                  <div className="nav-divider my-2 mx-3" />
                  
                  <Nav.Link onClick={handleLogout} className="nav-logout-btn d-flex align-items-center gap-3 py-2.5 px-3">
                    <BoxArrowRight size={18} /> Esci dalla sessione
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Area Contenuto Dinamica (Right) */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm main-content-fenix-card">
              <Card.Body className="p-4 p-md-5">
                <Tab.Content>
                  
                  {/* Sezione Profilo Personale */}
                  <Tab.Pane eventKey="profilo" className="fade show">
                    <h4 className="fw-bold mb-4 content-section-title">Dettagli Account SuperUser</h4>
                    <Row className="gy-4">
                        <Col md={6}>
                            <div className="p-3 info-box-profile">
                                <span className="info-box-label">Email Aziendale</span>
                                <p className="fw-bold mb-0 info-box-value text-truncate">{userData.email}</p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="p-3 info-box-profile">
                                <span className="info-box-label">Data di Nascita</span>
                                <p className="fw-bold mb-0 info-box-value">
                                    {userData.dataDiNascita ? new Date(userData.dataDiNascita).toLocaleDateString('it-IT') : "Non configurata"}
                                </p>
                            </div>
                        </Col>
                    </Row>
                    
                    {/* Bottoni Azione Profilo */}
                    <div className="d-flex gap-3 mt-5 profile-actions-group">
                        <EditProfile user={userData} onUpdate={handleUserUpdate} />
                        <DeleteProfile userId={userData._id} userName={`${userData.nome} ${userData.cognome}`} />
                    </div>
                  </Tab.Pane>

                  {/* Componenti Esterni */}
                  <Tab.Pane eventKey="camere" className="fade">
                    <CamereAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="servizi" className="fade">
                    <ServiziAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="strutture" className="fade">
                    <StruttureAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="utenti" className="fade">
                    <UserAdmin />
                  </Tab.Pane>

                  <Tab.Pane eventKey="prenotazioni" className="fade">
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