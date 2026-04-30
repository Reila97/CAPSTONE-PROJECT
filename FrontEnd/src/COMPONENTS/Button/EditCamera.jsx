import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditCamera({ camera, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [strutture, setStrutture] = useState([]);

  const [formData, setFormData] = useState({
    strutturaId: camera.strutturaId?._id || camera.strutturaId || "",
    nome: camera.nome,
    descrizione: camera.descrizione,
    tipologia: camera.tipologia,
    maxAdulti: camera.capienza.maxAdulti,
    possibilitàLettino: camera.capienza.possibilitàLettino,
    prezzoPerNotte: camera.prezzoPerNotte,
    mainImage: camera.images.mainImage
  });

  // Carichiamo le strutture per il dropdown se necessario cambiare l'appartenenza
  useEffect(() => {
    if (show) {
      fetch("http://localhost:3002/strutture")
        .then(res => res.json())
        .then(data => setStrutture(data))
        .catch(err => console.error("Errore fetch strutture", err));
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    setError(null);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const bodyPayload = {
      strutturaId: formData.strutturaId,
      nome: formData.nome,
      descrizione: formData.descrizione,
      tipologia: formData.tipologia,
      capienza: {
        maxAdulti: Number(formData.maxAdulti),
        possibilitàLettino: formData.possibilitàLettino
      },
      prezzoPerNotte: Number(formData.prezzoPerNotte),
      images: {
        mainImage: formData.mainImage,
        gallery: camera.images.gallery // Manteniamo la gallery esistente
      }
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3002/camere/${camera._id}`, {
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
        const errData = await res.json();
        throw new Error(errData.message || "Errore aggiornamento camera");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill" onClick={handleShow}>
        <PencilSquare />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Modifica Camera</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Struttura</Form.Label>
              <Form.Select name="strutturaId" value={formData.strutturaId} onChange={handleChange} required>
                <option value="">Seleziona Struttura</option>
                {strutture.map(s => (
                  <option key={s._id} value={s._id}>{s.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome Camera</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Tipologia</Form.Label>
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
              <Form.Label className="small fw-bold">Descrizione</Form.Label>
              <Form.Control as="textarea" rows={2} name="descrizione" value={formData.descrizione} onChange={handleChange} required />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Max Adulti</Form.Label>
                  <Form.Control type="number" name="maxAdulti" value={formData.maxAdulti} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Prezzo (€)</Form.Label>
                  <Form.Control type="number" name="prezzoPerNotte" value={formData.prezzoPerNotte} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Form.Check 
                  type="switch"
                  label="Lettino disponibile"
                  name="possibilitàLettino"
                  className="mb-3"
                  checked={formData.possibilitàLettino}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">URL Immagine Principale</Form.Label>
              <Form.Control name="mainImage" value={formData.mainImage} onChange={handleChange} required />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer className="border-0">
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

export default EditCamera;