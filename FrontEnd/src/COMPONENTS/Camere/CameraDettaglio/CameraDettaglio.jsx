import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import {
  DoorOpen,
  People,
  CheckCircleFill,
  ArrowLeft,
  StarFill,
  GeoAlt,
} from "react-bootstrap-icons";

function CameraDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stato per l'immagine principale visualizzata nella galleria
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchCamera = async () => {
      try {
        const res = await fetch(`http://localhost:3002/camere/${id}`);
        if (!res.ok) {
          throw new Error("Impossibile caricare i dettagli della camera.");
        }
        const data = await res.json();
        setCamera(data);
        setActiveImage(data.images?.mainImage || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCamera();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-dark" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2" /> Torna indietro
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Pulsante per tornare indietro */}
      <Button
        variant="link"
        className="text-dark p-0 mb-4 d-inline-flex align-items-center fw-bold text-decoration-none"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="me-2" size={18} /> Torna indietro
      </Button>

      <Row className="g-4">
        {/* COLONNA SINISTRA: IMMAGINI E DETTAGLI */}
        <Col lg={8}>
          {/* Galleria Immagini */}
          <div className="mb-4">
            <Image
              src={activeImage || "https://placehold.co/800x500?text=Camera"}
              alt={camera.nome}
              fluid
              className="rounded-4 shadow-sm mb-3 object-fit-cover w-100"
              style={{ height: "450px" }}
            />

            {/* Miniature (Gallery) */}
            {camera.images?.gallery && camera.images.gallery.length > 0 && (
              <Row className="g-2">
                <Col xs={3} md={2}>
                  <Image
                    src={camera.images.mainImage}
                    alt="Principale"
                    fluid
                    role="button"
                    className={`rounded-3 object-fit-cover w-100 h-100 border ${
                      activeImage === camera.images.mainImage
                        ? "border-dark border-2"
                        : "border-transparent"
                    }`}
                    style={{ cursor: "pointer", height: "80px" }}
                    onClick={() => setActiveImage(camera.images.mainImage)}
                  />
                </Col>
                {camera.images.gallery.map((img, index) => (
                  <Col xs={3} md={2} key={index}>
                    <Image
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      fluid
                      role="button"
                      className={`rounded-3 object-fit-cover w-100 h-100 border ${
                        activeImage === img
                          ? "border-dark border-2"
                          : "border-transparent"
                      }`}
                      style={{ cursor: "pointer", height: "80px" }}
                      onClick={() => setActiveImage(img)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>

          {/* Intestazione Camera */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <h2 className="fw-bold mb-0">{camera.nome}</h2>
              <Badge bg="dark" className="px-3 py-2 fs-6 fw-normal rounded-pill">
                {camera.tipologia}
              </Badge>
            </div>

            {camera.strutturaId && (
              <p className="text-muted d-flex align-items-center mb-3">
                <GeoAlt className="me-1 text-secondary" />
                Presso: <strong className="ms-1 text-dark">{camera.strutturaId.nome}</strong>
              </p>
            )}
            <hr className="text-muted opacity-25" />
          </div>

          {/* Caratteristiche principali (Badge veloci) */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div className="p-3 border rounded-4 text-center bg-light bg-opacity-50 h-100">
                <People size={24} className="text-secondary mb-2" />
                <h6 className="small fw-bold text-uppercase text-muted mb-1">Capienza</h6>
                <span className="fw-bold text-dark">{camera.capienza?.maxAdulti} Adulti</span>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3 border rounded-4 text-center bg-light bg-opacity-50 h-100">
                <DoorOpen size={24} className="text-secondary mb-2" />
                <h6 className="small fw-bold text-uppercase text-muted mb-1">Tipologia</h6>
                <span className="fw-bold text-dark">{camera.tipologia}</span>
              </div>
            </Col>
            {camera.capienza?.possibilitàLettino && (
              <Col xs={12} md={6}>
                <div className="p-3 border rounded-4 d-flex align-items-center bg-success bg-opacity-10 border-success border-opacity-25 h-100">
                  <CheckCircleFill size={20} className="text-success me-3 flex-shrink-0" />
                  <div>
                    <h6 className="small fw-bold text-success text-uppercase mb-0">Servizio Lettino</h6>
                    <span className="small text-muted">È possibile aggiungere un lettino </span>
                  </div>
                </div>
              </Col>
            )}
          </Row>

          {/* Descrizione */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Informazioni sulla camera</h5>
            <p className="text-secondary" style={{ lineHeight: "1.7", whiteSpace: "pre-line" }}>
              {camera.descrizione}
            </p>
          </div>

          {/* Servizi inclusi nella camera */}
          {camera.servizi && camera.servizi.length > 0 && (
            <div>
              <h5 className="fw-bold mb-3">Cosa troverai in questa camera</h5>
              <Row className="g-2">
                {camera.servizi.map((servizio) => (
                  <Col xs={12} sm={6} key={servizio._id}>
                    <div className="d-flex align-items-center p-2 rounded-3">
                      <CheckCircleFill className="text-success me-2" size={16} />
                      <span className="text-dark">
                        {servizio.nome}
                        {servizio.costoExtra > 0 && (
                          <small className="text-muted ms-1">
                            (+€{servizio.costoExtra})
                          </small>
                        )}
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>

        {/* COLONNA DESTRA: PREZZO E CALL TO ACTION (PRENOTAZIONE) */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: "100px" }}>
            <Card.Body className="p-0">
              <div className="mb-3">
                <span className="fs-3 fw-bold text-success">€ {camera.prezzoPerNotte}</span>
                <span className="text-muted"> / notte</span>
              </div>

              <div className="text-muted small mb-4">
                Tasse e costi inclusi. La tariffa può variare in base alla stagionalità o ai servizi extra selezionati.
              </div>

              <hr className="text-muted opacity-25 mb-4" />

              {/* Servizi Extra inclusi come Reminder */}
              <div className="mb-4 bg-light p-3 rounded-3">
                <h6 className="fw-bold small mb-2">Servizi disponibili</h6>
                <div className="small text-secondary">
                  Questa struttura offre l'accesso a tutti i comfort della categoria{" "}
                  <strong>{camera.tipologia}</strong>.
                </div>
              </div>

              {/* Bottone d'azione con la tua classe personalizzata */}
              <Button
                variant="dark"
                size="lg"
                className="w-100 py-3 fw-bold rounded-pill dettagliButton text-uppercase mb-3"
                onClick={() => navigate(`/prenota/${camera._id}`)}
              >
                Prenota ora
              </Button>

              <div className="text-center text-muted small">
                Nessun addebito immediato
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CameraDettaglio;