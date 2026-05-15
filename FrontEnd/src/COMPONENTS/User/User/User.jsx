import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
  ListGroup,
  Image
} from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  Calendar3,
  StarFill,
  CalendarCheck,
  Envelope,
  PersonBadge
} from "react-bootstrap-icons";

import EditProfile from "../../Button/EditProfile";
import DeleteProfile from "../../Button/DeleteProfile";
import "./User.css";

const API_URL = import.meta.env.VITE_BACK_END;

function User() {
  const [userData, setUserData] = useState(null);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [recensioni, setRecensioni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUserUpdate = useCallback((newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  }, []);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setIsLoading(true);
      // 1. Fetch dei dati utente tramite rotta protetta
      const userRes = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Sessione scaduta o non valida");
      
      const userDataFetched = await userRes.json();
      setUserData(userDataFetched);
      localStorage.setItem("user", JSON.stringify(userDataFetched));

      // 2. Fetch parallela di prenotazioni e recensioni
      const [prenotazioniRes, recensioniRes] = await Promise.all([
        fetch(`${API_URL}/prenotazioni/user/${userDataFetched._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/recensioni/user/${userDataFetched._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (prenotazioniRes.ok) {
        const pData = await prenotazioniRes.json();
        setPrenotazioni(Array.isArray(pData) ? pData : []);
      }

      if (recensioniRes.ok) {
        const rData = await recensioniRes.json();
        setRecensioni(Array.isArray(rData) ? rData : []);
      }
    } catch (err) {
      console.error("Errore profilo:", err);
      setError(err.message);
      // Logout forzato se il token è invalido
      localStorage.removeItem("token");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (isLoading)
    return (
      <Container className="text-center py-5 vh-100 d-flex flex-column justify-content-center">
        <Spinner animation="grow" variant="primary" />
        <p className="mt-3 text-muted">Caricamento profilo...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="shadow-sm border-0">
          <strong>Oops!</strong> {error}. Reindirizzamento...
        </Alert>
      </Container>
    );

  return (
    <Container className="py-5 bodyCopy">
      <Row className="g-4">
        {/* SIDEBAR: INFO UTENTE */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm text-center p-4 h-100 rounded-4">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <div className="mb-3 d-flex justify-content-center">
                  {userData.avatar ? (
                    <Image
                      src={userData.avatar}
                      alt="Avatar"
                      roundedCircle
                      className="shadow-sm border border-3 border-light"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="user-avatar-initials d-flex align-items-center justify-content-center fw-bold fs-2 rounded-circle bg-primary text-white shadow-sm"
                      style={{ width: "120px", height: "120px" }}
                    >
                      {userData.nome?.[0]}{userData.cognome?.[0]}
                    </div>
                  )}
                </div>

                <h3 className="fw-bold mb-1">
                  {userData.nome} {userData.cognome}
                </h3>
                <div className="mb-3">
                  <Badge
                    bg={userData.isAdmin ? "danger" : "dark"}
                    className="px-3 py-2 rounded-pill fw-medium"
                  >
                    {userData.isAdmin ? "Amministratore" : "Cliente Fenix"}
                  </Badge>
                </div>

                <hr className="my-4 opacity-10" />

                <div className="text-start bg-light p-3 rounded-3">
                  <h6 className="text-muted small fw-bold mb-3 text-uppercase letter-spacing-1">
                    Dettagli Account
                  </h6>
                  <div className="mb-3">
                    <div className="d-flex align-items-center text-dark small fw-bold">
                       <Envelope className="me-2 text-primary" /> Email
                    </div>
                    <div className="ms-4 text-muted text-truncate">{userData.email}</div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center text-dark small fw-bold">
                       <Calendar3 className="me-2 text-primary" /> Compleanno
                    </div>
                    <div className="ms-4 text-muted">
                      {userData.dataDiNascita
                        ? new Date(userData.dataDiNascita).toLocaleDateString('it-IT', { 
                            day: 'numeric', month: 'long', year: 'numeric' 
                          })
                        : "Non specificata"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <EditProfile user={userData} onUpdate={handleUserUpdate} />
                <DeleteProfile
                  userId={userData._id}
                  userName={`${userData.nome} ${userData.cognome}`}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* CONTENUTO PRINCIPALE */}
        <Col lg={8}>
          <Row className="g-4">
            {/* STATS */}
            <Col sm={6}>
              <Card className="border-0 shadow-sm p-3 bg-white h-100 rounded-4 border-start border-primary border-4">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-light p-3 rounded-circle me-3">
                    <CalendarCheck size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{prenotazioni.length}</h3>
                    <p className="text-muted mb-0 small text-uppercase fw-bold">Soggiorni</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6}>
              <Card className="border-0 shadow-sm p-3 bg-white h-100 rounded-4 border-start border-warning border-4">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-light p-3 rounded-circle me-3">
                    <StarFill size={24} className="text-warning" />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{recensioni.length}</h3>
                    <p className="text-muted mb-0 small text-uppercase fw-bold">Feedback</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* RECENSIONI */}
            <Col md={12}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white py-3 border-0">
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <PersonBadge className="me-2 text-primary" /> Le tue Recensioni
                  </h5>
                </Card.Header>
                <Card.Body className="px-4 pb-4">
                  {recensioni.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">Non hai ancora condiviso la tua esperienza.</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {recensioni.map((rec) => (
                        <ListGroup.Item key={rec._id} className="px-0 py-4 border-bottom">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="fw-bold mb-1">
                                {rec.strutturaId?.nome || "Struttura Villa Fenix"}
                              </h6>
                              <div className="text-warning">
                                {[...Array(5)].map((_, i) => (
                                  <StarFill 
                                    key={i} 
                                    size={14} 
                                    className={i < (rec.voto || 5) ? "text-warning" : "text-light"} 
                                  />
                                ))}
                              </div>
                            </div>
                            <small className="text-muted fw-medium">
                              {new Date(rec.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="text-secondary italic mb-0">
                            <span className="fs-4 lh-1 opacity-25">“</span>
                            {rec.commento}
                            <span className="fs-4 lh-1 opacity-25">”</span>
                          </p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default User;