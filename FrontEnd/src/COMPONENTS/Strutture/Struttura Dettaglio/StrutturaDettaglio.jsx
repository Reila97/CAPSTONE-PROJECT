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
import ReviewForm from "../../Recensioni/ReviewForm"; // Assicurati che il percorso sia corretto
import "./StrutturaDettaglio.css";
import ReviewList from "../../Recensioni/ReviewList/ReviewList";

const API_URL = import.meta.env.VITE_BACK_END;

function StrutturaDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [struttura, setStruttura] = useState(null);
  const [cameraSelezionata, setCameraSelezionata] = useState(null); // AGGIUNTO
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

        // Pre-selezioniamo la prima camera disponibile per il form recensioni
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
    // Qui potresti triggerare un refresh delle recensioni se necessario
  };

  if (loading)
    return (
      <Container className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Caricamento dettagli struttura...</p>
      </Container>
    );

  if (error || !struttura)
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning" className="py-4">
          <InfoCircle size={30} className="mb-3" />
          <h3>{error || "Struttura non trovata"}</h3>
          <Button
            variant="dark"
            className="mt-2"
            onClick={() => navigate("/strutture")}
          >
            Torna alla vetrina
          </Button>
        </Alert>
      </Container>
    );

  return (
    <Container className="my-5 animate-in">
      <Button
        variant="link"
        className="text-decoration-none text-dark p-0 mb-4 d-flex align-items-center gap-2 hover-link"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft /> Torna alla lista
      </Button>

      <Row className="gy-4">
        {/* Gallery Image Section */}
        <Col lg={7}>
          <div className="position-relative overflow-hidden rounded shadow-sm">
            <img
              src={
                struttura.images?.mainImage ||
                "https://placehold.co/800x600?text=Villa+Fenix"
              }
              alt={struttura.nome}
              className="img-fluid w-100"
              style={{
                minHeight: "400px",
                maxHeight: "600px",
                objectFit: "cover",
              }}
            />
            <div className="position-absolute top-0 end-0 m-3">
              <Badge bg="white" className="text-dark border shadow-sm">
                Top Location
              </Badge>
            </div>
          </div>
        </Col>

        {/* Info Section */}
        <Col lg={5}>
          <div className="ps-lg-4 h-100 d-flex flex-column">
            <div className="mb-3">
              <h1 className="headLine display-4 fw-bold mb-2">
                {struttura.nome}
              </h1>
              <p className="text-muted d-flex align-items-center gap-2 mb-0">
                <GeoAlt className="text-danger" />
                {struttura.località?.città}, {struttura.località?.indirizzo}
              </p>
            </div>
            <hr />
            <div className="my-3 flex-grow-1">
              <h5 className="text-uppercase small fw-bold tracking-wider text-muted mb-3">
                Descrizione
              </h5>
              <p className="bodyCopy leading-relaxed text-dark">
                {struttura.descrizione}
              </p>
            </div>
            <div className="bg-light p-4 rounded border-start border-primary border-4 shadow-sm mb-4">
              <h5 className="text-uppercase small fw-bold mb-3">
                Contatti & Supporto
              </h5>
              <div className="small">
                <p className="mb-2 d-flex align-items-center gap-2">
                  <Envelope className="text-primary" />{" "}
                  {struttura.contatti?.email}
                </p>
                <p className="mb-0 d-flex align-items-center gap-2">
                  <Telephone className="text-primary" />{" "}
                  {struttura.contatti?.telefono}
                </p>
              </div>
            </div>
            <Button className="prenotaButton w-100 py-3 rounded-2 fw-bold shadow-sm transition-all">
              CONTATTACI PER PRENOTARE
            </Button>
          </div>
        </Col>
      </Row>

      {/* SEZIONE RECENSIONI */}
      <div className="mt-5 pt-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <h2 className="headLine fw-bold mb-0">Recensioni</h2>
          <div className="flex-grow-1 border-bottom"></div>
        </div>
        <Row>
          <Col lg={7} className="mx-auto">
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

      <Row className="mt-5">
        <Col lg={10} className="mx-auto">
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="headLine fw-bold mb-0">Cosa dicono gli ospiti</h2>
            <div className="flex-grow-1 border-bottom"></div>
          </div>

          {/* Passiamo l'array delle recensioni della struttura */}
          <ReviewList reviews={struttura.recensioni} />
        </Col>
      </Row>

      {/* SEZIONE CAMERE DISPONIBILI */}
      <div className="mt-5 pt-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <h2 className="headLine fw-bold mb-0">Soluzioni Disponibili</h2>
          <div className="flex-grow-1 border-bottom"></div>
        </div>
        <CamereClient camereDati={struttura.camere} />
      </div>
    </Container>
  );
}

export default StrutturaDettaglio;
