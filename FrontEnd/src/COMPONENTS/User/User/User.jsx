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
      setError(null);

      const userRes = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Sessione scaduta o non valida");
      
      const userDataFetched = await userRes.json();
      setUserData(userDataFetched);
      localStorage.setItem("user", JSON.stringify(userDataFetched));

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
      <Container className="text-center py-5 vh-100 d-flex flex-column justify-content-center font-ubuntu">
        <Spinner animation="border" className="vf-spinner-brand" size="lg" />
        <p className="mt-3 text-muted small">Caricamento del tuo profilo Villa Fenix...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5 font-ubuntu">
        <Alert variant="danger" className="shadow-sm border-0 py-3">
          <strong>Oops!</strong> {error}. Verrai reindirizzato alla homepage...
        </Alert>
      </Container>
    );

  return (
    <Container className="py-5 font-ubuntu">
      <Row className="g-4">
        {/* SIDEBAR: INFO UTENTE */}
        <Col lg={4}>
          <Card className="shadow-sm text-center p-4 h-100 rounded-4 vf-profile-card">
            <Card.Body className="d-flex flex-column justify-content-between p-2">
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
                      className="vf-avatar-initials d-flex align-items-center justify-content-center fw-bold fs-2 rounded-circle shadow-sm"
                      style={{ width: "120px", height: "120px" }}
                    >
                      {userData.nome?.[0]}{userData.cognome?.[0]}
                    </div>
                  )}
                </div>

                <h3 className="vf-profile-name mb-2">
                  {userData.nome} {userData.cognome}
                </h3>
                
                <div className="mb-4">
                  <Badge
                    className={`px-3 py-2 rounded-pill fw-medium ${userData.isAdmin ? "vf-badge-admin" : "vf-badge-client"}`}
                  >
                    {userData.isAdmin ? "Amministratore" : "Cliente Fenix"}
                  </Badge>
                </div>

                <hr className="my-4 opacity-25" style={{ color: '#65513D' }} />

                <div className="text-start vf-account-details-box p-3">
                  <h6 className="vf-details-section-title text-uppercase mb-3 fw-bold">
                    Dettagli Account
                  </h6>
                  <div className="mb-3">
                    <div className="d-flex align-items-center text-dark small fw-bold mb-1">
                       <Envelope className="me-2 vf-profile-icon" size={14} /> Email
                    </div>
                    <div className="ms-4 text-muted small text-truncate">{userData.email}</div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center text-dark small fw-bold mb-1">
                       <Calendar3 className="me-2 vf-profile-icon" size={14} /> Data di nascita
                    </div>
                    <div className="ms-4 text-muted small">
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
            {/* STATS CARDS */}
            <Col sm={6}>
              <Card className="shadow-sm p-2 rounded-4 vf-profile-card vf-stat-card-soggiorni">
                <Card.Body className="d-flex align-items-center">
                  <div className="vf-stat-icon-wrapper p-3 rounded-circle me-3">
                    <CalendarCheck size={24} />
                  </div>
                  <div>
                    <h3 className="vf-stat-number mb-0">{prenotazioni.length}</h3>
                    <p className="text-muted mb-0 small text-uppercase fw-bold" style={{ letterSpacing: '0.3px' }}>Soggiorni Prenotati</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6}>
              <Card className="shadow-sm p-2 rounded-4 vf-profile-card vf-stat-card-feedback">
                <Card.Body className="d-flex align-items-center">
                  <div className="vf-stat-icon-wrapper-orange p-3 rounded-circle me-3">
                    <StarFill size={24} />
                  </div>
                  <div>
                    <h3 className="vf-stat-number mb-0">{recensioni.length}</h3>
                    <p className="text-muted mb-0 small text-uppercase fw-bold" style={{ letterSpacing: '0.3px' }}>Feedback Lasciati</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* LISTA RECENSIONI */}
            <Col md={12}>
              <Card className="shadow-sm rounded-4 overflow-hidden vf-profile-card">
                <Card.Header className="bg-white py-3 vf-reviews-card-header">
                  <h5 className="fw-bold mb-0 d-flex align-items-center h6 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    <PersonBadge className="me-2 vf-profile-icon" size={18} /> Cronologia Recensioni
                  </h5>
                </Card.Header>
                <Card.Body className="px-4 pb-4">
                  {recensioni.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted small mb-0">Non hai ancora condiviso recensioni sulle nostre strutture.</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {recensioni.map((rec) => (
                        <ListGroup.Item key={rec._id} className="px-0 py-4 bg-transparent">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="vf-review-item-title mb-1">
                                {rec.strutturaId?.nome || "Struttura Villa Fenix"}
                              </h6>
                              <div className="d-flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarFill 
                                    key={i} 
                                    size={13} 
                                    className={i < (rec.voto || 5) ? "vf-star-active" : "vf-star-inactive"} 
                                  />
                                ))}
                              </div>
                            </div>
                            <small className="text-muted fw-medium small">
                              {new Date(rec.createdAt).toLocaleDateString('it-IT')}
                            </small>
                          </div>
                          <p className="vf-quote-text small fst-italic mb-0 mt-2">
                            <span className="fs-5 fw-bold lh-1 opacity-25 me-1">“</span>
                            {rec.commento}
                            <span className="fs-5 fw-bold lh-1 opacity-25 ms-1">”</span>
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