import { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader";

function CreateServizio ({ onCreated })  {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialForm = { nome: "", icona: "", costoExtra: 0 };
  const [formData, setFormData] = useState(initialForm);

  const handleClose = () => {
    setShow(false);
    setFormData(initialForm);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Invia i dati come JSON semplice
      const res = await fetch("http://localhost:3002/servizi", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onCreated();
        handleClose();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Errore nella creazione");
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
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                required 
              />
            </Form.Group>

            {/* Sezione Upload Immagine */}
            <div className="bg-light p-3 rounded mb-3 border">
              <p className="small fw-bold mb-2">Immagine Servizio</p>
              <div className="d-flex align-items-center gap-3">


                <UniversalUploader 
                  endpoint="http://localhost:3002/servizi/temp-upload"
                  fieldName="icona"
                  method="POST"
                  onUploadSuccess={(data) => {
                    // 'data.url' è quello che restituisce la rotta temp-upload
                    setFormData({ ...formData, icona: data.url });
                  }}
                />
                {formData.icona && (
                  <img 
                    src={formData.icona} 
                    alt="Preview" 
                    style={{ width: "40px", height: "40px", objectFit: "cover" }} 
                    className="rounded border"
                  />
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="primary" type="submit" disabled={loading || !formData.nome}>
              {loading ? <Spinner size="sm" /> : "Salva Servizio"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateServizio