import { Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router";

function CameraCard({ camera }) {
  const prezzo = camera.prezzoPerNotte;
  const mainImage = camera.images?.mainImage;
  const idCamera = camera._id;

  // 1. Definiamo il limite di caratteri
  const MAX_CARATTERI = 80;

  // 2. Funzione per troncare il testo
  const troncaTesto = (testo, limite) => {
    if (!testo) return "";
    if (testo.length <= limite) return testo;
    return testo.substring(0, limite) + "...";
  };

  return (
    <Col
      className="d-flex align-items-stretch" >
      <Card className="h-100 border rounded-0 shadow-sm">
        {mainImage && (
          <Card.Img
            variant="top"
            src={camera.images.mainImage}
            alt={camera.nome} 
            className="rounded-0"
            style={{ height: "200px", objectFit: "cover" }}
          />
        )}
        <Card.Body className="d-flex flex-column">
          <h4 className="headLine fw-bold h5 mb-2">{camera.nome}</h4>

          <p className="bodyCopy text-muted small mb-3 flex-grow-1">
            {troncaTesto(camera.descrizione, MAX_CARATTERI)}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="bodyCopy fw-bold text-danger">
              €{camera.prezzoPerNotte} / notte
            </span>
            {camera.capienza && (
              <div className="bodyCopy small text-muted">
                <p className="mb-0">Ospiti max: {camera.capienza.maxAdulti}</p>
                {camera.capienza.possibilitàLettino && (
                  <p className="mb-0 text-success">
                    Lettino aggiuntivo disponibile
                  </p>
                )}
              </div>
            )}
          </div>
          <Button
            as={Link}
            to={`/camere/${idCamera}`}
            className="w-100 rounded-0 mt-3"
          >
            VEDI DETTAGLI
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default CameraCard;
