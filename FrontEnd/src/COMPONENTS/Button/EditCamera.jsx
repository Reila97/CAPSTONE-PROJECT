import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { PencilSquare, Images, Image as ImageIcon } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader";

const API_URL = import.meta.env.VITE_BACK_END;

function EditCamera({ camera, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [strutture, setStrutture] = useState([]);
  const [formData, setFormData] = useState({});

  // Carica le strutture solo una volta all'apertura del modal
  const fetchStrutture = useCallback(async () => {
    if (strutture.length > 0) return;
    try {
      const res = await fetch(`${API_URL}/strutture`);
      const data = await res.json();
      setStrutture(data);
    } catch (err) {
      console.error("Errore fetch strutture", err);
    }
  }, [strutture.length]);

  const handleShow = () => {
    setFormData({
      strutturaId: camera.strutturaId?._id || camera.strutturaId || "",
      nome: camera.nome || "",
      descrizione: camera.descrizione || "",
      tipologia: camera.tipologia || "Singola",
      maxAdulti: camera.capienza?.maxAdulti || 1,
      possibilitàLettino: camera.capienza?.possibilitàLettino || false,
      prezzoPerNotte: camera.prezzoPerNotte || 0,
      mainImage: camera.images?.mainImage || "",
      gallery: camera.images?.gallery || [],
    });
    fetchStrutture();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Costruiamo il payload rispettando la nidificazione del backend
    const bodyPayload = {
      strutturaId: formData.strutturaId,
      nome: formData.nome,
      descrizione: formData.descrizione,
      tipologia: formData.tipologia,
      capienza: {
        maxAdulti: Number(formData.maxAdulti),
        possibilitàLettino: formData.possibilitàLettino,
      },
      prezzoPerNotte: Number(formData.prezzoPerNotte),
      // Nota: assicurati che il backend accetti "images.mainImage" come chiave piatta 
      // o se preferisce l'oggetto images: { mainImage: ... }
      "images.mainImage": formData.mainImage,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/camere/${camera._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Errore aggiornamento camera");
      }

      onUpdate();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill shadow-sm" onClick={handleShow}>
        <PencilSquare />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Modifica Camera</Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Struttura</Form.Label>
              <Form.Select 
                name="strutturaId" 
                value={formData.strutturaId} 
                onChange={handleChange} 
                required
              >
                <option value="">Seleziona Struttura</option>
                {strutture.map((s) => (
                  <option key={s._id} value={s._id}>{s.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome Camera</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Tipologia</Form.Label>
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
              <Form.Label className="small fw-bold">Descrizione</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="descrizione" 
                value={formData.descrizione} 
                onChange={handleChange} 
              />
            </Form.Group>

            <hr className="my-4" />
            <h6 className="fw-bold mb-3">Multimedia</h6>
            
            <Row className="g-3">
              <Col md={6}>
                <div className="p-3 border rounded bg-light h-100 shadow-sm text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2 text-primary">
                    <ImageIcon className="me-2" />
                    <span className="small fw-bold">Immagine Principale</span>
                  </div>
                  <UniversalUploader
                    endpoint={`${API_URL}/camere/${camera._id}/images`}
                    fieldName="images"
                    onUploadSuccess={(updatedRoom) => {
                      setFormData(prev => ({ ...prev, mainImage: updatedRoom.images?.mainImage }));
                      onUpdate();
                    }}
                  />
                  {formData.mainImage && <Badge bg="success" className="mt-2">Aggiornata</Badge>}
                </div>
              </Col>

              <Col md={6}>
                <div className="p-3 border rounded bg-light h-100 shadow-sm text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2 text-success">
                    <Images className="me-2" />
                    <span className="small fw-bold">Gallery Foto</span>
                  </div>
                  <UniversalUploader
                    endpoint={`${API_URL}/camere/${camera._id}/gallery`}
                    fieldName="gallery"
                    method="PATCH"
                    multiple={true}
                    onUploadSuccess={(updatedRoom) => {
                      setFormData(prev => ({ ...prev, gallery: updatedRoom.images?.gallery || [] }));
                      onUpdate();
                    }}
                  />
                  <div className="mt-2">
                    <Badge bg="info" pill>{formData.gallery?.length || 0} foto</Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <hr className="my-4" />
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Max Adulti</Form.Label>
                  <Form.Control type="number" name="maxAdulti" value={formData.maxAdulti} onChange={handleChange} min={1} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Prezzo (€/notte)</Form.Label>
                  <Form.Control type="number" name="prezzoPerNotte" value={formData.prezzoPerNotte} onChange={handleChange} min={0} required />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-center justify-content-center">
                <Form.Check 
                    type="switch" 
                    label="Lettino Extra" 
                    name="possibilitàLettino" 
                    checked={formData.possibilitàLettino} 
                    onChange={handleChange} 
                />
              </Col>
            </Row>
          </Modal.Body>
          
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose} disabled={loading}>Annulla</Button>
            <Button variant="dark" type="submit" disabled={loading} className="px-4 fw-bold">
              {loading ? <Spinner size="sm" /> : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default EditCamera;