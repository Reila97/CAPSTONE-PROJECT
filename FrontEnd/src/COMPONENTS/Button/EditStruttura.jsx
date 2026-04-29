import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditStruttura({ struttura, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nome: struttura.nome,
    descrizione: struttura.descrizione,
    indirizzo: struttura.località.indirizzo,
    città: struttura.località.città,
    provincia: struttura.località.provincia,
    zipCode: struttura.località.zipCode,
    email: struttura.contatti.email, // Inizializzato correttamente
    telefono: struttura.contatti.telefono, // Inizializzato correttamente
    mainImage: struttura.images.mainImage,
    basePrice: struttura.policies.basePrice,
    cancellation: struttura.policies.cancellation
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        email: formData.email, // Ora prenderà il valore aggiornato dal form
        telefono: formData.telefono, // Ora prenderà il valore aggiornato dal form
        manager: struttura.contatti.manager
      },
      images: {
        mainImage: formData.mainImage
      },
      policies: {
        basePrice: Number(formData.basePrice),
        cancellation: formData.cancellation
      }
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3002/strutture/${struttura._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        onUpdate();
        handleClose();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante l'aggiornamento");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill me-2" onClick={handleShow}>
        <PencilSquare />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Struttura</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Struttura</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prezzo Base (€)</Form.Label>
                  <Form.Control type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control as="textarea" rows={3} name="descrizione" value={formData.descrizione} onChange={handleChange} required />
            </Form.Group>

            {/* SEZIONE LOCALITÀ */}
            <h6 className="text-muted border-bottom pb-2 mt-4">Località</h6>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Indirizzo</Form.Label>
                  <Form.Control name="indirizzo" value={formData.indirizzo} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Città</Form.Label>
                  <Form.Control name="città" value={formData.città} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            {/* SEZIONE CONTATTI (AGGIUNTA) */}
            <h6 className="text-muted border-bottom pb-2 mt-4">Contatti</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-muted border-bottom pb-2 mt-4">Media</h6>
            <Form.Group className="mb-3">
              <Form.Label>URL Immagine Principale</Form.Label>
              <Form.Control name="mainImage" value={formData.mainImage} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="dark" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default EditStruttura;