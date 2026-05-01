import { useState, useEffect } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import CameraCard from "../CameraCard";

function CamereClient({ camereDati }) {
  const [camere, setCamere] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Caso 1: I dati arrivano dal componente padre (StrutturaDettaglio)
    if (camereDati) {
      setCamere(Array.isArray(camereDati) ? camereDati : []);
      setLoading(false);
    } 
    // Caso 2: Nessun dato passato. Fa il fetch di tutte le camere (Vetrina pubblica)
    else {
      const fetchTutteLeCamere = async () => {
        try {
          const res = await fetch("http://localhost:3002/camere");
          if (res.ok) {
            const data = await res.json();
            setCamere(data);
          }
        } catch (err) {
          console.error("Errore nel caricamento delle camere:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchTutteLeCamere();
    }
  }, [camereDati]);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  if (camere.length === 0) {
    return (
      <p className="bodyCopy text-muted">
        Non ci sono camere disponibili al momento per questa struttura.
      </p>
    );
  }

  return (
   <Container className="px-0">
      {/* - md={2} lg={3}: su schermi grandi mostra esattamente 3 card per riga.
        - slice(0, 6): prende solo le prime 6 camere per creare la struttura 3x3 su due righe.
      */}
      <Row xs={6} md={3} lg={4} className="g-4">
        {camere.slice(0, 6).map((c) => (
          <CameraCard key={c._id || c.id} camera={c} />
        ))}
      </Row>
    </Container>
  );
}

export default CamereClient;