import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { PencilSquare, CameraFill } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader.jsx";

const API_URL = import.meta.env.VITE_BACK_END;

function EditProfile({ user, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  // Funzione per inizializzare i dati (chiamata all'apertura del modal)
  const initForm = () => {
    setFormData({
      nome: user?.nome || "",
      cognome: user?.cognome || "",
      email: user?.email || "",
      dataDiNascita: user?.dataDiNascita ? user.dataDiNascita.split('T')[0] : "",
      password: "",
      avatar: user?.avatar || ""
    });
  };

  const handleShow = () => {
    initForm();
    setShow(true);
  };

  const handleClose = () => {
    if (!loading) {
      setShow(false);
      setError(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Creazione di un payload pulito
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      // Rimuoviamo l'avatar dal PUT se lo gestisci separatamente con l'uploader
      // delete payload.avatar; 

      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onUpdate(data);
        handleClose();
      } else {
        throw new Error(data.message || "Errore durante l'aggiornamento");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill px-3 shadow-sm" onClick={handleShow}>
        <PencilSquare className="me-2" /> Modifica Profilo
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        size="md" 
        backdrop={loading ? "static" : true}
      >
        <Modal.Header closeButton={!loading} className="border-0">
          <Modal.Title className="fw-bold">Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

          {/* SEZIONE UPLOAD AVATAR */}
          <div className="text-center mb-4 p-3 border rounded bg-light shadow-sm">
            <div className="position-relative d-inline-block mb-2">
              <img
                src={formData.avatar || "https://via.placeholder.com/100"}
                alt="Avatar"
                className="rounded-circle border shadow-sm"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <Badge 
                bg="dark" 
                className="position-absolute bottom-0 end-0 p-2 rounded-circle border border-white"
              >
                <CameraFill size={14} />
              </Badge>
            </div>
            
            <div className="mt-2">
              <UniversalUploader
                endpoint={`${API_URL}/users/${user._id}/avatar`}
                fieldName="avatar"
                method="PATCH"
                onUploadSuccess={(data) => {
                  setFormData(prev => ({ ...prev, avatar: data.avatar }));
                  onUpdate(data);
                }}
              />
              <p className="text-muted small mt-1">Carica una nuova immagine di profilo</p>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
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

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Data di Nascita</Form.Label>
              <Form.Control type="date" name="dataDiNascita" value={formData.dataDiNascita} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nuova Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                placeholder="Lascia vuoto per non cambiare" 
                value={formData.password}
                onChange={handleChange} 
                autoComplete="new-password"
              />
            </Form.Group>

            <Modal.Footer className="border-0 px-0 pb-0 mt-3">
              <Button variant="light" onClick={handleClose} disabled={loading}>Annulla</Button>
              <Button variant="dark" type="submit" disabled={loading} className="px-4 fw-bold">
                {loading ? <Spinner size="sm" className="me-2" /> : "Salva Modifiche"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditProfile;