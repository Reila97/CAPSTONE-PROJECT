import { Card, Button, Image } from 'react-bootstrap';
import { Envelope, GeoAlt, StarFill } from 'react-bootstrap-icons';
import './Recensioni.css';

const Recensioni = () => {
  return (
    <Card className="user-card-elegant border-0 shadow-sm">
      <div className="card-header-img">
        <Card.Img variant="top" src="./sfondo-card.jpg" className="header-bg" />
        <div className="user-avatar-wrapper">
          <Image 
            src="./avatar-user.jpg" 
            roundedCircle 
            className="user-avatar-img shadow" 
          />
        </div>
      </div>
      <Card.Body className="text-center pt-5">
        <div className="mb-2 text-warning">
          <StarFill size={14} /> <StarFill size={14} /> <StarFill size={14} /> <StarFill size={14} /> <StarFill size={14} />
        </div>
        <Card.Title className="fw-bold mb-1">Marco Rossi</Card.Title>
        <Card.Text className="text-muted small mb-3">
          <GeoAlt className="me-1" /> Roma, Italia
        </Card.Text>
        <Card.Text className="user-bio px-3">
          "Soggiorno indimenticabile a Villa Fenix. La cura dei dettagli è superba."
        </Card.Text>
        <hr className="my-4 opacity-25" />
        <div className="d-flex justify-content-around align-items-center">
          <Button variant="outline-dark" className="rounded-pill px-4 btn-sm">
            Profilo
          </Button>
          <Button variant="dark" className="rounded-pill px-4 btn-sm shadow-sm">
            Contatta
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Recensioni;
//TODO