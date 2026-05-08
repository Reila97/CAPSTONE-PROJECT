import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { DoorOpen, Image as ImageIcon, Images } from "react-bootstrap-icons";
import UniversalUploader from "../Button/UniversalUploader.jsx";

const API_URL = import.meta.env.VITE_BACK_END;

const INITIAL_FORM = {
  strutturaId: "",
  nome: "",
  descrizione: "",
  tipologia: "Singola",
  capienza: { maxAdulti: 1, possibilitàLettino: false },
  prezzoPerNotte: "",
};

function CreateCamera({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [strutture, setStrutture] = useState([]);
  const [newRoomId, setNewRoomId] = useState(null);
  const [imagesData, setImagesData] = useState({ mainImage: "", gallery: [] });
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Caricamento strutture migliorato
  useEffect(() => {
    if (show) {
      const fetchStrutture = async () => {
        try {
          const res = await fetch(`${API_URL}/strutture`);
          if (!res.ok) throw new Error("Errore nel caricamento delle strutture");
          const data = await res.json();
          setStrutture(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchStrutture();
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    setFormData(INITIAL_FORM);
    setNewRoomId(null);
    setImagesData({ mainImage: "", gallery: [] });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Gestione nidificata degli oggetti (capienza)
    if (name.startsWith("capienza.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        capienza: { 
          ...prev.capienza, 
          [field]: type === "checkbox" ? checked : value 
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sessione scaduta. Effettua nuovamente il login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/camere`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setNewRoomId(data._id);
        if (onCreated) onCreated(); // Chiamata sicura
      } else {
        throw new Error(data.message || "Errore durante la creazione della camera");
      }
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
      <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
        <DoorOpen className="me-2" /> Nuova Camera
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            {newRoomId ? "🎨 Aggiungi le immagini" : "📝 Dati Camera"}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="pt-0">
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

          {!newRoomId ? (
            /* STEP 1: FORM DATI */
            <Form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Struttura di Appartenenza *</Form.Label>
                <Form.Select name="strutturaId" value={formData.strutturaId} onChange={handleChange} required>
                  <option value="">Seleziona una struttura...</option>
                  {strutture.map(s => <option key={s._id} value={s._id}>{s.nome}</option>)}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={7}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Nome Camera *</Form.Label>
                    <Form.Control name="nome" value={formData.nome} onChange={handleChange} required placeholder="es: Suite Presidenziale" />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Tipologia *</Form.Label>
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
                <Form.Label className="small fw-bold">Descrizione *</Form.Label>
                <Form.Control as="textarea" rows={3} name="descrizione" value={formData.descrizione} onChange={handleChange} required />
              </Form.Group>

              <Row className="mb-4 align-items-center">
                <Col md={4}>
                  <Form.Label className="small fw-bold">Max Adulti *</Form.Label>
                  <Form.Control type="number" name="capienza.maxAdulti" value={formData.capienza.maxAdulti} onChange={handleChange} min="1" required />
                </Col>
                <Col md={4}>
                  <Form.Label className="small fw-bold">Prezzo (€) *</Form.Label>
                  <Form.Control type="number" name="prezzoPerNotte" value={formData.prezzoPerNotte} onChange={handleChange} min="0" required />
                </Col>
                <Col md={4} className="mt-4">
                  <Form.Check type="switch" label="Possibilità Lettino" name="capienza.possibilitàLettino" checked={formData.capienza.possibilitàLettino} onChange={handleChange} />
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Salva e Carica Foto"}
              </Button>
            </Form>
          ) : (
            /* STEP 2: UPLOAD IMMAGINI */
            <div className="animate__animated animate__fadeIn">
              <Alert variant="success" className="border-0 shadow-sm">
                Ottimo! La camera è stata salvata. Ora completa il profilo con le foto.
              </Alert>
              
              <Row className="g-3">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light text-center h-100">
                    <div className="mb-2">
                      <ImageIcon className="text-primary" size={24} />
                      <div className="small fw-bold mt-1">Copertina Principale</div>
                    </div>
                    <UniversalUploader
                      endpoint={`${API_URL}/camere/${newRoomId}/images`}
                      fieldName="images"
                      method="PATCH"
                      onUploadSuccess={(data) => setImagesData(prev => ({ ...prev, mainImage: data.images.mainImage }))}
                    />
                    {imagesData.mainImage && <Badge bg="success" className="mt-2">Caricata ✓</Badge>}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="p-3 border rounded bg-light text-center h-100">
                    <div className="mb-2">
                      <Images className="text-success" size={24} />
                      <div className="small fw-bold mt-1">Galleria Immagini</div>
                    </div>
                    <UniversalUploader
                      endpoint={`${API_URL}/camere/${newRoomId}/gallery`}
                      fieldName="gallery"
                      method="PATCH"
                      multiple={true}
                      onUploadSuccess={(data) => setImagesData(prev => ({ ...prev, gallery: data.images.gallery }))}
                    />
                    <Badge bg="info" className="mt-2">{imagesData.gallery.length} foto caricate</Badge>
                  </div>
                </Col>
              </Row>

              <Button variant="dark" className="w-100 mt-4 py-2 fw-bold" onClick={handleClose}>
                Termina Configurazione
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateCamera;