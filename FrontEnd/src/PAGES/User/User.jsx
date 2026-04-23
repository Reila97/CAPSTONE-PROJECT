import { Card, Row, Col, ListGroup, Button, Badge, Spinner, Alert, Container } from "react-bootstrap";
import {
  Person,
  Envelope,
  Phone,
  CalendarCheck,
  PencilSquare,
} from "react-bootstrap-icons";
import "./User.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:3002/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          throw new Error("Sessione scaduta o non valida");
        }
      } catch (error) {
        setError(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (isLoading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  if (error) return <Alert variant="danger" className="mt-5">{error}. Verrai reindirizzato al login...</Alert>;

  return (
    <Card className="profile-card border-0 shadow-lg">
      <Row className="g-0">
        <Col md={4} className="profile-sidebar text-center d-flex flex-column justify-content-center p-4">
          <div className="profile-avatar-circle mb-3 mx-auto shadow">
            {/* Usiamo il nome dinamico */}
            <span className="initials">{userData.nome?.charAt(0)}{userData.cognome?.charAt(0)}</span>
          </div>
          <h4 className="fw-bold text-white mb-1">{userData.nome} {userData.cognome}</h4>
          <Badge bg="light" text="dark" className="rounded-pill mb-3">
            {userData.role === 'ADMIN' ? 'Amministratore' : 'Ospite Gold'}
          </Badge>
          <Button variant="outline-light" size="sm" className="rounded-pill px-3 mt-2">
            <PencilSquare className="me-2" /> Modifica Profilo
          </Button>
        </Col>

        <Col md={8}>
          <Card.Body className="p-4">
            <h5 className="text-uppercase text-muted small fw-bold mb-4">Informazioni Personali</h5>
            
            <ListGroup variant="flush" className="profile-info-list">
              <ListGroup.Item className="d-flex align-items-center border-0 px-0">
                <div className="icon-box me-3"><Envelope /></div>
                <div>
                  <div className="label">Email</div>
                  <div className="value">{userData.email}</div>
                </div>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center border-0 px-0">
                <div className="icon-box me-3"><CalendarCheck /></div>
                <div>
                  <div className="label">Data di Nascita</div>
                  <div className="value">
                    {new Date(userData.dataDiNascita).toLocaleDateString()}
                  </div>
                </div>
              </ListGroup.Item>
              
              {/* Altri campi dinamici... */}
            </ListGroup>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default User;
