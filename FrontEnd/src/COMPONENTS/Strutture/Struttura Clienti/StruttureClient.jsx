import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert
} from "react-bootstrap";
import { GeoAlt } from "react-bootstrap-icons";
import { Link } from "react-router"; 

import "./StruttureClienti.css";

const API_URL = import.meta.env.VITE_BACK_END;

function StruttureClient() {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/strutture`)
      .then((res) => {
        if (!res.ok) throw new Error("Impossibile caricare le strutture");
        return res.json();
      })
      .then((data) => setStrutture(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Errore fetch vetrina:", err);
        setError("Si è verificato un errore nel caricamento delle strutture.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center my-5 py-5 font-ubuntu">
        <Spinner animation="border" className="vf-spinner-brand" />
        <p className="mt-3 text-muted small">Stiamo preparando le migliori proposte per te...</p>
      </div>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger" className="vf-alert-brand">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5 px-4 px-md-0">
      <div className="mb-5 text-center">
        <h2 className="vf-section-title fw-bold text-uppercase mb-2">
          Le Nostre Strutture
        </h2>
        <div className="vf-title-divider mx-auto" style={{ width: "50px", height: "3px" }}></div>
      </div>

      {/* Row responsive: scrollabile su mobile, griglia su desktop */}
      <Row className="g-4 flex-nowrap flex-md-wrap overflow-auto pb-4 pb-md-0 custom-scrollbar">
        {strutture.length > 0 ? (
          strutture.map((s) => (
            <Col 
              key={s._id} 
              xs={10} 
              md={6} 
              lg={4} 
              className="d-flex align-items-stretch"
              style={{ minWidth: window.innerWidth < 768 ? '300px' : 'auto' }}
            >
              <Card className="h-100 border-0 shadow-sm overflow-hidden vf-structure-card">
                <div className="vf-img-container">
                  <Card.Img
                    variant="top"
                    src={s.images?.mainImage || "https://placehold.co/600x400?text=Villa+Fenix"}
                    className="h-100 w-100 object-fit-cover vf-card-img"
                    alt={s.nome}
                  />
                </div>

                <Card.Body className="d-flex flex-column p-4">
                  <div className="mb-3">
                    <Card.Title className="vf-card-title h4 mb-1">
                      {s.nome}
                    </Card.Title>
                    <Card.Text className="text-muted small d-flex align-items-center mt-1">
                      <GeoAlt className="me-1 vf-geo-icon" size={14} /> 
                      {s.località?.città}, {s.località?.indirizzo}
                    </Card.Text>
                  </div>

                  <Card.Text className="vf-card-description small flex-grow-1">
                    {s.descrizione && s.descrizione.length > 120 
                      ? `${s.descrizione.substring(0, 120)}...` 
                      : s.descrizione || "Esplora questa magnifica struttura targata Villa Fenix."}
                  </Card.Text>

                  <Button
                    as={Link}
                    to={`/strutture/${s._id}`}
                    className="vf-dettagli-btn mt-4 w-100 py-2.5 text-white"
                  >
                    SCOPRI LA STRUTTURA
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="text-muted small font-ubuntu">Nessuna struttura disponibile al momento.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default StruttureClient;