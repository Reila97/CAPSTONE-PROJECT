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
  GeoAlt,
} from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_BACK_END;

function CameraDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchCamera = async () => {
      try {
        setLoading(true);
        // Utilizziamo la variabile d'ambiente per l'endpoint
        const res = await fetch(`${API_URL}/camere/${id}`);
        
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

    if (id) fetchCamera();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Caricamento dettagli camera...</p>
      </Container>
    );
  }

  if (error || !camera) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error || "Camera non trovata"}</Alert>
        <Button variant="dark" className="rounded-pill" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2" /> Torna alla lista
        </Button>
      </Container>
    );
  }

  // Creiamo una lista unica di immagini per la galleria evitando duplicati
  const allImages = [
    camera.images?.mainImage,
    ...(camera.images?.gallery || [])
  ].filter(img => img); // Rimuove eventuali valori null/undefined

  return (
    <Container className="py-5">
      <Button
        variant="link"
        className="text-dark p-0 mb-4 d-inline-flex align-items-center fw-bold text-decoration-none"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="me-2" size={18} /> Torna indietro
      </Button>

      <Row className="g-4">
        {/* COLONNA SINISTRA: MEDIA E INFO */}
        <Col lg={8}>
          <div className="mb-4">
            <Image
              src={activeImage || "https://placehold.co/800x500?text=Immagine+non+disponibile"}
              alt={camera.nome}
              fluid
              className="rounded-4 shadow-sm mb-3 object-fit-cover w-100 shadow"
              style={{ height: "480px", transition: "all 0.3s ease" }}
            />

            {/* Galleria Miniature */}
            {allImages.length > 1 && (
              <Row className="g-2 overflow-auto flex-nowrap pb-2 px-1">
                {allImages.map((img, index) => (
                  <Col xs={3} md={2} key={index} style={{ minWidth: '100px' }}>
                    <Image
                      src={img}
                      alt={`Vista ${index + 1}`}
                      fluid
                      role="button"
                      className={`rounded-3 object-fit-cover w-100 h-100 border ${
                        activeImage === img ? "border-warning border-3 shadow-sm" : "border-transparent opacity-75"
                      }`}
                      style={{ cursor: "pointer", height: "70px" }}
                      onClick={() => setActiveImage(img)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <h1 className="fw-bold mb-0">{camera.nome}</h1>
              <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 rounded-pill">
                {camera.tipologia}
              </Badge>
            </div>

            {camera.strutturaId && (
              <p className="text-muted d-flex align-items-center mb-3">
                <GeoAlt className="me-1 text-danger" />
                Situata in: <strong className="ms-1 text-dark text-uppercase">{camera.strutturaId.nome}</strong>
              </p>
            )}
            <hr />
          </div>

          {/* Caratteristiche Box */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div className="p-3 border rounded-4 text-center bg-white shadow-sm h-100">
                <People size={24} className="text-warning mb-2" />
                <h6 className="small fw-bold text-uppercase text-muted mb-1">Capienza</h6>
                <span className="fw-bold">{camera.capienza?.maxAdulti} Ospiti</span>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3 border rounded-4 text-center bg-white shadow-sm h-100">
                <DoorOpen size={24} className="text-warning mb-2" />
                <h6 className="small fw-bold text-uppercase text-muted mb-1">Letto</h6>
                <span className="fw-bold">{camera.tipologia}</span>
              </div>
            </Col>
            {camera.capienza?.possibilitàLettino && (
              <Col xs={12} md={6}>
                <div className="p-3 border rounded-4 d-flex align-items-center bg-light h-100">
                  <CheckCircleFill size={24} className="text-success me-3" />
                  <div>
                    <h6 className="small fw-bold mb-0">Lettino Aggiuntivo</h6>
                    <span className="small text-muted text-uppercase">Disponibile su richiesta</span>
                  </div>
                </div>
              </Col>
            )}
          </Row>

          <div className="mb-5">
            <h5 className="fw-bold mb-3 border-start border-warning border-4 ps-3 text-uppercase">Descrizione Camera</h5>
            <p className="text-secondary" style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              {camera.descrizione}
            </p>
          </div>

          {/* Servizi */}
          {camera.servizi?.length > 0 && (
            <div>
              <h5 className="fw-bold mb-3 border-start border-warning border-4 ps-3 text-uppercase">Servizi inclusi</h5>
              <Row className="g-3">
                {camera.servizi.map((s) => (
                  <Col xs={12} sm={6} key={s._id}>
                    <div className="d-flex align-items-center p-3 bg-light rounded-4">
                      <CheckCircleFill className="text-warning me-3" size={18} />
                      <div className="d-flex flex-column">
                        <span className="fw-bold">{s.nome}</span>
                        {s.costoExtra > 0 && <small className="text-success fw-bold">+€{s.costoExtra.toFixed(2)}</small>}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>

        {/* COLONNA DESTRA: BOOKING CARD */}
        <Col lg={4}>
          <Card className="border-0 shadow-lg p-3 rounded-4 sticky-top" style={{ top: "110px" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-0">
                        € {camera.prezzoPerNotte?.toLocaleString('it-IT')}
                    </h3>
                    <span className="text-muted small">Prezzo fisso per notte</span>
                </div>
                <Badge bg="success" className="mb-1">Miglior Prezzo</Badge>
              </div>

              <Alert variant="info" className="py-2 small border-0 bg-light">
                <i className="bi bi-info-circle me-2"></i>
                Nessun costo di prenotazione nascosto.
              </Alert>

              <hr className="opacity-25" />

              <div className="mb-4">
                <p className="small text-muted mb-0">Categoria della camera:</p>
                <p className="fw-bold text-uppercase">{camera.tipologia}</p>
              </div>

              <Button
                variant="dark"
                size="lg"
                className="w-100 py-3 fw-bold rounded-pill shadow mb-3 btn-hover-warning"
                onClick={() => navigate(`/prenota/${camera._id}`)}
              >
                PRENOTA ADESSO
              </Button>

              <p className="text-center text-muted x-small mb-0" style={{fontSize: '0.75rem'}}>
                Verrai reindirizzato alla pagina di checkout sicuro.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CameraDettaglio;