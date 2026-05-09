import { Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router"; // Assicurati che sia "react-router-dom" se usi la versione standard

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
    <Col className="d-flex align-items-stretch">
      <Card className="h-100 border-0 shadow-sm rounded-3 overflow-hidden">
        {/* Immagine con fallback */}
        <div style={{ height: "200px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
          <Card.Img
            variant="top"
            src={mainImage || "https://placehold.co/600x400?text=Immagine+Non+Disponibile"}
            alt={nome}
            className="rounded-0 h-100 w-100"
            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
            // Effetto hover semplice per la UX
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        <Card.Body className="d-flex flex-column p-3">
          <div className="mb-2">
            <h4 className="h5 fw-bold text-dark mb-1">{nome || "Camera Senza Nome"}</h4>
            {/* Badge opzionale per tipologia se presente */}
            {camera.tipologia && (
              <span className="badge bg-light text-muted fw-normal border">{camera.tipologia}</span>
            )}
          </div>

          <Card.Text className="text-muted small mb-3 flex-grow-1">
            {troncaTesto(descrizione, 90)}
          </Card.Text>

          <div className="border-top pt-3 mt-auto">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <div className="small text-muted mb-1">A notte</div>
                <span className="h5 fw-bold text-primary mb-0">
                  {prezzoFormattato}
                </span>
              </div>
              
              {capienza && (
                <div className="text-end small text-muted">
                  <div className="fw-medium">Ospiti: {capienza.maxAdulti}</div>
                  {capienza.possibilitàLettino && (
                    <div className="text-success" style={{ fontSize: "0.75rem" }}>
                      + Lettino disp.
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              as={Link}
              to={`/camere/${_id}`}
              variant="outline-primary"
              className="w-100 fw-bold py-2 rounded-2"
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
