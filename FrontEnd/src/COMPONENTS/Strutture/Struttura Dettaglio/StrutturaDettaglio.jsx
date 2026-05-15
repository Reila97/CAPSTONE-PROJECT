import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Spinner,
  Badge,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";
import {
  ArrowLeft,
  GeoAlt,
  Envelope,
  Telephone,
  InfoCircle,
} from "react-bootstrap-icons";

import CamereClient from "../../Camere/CamereClient/CamereClient";
import ReviewForm from "../../Recensioni/ReviewForm/ReviewForm.jsx"
import "./StrutturaDettaglio.css";
import ReviewList from "../../Recensioni/ReviewList/ReviewList";

const API_URL = import.meta.env.VITE_BACK_END;

function StrutturaDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [struttura, setStruttura] = useState(null);
  const [cameraSelezionata, setCameraSelezionata] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDettaglio = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/strutture/${id}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error("Struttura non trovata.");
          throw new Error("Errore nel caricamento dei dettagli.");
        }

        const data = await res.json();
        setStruttura(data);

        if (data.camere && data.camere.length > 0) {
          setCameraSelezionata(data.camere[0]);
        }

        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Errore dettaglio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDettaglio();
  }, [id]);

  const handleUpdateList = (newReview) => {
    console.log("Recensione aggiunta con successo:", newReview);
  };

  if (loading)
    return (
      <Container className="text-center py-5 my-5 font-ubuntu">
        <Spinner animation="border" className="vf-spinner-brand" />
        <p className="mt-3 text-muted small">Caricamento dettagli struttura...</p>
      </Container>
    );

  if (error || !struttura)
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning" className="py-4 vf-alert-warning-brand shadow-sm">
          <InfoCircle size={32} className="mb-3 vf-geo-icon-detail" />
          <h3 className="fw-bold font-gotham mb-3">{error || "Struttura non trovata"}</h3>
          <Button
            className="vf-contact-cta-btn px-4 py-2"
            onClick={() => navigate("/strutture")}
          >
            Torna alla vetrina
          </Button>
        </Alert>
      </Container>
    );

  return (
    <Container className="my-5">
      <Button
        variant="link"
        className="p-0 mb-4 d-flex align-items-center gap-2 vf-back-link text-decoration-none"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} /> Torna alla lista
      </Button>

      <Row className="gy-4">
        {/* Gallery Image Section */}
        <Col lg={7}>
          <div className="position-relative overflow-hidden rounded-4 shadow-sm" style={{ borderRadius: '14px' }}>
            <img
              src={
                struttura.images?.mainImage ||
                "https://placehold.co/800x600?text=Villa+Fenix"
              }
              alt={struttura.nome}
              className="img-fluid w-100"
              style={{
                minHeight: "400px",
                maxHeight: "550px",
                objectFit: "cover",
              }}
            />
            <div className="position-absolute top-0 end-0 m-3">
              <Badge className="vf-location-badge shadow-sm">
                Top Location
              </Badge>
            </div>
          </div>
        </Col>

        {/* Info Section */}
        <Col lg={5}>
          <div className="ps-lg-3 h-100 d-flex flex-column justify-content-between">
            <div className="mb-3">
              <h1 className="vf-detail-title display-5 mb-2">
                {struttura.nome}
              </h1>
              <p className="vf-detail-geo d-flex align-items-center gap-2 mb-0 mt-2">
                <GeoAlt className="vf-geo-icon-detail" size={16} />
                {struttura.località?.città}, {struttura.località?.indirizzo}
              </p>
            </div>
            
            <hr className="my-2 opacity-25" style={{ color: '#65513D' }} />
            
            <div className="my-3 flex-grow-1">
              <h5 className="text-uppercase small fw-bold vf-section-subtitle mb-2">
                Descrizione
              </h5>
              <p className="vf-detail-description small">
                {struttura.descrizione}
              </p>
            </div>

            <div className="vf-contacts-box p-4 rounded-3 shadow-sm mb-4">
              <h5 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: '0.5px' }}>
                Contatti & Supporto
              </h5>
              <div className="small d-flex flex-column gap-2">
                <p className="mb-0 d-flex align-items-center gap-2 fw-medium">
                  <Envelope className="vf-contacts-icon" size={14} />{" "}
                  {struttura.contatti?.email}
                </p>
                <p className="mb-0 d-flex align-items-center gap-2 fw-medium">
                  <Telephone className="vf-contacts-icon" size={14} />{" "}
                  {struttura.contatti?.telefono}
                </p>
              </div>
            </div>

            <Button className="vf-contact-cta-btn w-100 py-2.5 shadow-sm">
              CONTATTACI PER PRENOTARE
            </Button>
          </div>
        </Col>
      </Row>

      {/* SEZIONE CAMERE DISPONIBILI */}
      <div className="mt-5 pt-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <h2 className="vf-section-subtitle h3 mb-0">Soluzioni Disponibili</h2>
          <div className="flex-grow-1 vf-section-divider"></div>
        </div>
        <CamereClient camereDati={struttura.camere} />
      </div>

      {/* SEZIONE LASCIA RECENSIONE */}
      <div className="mt-5 pt-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <h2 className="vf-section-subtitle h3 mb-0">Lascia una Recensione</h2>
          <div className="flex-grow-1 vf-section-divider"></div>
        </div>
        <Row>
          <Col lg={8} className="mx-auto">
            {cameraSelezionata && (
              <ReviewForm
                strutturaId={struttura._id}
                cameraId={cameraSelezionata._id}
                onReviewAdded={handleUpdateList}
              />
            )}
          </Col>
        </Row>
      </div>

      {/* SEZIONE FEEDBACK OSPITI */}
      <div className="mt-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <h2 className="vf-section-subtitle h3 mb-0">Cosa dicono gli ospiti</h2>
          <div className="flex-grow-1 vf-section-divider"></div>
        </div>
        <Row>
          <Col lg={12}>
            <ReviewList reviews={struttura.recensioni} />
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default StrutturaDettaglio;