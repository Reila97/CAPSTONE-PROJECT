import { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PlusLg, CalendarPlus } from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_BACK_END;

function CreatePrenotazione({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stati per il form
  const [strutture, setStrutture] = useState([]);
  const [camere, setCamere] = useState([]);
  const [formData, setFormData] = useState({
    struttura: "",
    camera: "",
    checkIn: "",
    checkOut: ""
  });

  const handleClose = () => {
    setShow(false);
    setError(null);
    setFormData({ struttura: "", camera: "", checkIn: "", checkOut: "" });
  };
  
  const handleShow = () => setShow(true);

  // Carica le strutture all'apertura del Modal
  useEffect(() => {
    if (show) {
      fetch(`${API_URL}/strutture`)
        .then(res => res.json())
        .then(data => setStrutture(data))
        .catch(() => setError("Errore nel caricamento delle strutture"));
    }
  }, [show]);

  // Carica le camere quando viene selezionata una struttura
  useEffect(() => {
    if (formData.struttura) {
      fetch(`${API_URL}/camere/struttura/${formData.struttura}`)
        .then(res => res.json())
        .then(data => setCamere(data))
        .catch(() => setError("Errore nel caricamento delle camere"));
    } else {
      setCamere([]);
    }
  }, [formData.struttura]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella creazione");

      if (onCreated) onCreated(); // Refresh della lista
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm fw-bold"
        onClick={handleShow}
      >
        <PlusLg /> Nuova Prenotazione
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <CalendarPlus className="me-2 text-primary" />
            Inserisci Prenotazione
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body className="py-4">
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            
            <Row className="g-3">
              {/* Selezione Struttura */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Struttura</Form.Label>
                  <Form.Select 
                    required
                    value={formData.struttura}
                    onChange={(e) => setFormData({...formData, struttura: e.target.value, camera: ""})}
                    className="rounded-3"
                  >
                    <option value="">Seleziona struttura...</option>
                    {strutture.map(s => <option key={s._id} value={s._id}>{s.nome}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Selezione Camera */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Camera</Form.Label>
                  <Form.Select 
                    required
                    disabled={!formData.struttura}
                    value={formData.camera}
                    onChange={(e) => setFormData({...formData, camera: e.target.value})}
                    className="rounded-3"
                  >
                    <option value="">Seleziona camera...</option>
                    {camere.map(c => <option key={c._id} value={c._id}>{c.nome} ({c.prezzo}€)</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Date */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Check-In</Form.Label>
                  <Form.Control 
                    type="date" 
                    required
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Check-Out</Form.Label>
                  <Form.Control 
                    type="date" 
                    required
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={handleClose} className="rounded-pill px-4">
              Annulla
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="rounded-pill px-4 shadow-sm"
            >
              {loading ? <Spinner size="sm" /> : "Conferma Prenotazione"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CreatePrenotazione;
