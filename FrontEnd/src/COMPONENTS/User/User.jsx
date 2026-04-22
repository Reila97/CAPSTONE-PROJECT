import { Card, Row, Col, ListGroup, Button, Badge } from 'react-bootstrap';
import { Person, Envelope, Phone, CalendarCheck, PencilSquare } from 'react-bootstrap-icons';
import './User.css';

const User = ({ user }) => {
  // Esempio di dati se non passati tramite props
  const userData = user || {
    name: "Marco Rossi",
    email: "marco.rossi@email.it",
    phone: "+39 345 678 9012",
    memberSince: "Gennaio 2024",
    totalBookings: 5
  };

  return (
    <Card className="profile-card border-0 shadow-lg">
      <Row className="g-0">
        {/* Parte Sinistra: Avatar e Titolo */}
        <Col md={4} className="profile-sidebar text-center d-flex flex-column justify-content-center p-4">
          <div className="profile-avatar-circle mb-3 mx-auto shadow">
            <span className="initials">{userData.name.charAt(0)}</span>
          </div>
          <h4 className="fw-bold text-white mb-1">{userData.name}</h4>
          <Badge bg="light" text="dark" className="rounded-pill mb-3">Ospite Gold</Badge>
          <Button variant="outline-light" size="sm" className="rounded-pill px-3 mt-2">
            <PencilSquare className="me-2" /> Modifica Foto
          </Button>
        </Col>

        {/* Parte Destra: Dati Dettagliati */}
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
                <div className="icon-box me-3"><Phone /></div>
                <div>
                  <div className="label">Telefono</div>
                  <div className="value">{userData.phone}</div>
                </div>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center border-0 px-0">
                <div className="icon-box me-3"><CalendarCheck /></div>
                <div>
                  <div className="label">Membro dal</div>
                  <div className="value">{userData.memberSince}</div>
                </div>
              </ListGroup.Item>
            </ListGroup>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <div>
                <span className="h4 fw-bold mb-0">{userData.totalBookings}</span>
                <span className="text-muted ms-2">Prenotazioni effettuate</span>
              </div>
              <Button variant="primary" className="rounded-pill shadow-sm">
                Vedi Storico
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default User;