import { Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router"; // Mantenuto l'import originale dell'ambiente
import "./CameraCard.css"; // Importazione degli stili Villa Fenix

function CameraCard({ camera }) {
  // Destrutturazione per pulizia del codice
  const { 
    _id, 
    nome, 
    descrizione, 
    prezzoPerNotte, 
    images, 
    capienza 
  } = camera;

  const mainImage = images?.mainImage;

  // 1. Funzione per troncare il testo ottimizzata
  const troncaTesto = (testo, limite = 100) => {
    if (!testo) return "Nessuna descrizione disponibile.";
    return testo.length > limite ? `${testo.substring(0, limite)}...` : testo;
  };

  // 2. Formattazione Prezzo (Consistenza con il resto dell'app)
  const prezzoFormattato = Number(prezzoPerNotte).toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <Col className="d-flex align-items-stretch vf-card-wrapper">
      <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden vf-camera-card">
        {/* Immagine con fallback */}
        <div className="vf-card-img-wrapper">
          <Card.Img
            variant="top"
            src={mainImage || "https://placehold.co/600x400?text=Immagine+Non+Disponibile"}
            alt={nome}
            className="rounded-0 h-100 w-100 vf-card-img"
            // Mantenuta la logica inline dell'effetto hover UX originale
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        <Card.Body className="d-flex flex-column p-3.5">
          <div className="mb-2">
            <h4 className="fw-bold mb-1 vf-card-title">{nome || "Camera Senza Nome"}</h4>
            {/* Badge opzionale per tipologia se presente */}
            {camera.tipologia && (
              <span className="badge rounded-pill vf-badge-secondary">{camera.tipologia}</span>
            )}
          </div>

          <Card.Text className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: "1.6" }}>
            {troncaTesto(descrizione, 90)}
          </Card.Text>

          <div className="border-top pt-3 mt-auto" style={{ borderColor: "rgba(101, 81, 61, 0.1)" }}>
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <div className="vf-card-label mb-0">A notte</div>
                <span className="fw-bold mb-0 vf-card-price">
                  {prezzoFormattato}
                </span>
              </div>
              
              {capienza && (
                <div className="text-end small text-muted">
                  <div className="fw-medium text-dark">Ospiti: {capienza.maxAdulti}</div>
                  {capienza.possibilitàLettino && (
                    <div className="vf-text-accent" style={{ fontSize: "0.75rem" }}>
                      + Lettino disp.
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              as={Link}
              to={`/camere/${_id}`}
              className="w-100 fw-bold py-2 rounded-pill vf-btn-outline-brand"
            >
              VEDI DETTAGLI
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default CameraCard;