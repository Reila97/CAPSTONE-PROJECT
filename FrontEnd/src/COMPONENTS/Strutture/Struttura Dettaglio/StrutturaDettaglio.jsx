import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Badge, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const StrutturaDettaglio = () => {
  const { id } = useParams();
  const [struttura, setStruttura] = useState(null); // Singolo oggetto, non array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDettaglio = async () => {
      try {
        const res = await fetch(`http://localhost:3002/strutture/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStruttura(data);
        }
      } catch (err) {
        console.error("Errore caricamento dettaglio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDettaglio();
  }, [id]);

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  
  if (!struttura) return (
    <Container className="mt-5 text-center">
      <h3>Struttura non trovata</h3>
      <Button variant="dark" onClick={() => navigate("/strutture")}>Torna alla vetrina</Button>
    </Container>
  );

  return (
    <Container className="my-5">

      <Button variant="link" className="bodyCopy text-dark p-0 mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft /> Torna indietro
      </Button>
      

      <Row className="gy-4">

        <Col lg={7}>
          <img 
            src={struttura.images?.mainImage} 
            alt={struttura.nome} 
            className="img-fluid rounded-0 shadow-sm w-100" 
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </Col>


        <Col lg={5}>
          <div className="ps-lg-4">

            <Badge bg="danger" className="mb-2 rounded-0 px-3 py-2">
              a partire da €{struttura.policies?.basePrice} / notte
            </Badge>

            <h1 className="headLine display-5 fw-bold">{struttura.nome}</h1>

            <p className="bodyCopy lead text-muted">{struttura.località?.città} ({struttura.località?.provincia})</p>
            
            <div className="my-4">
              <h5 className="headLine fw-bold text-uppercase small">Descrizione</h5>

              <p className="bodyCopy">{struttura.descrizione}</p>
            </div>


            <div className="bg-light p-4 border">
              <h5 className="headLine fw-bold small text-uppercase">Informazioni e Contatti</h5>

              <p className="bodyCopy mb-1"><strong>Indirizzo:</strong> {struttura.località?.indirizzo}</p>

              <p className=" bodyCopy mb-1"><strong>Email:</strong> {struttura.contatti?.email}</p>

              <p className="bodyCopy mb-0"><strong>Telefono:</strong> {struttura.contatti?.telefono}</p>

            </div>

            <Button className="prenotaButton w-100 mt-4 py-3 rounded-0 fw-bold">
                PRENOTA ORA
            </Button>

          </div>
        </Col>
      </Row>

      {/* SEZIONE CAMERE DISPONIBILI */}
<hr className="my-5" />

<h2 className="headLine fw-bold mb-4">Le nostre camere</h2>

<Row className="gy-4">
  {struttura.camere && struttura.camere.length > 0 ? (
    struttura.camere.map((camera) => (
      <Col key={camera._id} md={6} lg={4}>
        <div className="card h-100 rounded-0 border-0 shadow-sm overflow-hidden">
          {/* Immagine Camera */}
          <img 
            src={camera.images?.mainImage} 
            className="card-img-top rounded-0" 
            alt={camera.nome} 
            style={{ height: "200px", objectFit: "cover" }}
          />
          
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h4 className="headLine fw-bold m-0">{camera.nome}</h4>
              <Badge bg="dark" className="rounded-0">{camera.tipologia}</Badge>
            </div>

            <p className="bodyCopy small text-muted text-truncate mb-3">
              {camera.descrizione}
            </p>

            <div className="mb-3">
              <h6 className="small fw-bold text-uppercase">Servizi inclusi:</h6>
              <div className="d-flex flex-wrap gap-1">
                {camera.servizi?.map((servizio) => (
                  <Badge key={servizio._id} bg="light" text="dark" className="border">
                    {servizio.nome}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
              <div>
                <span className="display-6 fs-4 fw-bold">€{camera.prezzoPerNotte}</span>
                <small className="text-muted"> / notte</small>
              </div>
              <Button variant="outline-danger" size="sm" className="rounded-0 fw-bold">
                SELEZIONA
              </Button>
            </div>
          </div>
        </div>
      </Col>
    ))
  ) : (
    <Col>
      <p className="bodyCopy text-muted">Non ci sono camere disponibili al momento per questa struttura.</p>
    </Col>
  )}
</Row>

    </Container>
  );
};

export default StrutturaDettaglio;