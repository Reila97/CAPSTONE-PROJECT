import { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";

const CreateServizio = ({ onCreated }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialForm = {
    nome: "",
    icona: "" // Stringa che può contenere il nome di una classe icona o un URL
  };

  const [formData, setFormData] = useState(initialForm);

  const handleClose = () => {
    setShow(false);
    setFormData(initialForm);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3002/servizi", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onCreated();
        handleClose();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Errore nella creazione del servizio");
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <>
      <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
        <PlusCircleFill className="me-2" /> Nuovo Servizio
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Registra Servizio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nome Servizio *</Form.Label>
              <Form.Control 
                name="nome" 
                placeholder="Es: Wi-Fi, Parcheggio..." 
                value={formData.nome} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Icona (Nome o URL)</Form.Label>
              <Form.Control 
                name="icona" 
                placeholder="Es: wifi-icon oppure URL immagine" 
                value={formData.icona} 
                onChange={handleChange} 
              />
              <Form.Text className="text-muted">
                Puoi inserire un nome identificativo per l'icona o un link.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Salva Servizio"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateServizio;