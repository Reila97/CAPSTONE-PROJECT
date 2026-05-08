import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PersonPlusFill } from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_BACK_END;

// Stato iniziale fuori dal componente
const INITIAL_FORM = {
  nome: "",
  cognome: "",
  email: "",
  password: "",
  dataDiNascita: "",
  isAdmin: false,
  avatar: ""
};

const CreateUser = ({ onCreated }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleClose = () => {
    setShow(false);
    setFormData(INITIAL_FORM);
    setError(null);
  };
  
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Preparazione payload con pulizia dati
    const payload = { ...formData };
    
    // Se l'avatar è una stringa vuota, lo rimuoviamo per evitare CastError su Mongoose
    if (!payload.avatar || payload.avatar.trim() === "") {
      delete payload.avatar;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onCreated?.(); // Chiamata sicura
        handleClose();
      } else {
        throw new Error(data.message || "Errore durante la creazione dell'utente");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleShow}>
        <PersonPlusFill className="me-2" /> Nuovo Utente
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Registra Nuovo Utente</Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pt-0">
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome *</Form.Label>
                  <Form.Control 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Cognome *</Form.Label>
                  <Form.Control 
                    name="cognome" 
                    value={formData.cognome} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email *</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Password * (min. 6 car.)</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    minLength={6} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Data di Nascita *</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="dataDiNascita" 
                    value={formData.dataDiNascita} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">URL Avatar (opzionale)</Form.Label>
              <Form.Control 
                name="avatar" 
                value={formData.avatar} 
                onChange={handleChange} 
                placeholder="https://link-immagine.com/foto.jpg" 
              />
            </Form.Group>

            <Form.Group className="mb-3 mt-4 p-3 bg-light rounded border">
              <Form.Check 
                type="switch"
                id="admin-switch"
                label="Assegna privilegi di Amministratore"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Gli amministratori possono gestire strutture, camere e altri utenti.
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose} disabled={loading}>Annulla</Button>
            <Button variant="primary" type="submit" disabled={loading} className="px-4 fw-bold">
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" /> Creazione...
                </>
              ) : (
                "Crea Account"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;