import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditProfile ({ user, onUpdate })  {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Inizializziamo lo stato con i dati attuali dell'utente
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    cognome: user?.cognome || "",
    email: user?.email || "",
    dataDiNascita: user?.dataDiNascita ? user.dataDiNascita.split('T')[0] : "",
    password: "" // La lasciamo vuota, la inserisce solo se vuole cambiarla
  });

  const handleClose = () => {
    setShow(false);
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

    try {
      const token = localStorage.getItem("token");
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;

      const res = await fetch(`http://localhost:3002/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        onUpdate(updatedUser); // Funzione per aggiornare la UI nel componente padre
        handleClose();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Errore durante l'aggiornamento");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill px-3" onClick={handleShow}>
        <PencilSquare className="me-2" />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome</Form.Label>
                  <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Cognome</Form.Label>
                  <Form.Control type="text" name="cognome" value={formData.cognome} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Data di Nascita</Form.Label>
              <Form.Control type="date" name="dataDiNascita" value={formData.dataDiNascita} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nuova Password (opzionale)</Form.Label>
              <Form.Control type="password" name="password" placeholder="Lascia vuoto per non cambiare" onChange={handleChange} />
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
};

export default EditProfile;