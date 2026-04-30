import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { DoorOpen } from "react-bootstrap-icons";

function CreateCamera({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [strutture, setStrutture] = useState([]); // Per collegare la camera a una struttura

  const initialForm = {
    strutturaId: "",
    nome: "",
    descrizione: "",
    tipologia: "Singola",
    capienza: {
      maxAdulti: 1,
      possibilitàLettino: false
    },
    prezzoPerNotte: "",
    images: {
      mainImage: "",
      gallery: []
    },
    servizi: []
  };

  const [formData, setFormData] = useState(initialForm);

  // Carichiamo le strutture per poterle selezionare nel form
  useEffect(() => {
    if (show) {
      fetch("http://localhost:3002/strutture")
        .then(res => res.json())
        .then(data => setStrutture(data))
        .catch(err => console.error("Errore caricamento strutture", err));
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    setFormData(initialForm);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("capienza.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        capienza: { ...prev.capienza, [field]: type === "checkbox" ? checked : value }
      }));
    } else if (name === "mainImage") {
      setFormData(prev => ({
        ...prev,
        images: { ...prev.images, mainImage: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3002/camere", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onCreated();
        handleClose();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Errore creazione camera");
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <>
      <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
        <DoorOpen className="me-2" /> Nuova Camera
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Aggiungi Camera al Backend</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Struttura di Appartenenza *</Form.Label>
              <Form.Select name="strutturaId" value={formData.strutturaId} onChange={handleChange} required>
                <option value="">Seleziona una struttura...</option>
                {strutture.map(s => <option key={s._id} value={s._id}>{s.nome}</option>)}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome Camera *</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Tipologia *</Form.Label>
                  <Form.Select name="tipologia" value={formData.tipologia} onChange={handleChange}>
                    <option value="Singola">Singola</option>
                    <option value="Doppia">Doppia</option>
                    <option value="Miniappartamento">Miniappartamento</option>
                    <option value="Camera Mansardata">Camera Mansardata</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Descrizione *</Form.Label>
              <Form.Control as="textarea" rows={2} name="descrizione" value={formData.descrizione} onChange={handleChange} required />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Max Adulti *</Form.Label>
                  <Form.Control type="number" name="capienza.maxAdulti" value={formData.capienza.maxAdulti} onChange={handleChange} min="1" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Prezzo per Notte *</Form.Label>
                  <Form.Control type="number" name="prezzoPerNotte" value={formData.prezzoPerNotte} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <Form.Check 
                  type="checkbox" 
                  label="Possibilità Lettino" 
                  name="capienza.possibilitàLettino" 
                  checked={formData.capienza.possibilitàLettino} 
                  onChange={handleChange} 
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">URL Immagine Principale *</Form.Label>
              <Form.Control name="mainImage" value={formData.images.mainImage} onChange={handleChange} required placeholder="https://..." />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Salva Camera"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCamera;