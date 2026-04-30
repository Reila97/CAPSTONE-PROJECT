import { useEffect, useState } from "react";
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

import EditProfile from "../../Button/EditProfile";
import DeleteProfile from "../../Button/DeleteProfile";

import StruttureAdmin from "../../Strutture/StruttureAdmin.jsx"
import UserAdmin from"../UserAdmin/UserAdmin.jsx"
import CamereAdmin from "../../Camere/CamereAdmin/CamereAdmin.jsx";
import ServiziAdmin from "../../Servizi/ServiziAdmin.jsx"


import "./AdminDashboard.css";

function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUserUpdate = (newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:3002/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          throw new Error("Sessione scaduta");
        }
      } catch (err) {
        setError(err.message);
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}. Reindirizzamento...
        </Alert>
      </Container>
    );

  return (
    <Container fluid className="mt-4 px-4 bodyCopy">
      <h2 className="mb-4 fw-bold text-dark">Pannello di Controllo <small className="text-muted fs-6">Admin</small></h2>
      
      <Tab.Container id="admin-tabs" defaultActiveKey="profilo">
        <Row>
          {/* Sidebar di Navigazione */}
          <Col lg={3} mb={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-0">
                <div className="bg-dark text-white p-4 text-center rounded-top">
                    <div className="profile-avatar-circle mb-3 mx-auto shadow">
                        <span className="initials">
                            {userData.nome?.charAt(0)}{userData.cognome?.charAt(0)}
                        </span>
                    </div>
                    <h5 className="mb-0">{userData.nome} {userData.cognome}</h5>
                    <Badge bg="warning" text="dark" className="mt-2 text-uppercase">
                        {userData.ruolo}
                    </Badge>
                </div>
                
                <Nav variant="pills" className="flex-column p-3 custom-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="camere" className="py-3">Gestione Camere</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="servizi" className="py-3">Gestione Servizi</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="strutture" className="py-3">Gestione Strutture</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="utenti" className="py-3">Gestione Utenti</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Area Contenuto */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm min-vh-75">
              <Card.Body className="p-4">
                <Tab.Content>
                  
                  {/* Sezione Profilo */}
                  <Tab.Pane eventKey="profilo">
                    <h4 className="mb-4">Informazioni Account</h4>
                    <Row>
                        <Col md={6}>
                            <p className="mb-1 text-muted small">Indirizzo Email</p>
                            <p className="fw-bold">{userData.email}</p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-1 text-muted small">Data di Nascita</p>
                            <p className="fw-bold">
                                {userData.dataDiNascita ? new Date(userData.dataDiNascita).toLocaleDateString() : "Non specificata"}
                            </p>
                        </Col>
                    </Row>
                    <hr />
                    <div className="d-flex gap-2 mt-4">
                        <EditProfile user={userData} onUpdate={handleUserUpdate} />
                        <DeleteProfile userId={userData._id} userName={`${userData.nome} ${userData.cognome}`} />
                    </div>
                  </Tab.Pane>

                  {/* Sezione Camere */}
                  <Tab.Pane eventKey="camere">
                    <h4 className="mb-4">Elenco e Gestione Camere</h4>
                    <div className="p-5 text-center bg-light rounded"><CamereAdmin/></div>
                  </Tab.Pane>

                  {/* Sezione Servizi */}
                  <Tab.Pane eventKey="servizi">
                    <h4 className="mb-4">Elenco e Gestione Servizi</h4>
                    <div className="p-5 text-center bg-light rounded"><ServiziAdmin/></div>
                  </Tab.Pane>

                  {/* Sezione Strutture */}
                  <Tab.Pane eventKey="strutture">
                    <h4 className="mb-4">Elenco e Gestione Strutture</h4>
                    <div className="p-5 text-center bg-light rounded"><StruttureAdmin/></div>
                  </Tab.Pane>

                  {/* Sezione Utenti */}
                  <Tab.Pane eventKey="utenti">
                    <h4 className="mb-4">Anagrafica Utenti di Sistema</h4>
                    <div className="p-5 text-center bg-light rounded"><UserAdmin/></div>
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