import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge, Image } from "react-bootstrap";
import { PencilSquare, Image as ImageIcon, Images } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader.jsx";

const API_URL = import.meta.env.VITE_BACK_END;

function EditStruttura({ struttura, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({});

  // Reset e inizializzazione dati all'apertura
  const handleShow = () => {
    setFormData({
      nome: struttura.nome || "",
      descrizione: struttura.descrizione || "",
      indirizzo: struttura.località?.indirizzo || "",
      città: struttura.località?.città || "",
      provincia: struttura.località?.provincia || "",
      zipCode: struttura.località?.zipCode || "",
      email: struttura.contatti?.email || "",
      telefono: struttura.contatti?.telefono || "",
      mainImage: struttura.images?.mainImage || "",
      gallery: struttura.images?.gallery || [],
      basePrice: struttura.policies?.basePrice || 0,
      cancellation: struttura.policies?.cancellation || "Flessibile"
    });
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const bodyPayload = {
      nome: formData.nome,
      descrizione: formData.descrizione,
      località: {
        indirizzo: formData.indirizzo,
        città: formData.città,
        provincia: formData.provincia,
        zipCode: formData.zipCode
      },
      contatti: {
        email: formData.email,
        telefono: formData.telefono,
        manager: struttura.contatti?.manager 
      },
      policies: {
        basePrice: Number(formData.basePrice),
        cancellation: formData.cancellation
      }
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/strutture/${struttura._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        onUpdate(); 
        handleClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Errore durante l'aggiornamento");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-dark" size="sm" className="rounded-pill shadow-sm" onClick={handleShow}>
        <PencilSquare className="me-1" /> Modifica
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered backdrop={loading ? "static" : true}>
        <Modal.Header closeButton={!loading} className="border-0 text-center w-100">
          <Modal.Title className="fw-bold w-100">Modifica Struttura</Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nome Struttura</Form.Label>
                  <Form.Control name="nome" value={formData.nome || ""} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Prezzo Base (€)</Form.Label>
                  <Form.Control type="number" name="basePrice" value={formData.basePrice || 0} onChange={handleChange} min="0" step="0.01" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Descrizione</Form.Label>
              <Form.Control as="textarea" rows={3} name="descrizione" value={formData.descrizione || ""} onChange={handleChange} required />
            </Form.Group>

            <h6 className="text-muted border-bottom pb-2 mt-4 small fw-bold text-uppercase text-center">Multimedia</h6>
            <Row className="mb-4 g-3">
              <Col md={6}>
                <div className="p-3 border rounded bg-light h-100 shadow-sm text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <ImageIcon className="me-2 text-primary" />
                    <span className="small fw-bold">Immagine Principale</span>
                  </div>
                  {formData.mainImage && (
                    <Image src={formData.mainImage} thumbnail className="mb-2 shadow-sm" style={{ maxHeight: '80px' }} />
                  )}
                  <UniversalUploader 
                    endpoint={`${API_URL}/strutture/${struttura._id}/images`}
                    fieldName="images"
                    method="PATCH"
                    onUploadSuccess={(data) => {
                      setFormData(prev => ({ ...prev, mainImage: data.images.mainImage }));
                      onUpdate();
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 border rounded bg-light h-100 shadow-sm text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Images className="me-2 text-success" />
                    <span className="small fw-bold">Gallery</span>
                  </div>
                  <UniversalUploader 
                    endpoint={`${API_URL}/strutture/${struttura._id}/gallery`}
                    fieldName="gallery"
                    method="PATCH"
                    multiple={true}
                    onUploadSuccess={(data) => {
                      setFormData(prev => ({ ...prev, gallery: data.images.gallery }));
                      onUpdate();
                    }}
                  />
                  <div className="mt-2">
                    <Badge bg="info">{formData.gallery?.length || 0} immagini</Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <h6 className="text-muted border-bottom pb-2 mt-4 small fw-bold text-uppercase">Localizzazione</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Indirizzo</Form.Label>
                  <Form.Control name="indirizzo" value={formData.indirizzo || ""} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Città</Form.Label>
                  <Form.Control name="città" value={formData.città || ""} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Provincia</Form.Label>
                  <Form.Control name="provincia" value={formData.provincia || ""} onChange={handleChange} maxLength={2} required />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-muted border-bottom pb-2 mt-4 small fw-bold text-uppercase text-center">Contatti e Politiche</h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Email Contatto</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email || ""} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Telefono</Form.Label>
                  <Form.Control name="telefono" value={formData.telefono || ""} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Cancellazione</Form.Label>
                  <Form.Select name="cancellation" value={formData.cancellation || "Flessibile"} onChange={handleChange}>
                    <option value="Flessibile">Flessibile</option>
                    <option value="Moderata">Moderata</option>
                    <option value="Rigorosa">Rigorosa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="border-0 bg-light rounded-bottom justify-content-center pb-4">
            <Button variant="outline-secondary" onClick={handleClose} disabled={loading} className="px-4 fw-bold">Annulla</Button>
            <Button variant="dark" type="submit" disabled={loading} className="px-5 fw-bold shadow-sm">
              {loading ? <Spinner size="sm" className="me-2" /> : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default EditStruttura;