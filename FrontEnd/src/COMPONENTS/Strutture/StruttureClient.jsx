import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { GeoAlt, Telephone, Envelope } from "react-bootstrap-icons";

function StruttureClient() {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/strutture")
      .then(res => res.json())
      .then(data => setStrutture(data))
      .catch(err => console.error("Errore fetch vetrina:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="my-5">
      <h2 className="text-center mb-5 fw-bold text-uppercase">Le Nostre Strutture</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {strutture.map((s) => (
          <Col key={s._id}>
            <Card className="h-100 border-0 shadow-sm overflow-hidden hover-shadow transition">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Card.Img variant="top" src={s.images.mainImage} className="h-100 object-fit-cover" />
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="fw-bold mb-0">{s.nome}</Card.Title>
                  <Badge bg="dark">€{s.policies.basePrice}/notte</Badge>
                </div>
                <Card.Text className="text-muted small">
                  <GeoAlt className="me-1" /> {s.località.città}, {s.località.indirizzo}
                </Card.Text>
                <Card.Text className="">
                  {s.descrizione}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white border-0 pb-3">
                <Button href={`/strutture/${s._id}`} variant="outline-dark" className="w-100 rounded-0">VEDI DETTAGLI</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StruttureClient;