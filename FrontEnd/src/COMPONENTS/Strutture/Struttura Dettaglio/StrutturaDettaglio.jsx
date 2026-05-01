import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Badge, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

import CamereClient from "../../Camere/CamereClient/CamereClient";
import "./StrutturaDettaglio.css";

function StrutturaDettaglio() {
  const { id } = useParams();
  const [struttura, setStruttura] = useState(null);
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

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (!struttura)
    return (
      <Container className="mt-5 text-center">
        <h3>Struttura non trovata</h3>
        <Button variant="dark" onClick={() => navigate("/strutture")}>
          Torna alla vetrina
        </Button>
      </Container>
    );

  return (
    <Container className="my-5">
      <Button
        variant="link"
        className="bodyCopy text-dark p-0 mb-4"
        onClick={() => navigate(-1)}
      >
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

            <p className="bodyCopy lead text-muted">
              {struttura.località?.città} ({struttura.località?.provincia})
            </p>

            <div className="my-4">
              <h5 className="headLine fw-bold text-uppercase small">
                Descrizione
              </h5>
              <p className="bodyCopy">{struttura.descrizione}</p>
            </div>

            <div className="bg-light p-4 border">
              <h5 className="headLine fw-bold small text-uppercase">
                Informazioni e Contatti
              </h5>
              <p className="bodyCopy mb-1">
                <strong>Indirizzo:</strong> {struttura.località?.indirizzo}
              </p>
              <p className=" bodyCopy mb-1">
                <strong>Email:</strong> {struttura.contatti?.email}
              </p>
              <p className="bodyCopy mb-0">
                <strong>Telefono:</strong> {struttura.contatti?.telefono}
              </p>
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

      {/* Passa l'array di camere della singola struttura */}
      <CamereClient camereDati={struttura.camere} />
    </Container>
  );
}

export default StrutturaDettaglio;