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
import { Link } from "react-router"; // Utilizziamo Link per una navigazione fluida senza refresh

import "./StruttureClienti.css";

const API_URL = import.meta.env.VITE_BACK_END;

function StruttureClient() {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // FIX: Sostituito localhost con variabile d'ambiente
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
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Stiamo preparando le migliori proposte per te...</p>
      </div>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5 px-4 px-md-0">
      <div className="mb-5 text-center">
        <h2 className="headLine fw-bold text-uppercase mb-2">
          Le Nostre Strutture
        </h2>
        <div className="bg-primary mx-auto" style={{ width: "60px", height: "3px" }}></div>
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
              <Card className="h-100 border-0 shadow-sm overflow-hidden card-hover transition">
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={s.images?.mainImage || "https://placehold.co/600x400?text=Villa+Fenix"}
                    className="h-100 w-100 object-fit-cover transition-transform"
                    alt={s.nome}
                  />
                </div>

                <Card.Body className="d-flex flex-column p-4">
                  <div className="mb-3">
                    <Card.Title className="headLine fw-bold h4 mb-1">
                      {s.nome}
                    </Card.Title>
                    <Card.Text className="text-muted small d-flex align-items-center">
                      <GeoAlt className="me-1 text-primary" /> 
                      {s.località?.città}, {s.località?.indirizzo}
                    </Card.Text>
                  </div>

                  <Card.Text className="bodyCopy text-muted small flex-grow-1">
                    {s.descrizione && s.descrizione.length > 120 
                      ? `${s.descrizione.substring(0, 120)}...` 
                      : s.descrizione || "Esplora questa magnifica struttura targata Villa Fenix."}
                  </Card.Text>

                  <Button
                    as={Link}
                    to={`/strutture/${s._id}`}
                    className="dettagliButton mt-4 w-100 rounded-0 py-2 fw-bold"
                    variant="primary"
                  >
                    SCOPRI LA STRUTTURA
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="text-muted">Nessuna struttura disponibile al momento.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default StruttureClient;