import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";

function CreateStruttura ({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stato iniziale vuoto (seguendo il tuo schema)
  const initialForm = {
    nome: "",
    descrizione: "",
    indirizzo: "",
    città: "",
    provincia: "",
    zipCode: "",
    email: "",
    telefono: "",
    mainImage: "",
    basePrice: "",
    cancellation: "Flessibile"
  };

  const [formData, setFormData] = useState(initialForm);

  const handleClose = () => {
    setShow(false);
    setFormData(initialForm);
    setError(null);
  };
  
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Costruiamo l'oggetto nidificato per il backend
    const bodyPayload = {
      nome: formData.nome,
      descrizione: formData.descrizione,
      località: {
        indirizzo: formData.indirizzo,
        città: formData.città,
        provincia: formData.provincia,
        zipCode: formData.zipCode
      },
      contatti: {
        email: formData.email,
        telefono: formData.telefono,
        // Qui dovresti passare l'ID dell'admin loggato se il backend lo richiede
        manager: "65f1234567890abcdef12345" // Esempio ID o recuperalo dal context
      },
      images: {
        mainImage: formData.mainImage,
        gallery: []
      },
      policies: {
        basePrice: Number(formData.basePrice),
        cancellation: formData.cancellation
      }
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3002/strutture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        onCreated(); // Ricarica la lista nella tabella admin
        handleClose();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Errore nella creazione");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="success" className="rounded-pill px-4 fw-bold" onClick={handleShow}>
        <PlusLg className="me-2" /> Nuova Struttura
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Aggiungi Nuova Struttura</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome Struttura</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleChange} placeholder="Es: Villa Paradiso" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Prezzo a Notte (€)</Form.Label>
                  <Form.Control type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Descrizione</Form.Label>
              <Form.Control as="textarea" rows={3} name="descrizione" value={formData.descrizione} onChange={handleChange} required />
            </Form.Group>

            <h6 className="text-muted border-bottom pb-2 mt-4 small fw-bold">LOCALIZZAZIONE</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Indirizzo</Form.Label>
                  <Form.Control name="indirizzo" value={formData.indirizzo} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Città</Form.Label>
                  <Form.Control name="città" value={formData.città} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Provincia</Form.Label>
                  <Form.Control name="provincia" value={formData.provincia} onChange={handleChange} maxLength={2} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">CAP</Form.Label>
                  <Form.Control name="zipCode" value={formData.zipCode} onChange={handleChange} maxLength={5} required />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-muted border-bottom pb-2 mt-4 small fw-bold">MEDIA E CONTATTI</h6>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">URL Immagine Principale</Form.Label>
              <Form.Control name="mainImage" value={formData.mainImage} onChange={handleChange} placeholder="https://..." required />
            </Form.Group>
            
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Email Contatto</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Telefono</Form.Label>
                        <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </Form.Group>
                </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="success" type="submit" disabled={loading} className="px-4">
              {loading ? <Spinner size="sm" /> : "Crea Struttura"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateStruttura;