import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PersonPlusFill } from "react-bootstrap-icons";

const CreateUser = ({ onCreated }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialForm = {
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    isAdmin: false,
    avatar: ""
  };

  const [formData, setFormData] = useState(initialForm);

  const handleClose = () => {
    setShow(false);
    setFormData(initialForm);
    setError(null);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3002/users", { // Assicurati che l'endpoint sia corretto
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onCreated(); // Ricarica la lista utenti nella tabella
        handleClose();
      } else {
        const data = await res.json();
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

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Registra Nuovo Utente</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Cognome</Form.Label>
                  <Form.Control name="cognome" value={formData.cognome} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Password (min. 6 car.)</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Data di Nascita</Form.Label>
                  <Form.Control type="date" name="dataDiNascita" value={formData.dataDiNascita} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">URL Avatar (opzionale)</Form.Label>
              <Form.Control name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://..." />
            </Form.Group>

            <Form.Group className="mb-3 mt-4">
              <Form.Check 
                type="switch"
                id="admin-switch"
                label="Assegna privilegi di Amministratore"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="primary" type="submit" disabled={loading} className="px-4">
              {loading ? <Spinner size="sm" /> : "Crea Account"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;