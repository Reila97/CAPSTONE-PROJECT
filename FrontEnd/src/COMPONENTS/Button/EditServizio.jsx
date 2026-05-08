import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader"; // Assicurati che il percorso sia corretto

const API_URL = import.meta.env.VITE_BACK_END;

function EditServizio({ servizio, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Stato del form limitato ai dati testuali
  const [formData, setFormData] = useState({ 
    _id: "", 
    nome: "", 
    costoExtra: 0, 
    icona: "" 
  });

  useEffect(() => {
    if (servizio && show) {
      setFormData({
        _id: servizio._id || servizio.id || "",
        nome: servizio.nome || "",
        costoExtra: servizio.costoExtra ?? 0,
        icona: servizio.icona || ""
      });
    }
  }, [servizio, show]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      // Ora inviamo solo JSON, molto più pulito
      const res = await fetch(`http://localhost:3002/servizi/${formData._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          nome: formData.nome,
          costoExtra: formData.costoExtra,
        }),
      });

      if (res.ok) {
        onUpdate(); // Ricarica la tabella
        setShow(false);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Errore nel salvataggio");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill px-3 shadow-sm" onClick={() => setShow(true)}>
        <PencilSquare />
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Modifica Servizio</Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nome Servizio</Form.Label>
              <Form.Control 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Costo Extra (€)</Form.Label>
              <Form.Control 
                type="number" 
                name="costoExtra" 
                value={formData.costoExtra} 
                onChange={handleChange} 
                min="0"
              />
            </Form.Group>

            {/* SEZIONE UPLOADER UNIVERSALE */}
            <div className="border rounded p-3 bg-light">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="small fw-bold mb-0">Immagine Identificativa</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    Aggiorna l'icona
                  </p>
                </div>
                <UniversalUploader 
                  endpoint={`http://localhost:3002/servizi/${formData._id}/icona`}
                  fieldName="icona"
                  onUploadSuccess={(data) => {
                    // Aggiorniamo l'anteprima locale
                    setFormData(prev => ({ ...prev, icona: data.icona }));
                    onUpdate(); // Aggiorna la tabella per mostrare subito la nuova immagine
                  }}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="border-0">
            <Button variant="light" onClick={() => setShow(false)}>Annulla</Button>
            <Button variant="dark" type="submit" disabled={loading} className="px-4">
              {loading ? <Spinner size="sm" /> : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default EditServizio;