import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import CameraCard from "../CameraCard";
import "./CamereCliente.css"

const API_URL = import.meta.env.VITE_BACK_END;

function CamereClient({ camereDati }) {
  const [camere, setCamere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Caso 1: I dati arrivano dal componente padre (StrutturaDettaglio)
    if (camereDati) {
      setCamere(Array.isArray(camereDati) ? camereDati : []);
      setLoading(false);
    } 
    // Caso 2: Fetch dal backend (Vetrina pubblica)
    else {
      const fetchTutteLeCamere = async () => {
        try {
          setError(null);
          const res = await fetch(`${API_URL}/camere`);
          
          if (!res.ok) throw new Error("Errore nel recupero delle camere");
          
          const data = await res.json();
          setCamere(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Errore nel caricamento delle camere:", err);
          setError("Non è stato possibile caricare le camere. Riprova più tardi.");
        } finally {
          setLoading(false);
        }
      };
      fetchTutteLeCamere();
    }
  }, [camereDati]);

  if (loading) {
    return (
      <div className="vf-spinner-container">
        <Spinner animation="border" className="vf-spinner-brand" />
        <p className="mt-3 vf-loading-text">Ricerca stanze disponibili...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="my-4 vf-alert-error shadow-sm">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

  if (camere.length === 0) {
    return (
      <p className="vf-empty-message my-4">
        Non ci sono camere disponibili al momento per questa struttura.
      </p>
    );
  }

  return (
    <Container className="px-0 vf-camere-wrapper">
      <Row className="g-4 m-0">
        {camere.slice(0, 6).map((c) => (
          <Col 
            key={c._id || c.id} 
            xs={12} 
            md={6} 
            lg={4} 
            className="d-flex justify-content-center"
          >
            <div className="vf-card-container">
              <CameraCard camera={c} />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CamereClient;