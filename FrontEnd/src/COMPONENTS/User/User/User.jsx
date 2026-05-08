import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  Calendar3,
  StarFill,
  CalendarCheck,
  Envelope,
} from "react-bootstrap-icons";

import EditProfile from "../../Button/EditProfile";
import DeleteProfile from "../../Button/DeleteProfile";
import "./user.css";

function User() {
  const [userData, setUserData] = useState(null);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [recensioni, setRecensioni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUserUpdate = (newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // 1. Fetch dei dati utente
        const userRes = await fetch("http://localhost:3002/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Sessione scaduta o non valida");
        const userDataFetched = await userRes.json();
        setUserData(userDataFetched);
        localStorage.setItem("user", JSON.stringify(userDataFetched));

        //TODO 2. Fetch delle prenotazioni e delle recensioni in parallelo
        const [prenotazioniRes, recensioniRes] = await Promise.all([
          fetch(
            `http://localhost:3002/prenotazioni/user/${userDataFetched._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          fetch(
            `http://localhost:3002/recensioni/user/${userDataFetched._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
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
        setError(err.message);
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}. Reindirizzamento...</Alert>
      </Container>
    );

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* SIDEBAR: INFO UTENTE */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm text-center p-4 h-100">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="mb-3 d-flex justify-content-center">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="rounded-circle shadow-sm border"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    /* Fallback: se non c'è la foto, mostriamo le iniziali */
                    <div
                      className="user-avatar-sm d-flex align-items-center justify-content-center fw-bold fs-3 rounded-circle bg-dark text-white shadow-sm"
                      style={{ width: "100px", height: "100px" }}
                    >
                      {userData.nome?.charAt(0)}
                      {userData.cognome?.charAt(0)}
                    </div>
                  )}
                </div>

                <h4 className="fw-bold mb-1">
                  {userData.nome} {userData.cognome}
                </h4>
                <div className="mb-3">
                  {userData.isAdmin ? (
                    <Badge
                      bg="danger"
                      className="px-3 py-2 rounded-pill fw-normal"
                    >
                      Amministratore
                    </Badge>
                  ) : (
                    <Badge
                      bg="dark"
                      className="px-3 py-2 rounded-pill fw-normal"
                    >
                      Cliente
                    </Badge>
                  )}
                </div>

                <hr className="my-4 text-muted opacity-25" />

                <div className="text-start">
                  <h6 className="text-muted small fw-bold mb-3 text-uppercase">
                    Informazioni Account
                  </h6>
                  <p className="mb-2 text-truncate">
                    <Envelope className="me-2 text-secondary" />
                    <strong>Email:</strong>
                    <br />
                    <span className="ms-4 text-muted">{userData.email}</span>
                  </p>
                  <p className="mb-3">
                    <Calendar3 className="me-2 text-secondary" />
                    <strong>Data Nascita:</strong>
                    <br />
                    <span className="ms-4 text-muted">
                      {userData.dataDiNascita
                        ? new Date(userData.dataDiNascita).toLocaleDateString()
                        : "Non specificata"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mt-4">
                <EditProfile user={userData} onUpdate={handleUserUpdate} />
                <DeleteProfile
                  userId={userData._id}
                  userName={`${userData.nome} ${userData.cognome}`}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* CONTENUTO PRINCIPALE: PRENOTAZIONI E RECENSIONI */}
        <Col lg={8}>
          <Row className="g-4">
            {/* STATISTICHE VELOCI */}
            <Col md={6}>
              <Card className="border-0 shadow-sm p-3 text-center bg-white h-100">
                <Card.Body>
                  <CalendarCheck size={32} className="text-secondary mb-2" />
                  <h3 className="fw-bold mb-1">{prenotazioni.length}</h3>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">
                    Prenotazioni effettuate
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm p-3 text-center bg-white h-100">
                <Card.Body>
                  <StarFill size={32} className="text-warning mb-2" />
                  <h3 className="fw-bold mb-1">{recensioni.length}</h3>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">
                    Recensioni lasciate
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* SEZIONE LISTE */}
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Le tue Recensioni</h5>

                  {recensioni.length === 0 ? (
                    <p className="text-muted my-3">
                      Non hai ancora lasciato alcuna recensione.
                    </p>
                  ) : (
                    <ListGroup variant="flush">
                      {recensioni.map((recensione) => (
                        <ListGroup.Item
                          key={recensione._id}
                          className="px-0 py-3 border-bottom-dashed"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="fw-bold text-dark">
                              {recensione.strutturaId?.nome || "Struttura"}
                            </span>
                            <span className="text-warning d-flex align-items-center gap-1">
                              {Array.from({ length: recensione.voto || 5 }).map(
                                (_, i) => (
                                  <StarFill key={i} size={12} />
                                ),
                              )}
                            </span>
                          </div>
                          <p className="text-muted small mb-1">
                            "{recensione.commento}"
                          </p>
                          <small className="text-muted opacity-75">
                            Data:{" "}
                            {new Date(
                              recensione.createdAt,
                            ).toLocaleDateString()}
                          </small>
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
