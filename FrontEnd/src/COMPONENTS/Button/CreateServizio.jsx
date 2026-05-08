import { useState } from "react";
import { Modal, Button, Form, Spinner, Alert, Badge } from "react-bootstrap";
import { PlusCircleFill, CheckCircleFill } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader";

const API_URL = import.meta.env.VITE_BACK_END;

// Stato iniziale fuori per performance e pulizia
const INITIAL_FORM = { 
  nome: "", 
  icona: "", 
  costoExtra: 0 
};

function CreateServizio({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleClose = () => {
    setShow(false);
    setFormData(INITIAL_FORM);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sessione scaduta. Per favore effettua il login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/servizi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (onCreated) onCreated(); // Chiamata sicura alla callback
        handleClose();
      } else {
        throw new Error(data.message || "Errore nella creazione del servizio");
      }
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
        className="rounded-pill px-4 fw-bold shadow-sm" 
        onClick={() => setShow(true)}
      >
        <PlusCircleFill className="me-2" /> Nuovo Servizio
      </Button>

      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Registra Nuovo Servizio</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Nome Servizio *</Form.Label>
              <Form.Control
                name="nome"
                placeholder="es. Colazione, Noleggio Bici..."
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Sezione Upload Immagine */}
            <div className="bg-light p-3 rounded mb-3 border shadow-sm">
              <p className="small fw-bold mb-2">Icona o Immagine Servizio</p>
              <div className="d-flex align-items-center gap-3">
                <UniversalUploader
                  endpoint={`${API_URL}/servizi/temp-upload`}
                  fieldName="icona"
                  method="POST"
                  onUploadSuccess={(data) => {
                    // Verifichiamo che data.url esista
                    if (data?.url) {
                      setFormData((prev) => ({ ...prev, icona: data.url }));
                    }
                  }}
                />

                {formData.icona ? (
                  <div className="position-relative">
                    <img
                      src={formData.icona}
                      alt="Preview"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      className="rounded border shadow-sm"
                    />
                    <Badge 
                      bg="success" 
                      className="position-absolute top-0 start-100 translate-middle p-1 rounded-circle"
                    >
                      <CheckCircleFill size={12} />
                    </Badge>
                  </div>
                ) : (
                  <div 
                    className="rounded border d-flex align-items-center justify-content-center bg-white text-muted"
                    style={{ width: "50px", height: "50px", fontSize: "0.7rem" }}
                  >
                    No Icon
                  </div>
                )}
              </div>
              <Form.Text className="text-muted mt-2 d-block">
                Carica un'immagine per identificare il servizio.
              </Form.Text>
            </div>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={handleClose} disabled={loading}>
              Annulla
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="px-4"
              disabled={loading || !formData.nome}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" /> Salvataggio...
                </>
              ) : (
                "Salva Servizio"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CreateServizio;