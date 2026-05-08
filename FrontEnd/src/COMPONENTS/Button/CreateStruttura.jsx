import { useState, useMemo } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { PlusLg, Image as ImageIcon, Images, CheckCircleFill } from "react-bootstrap-icons";
import UniversalUploader from "./UniversalUploader";

const API_URL = import.meta.env.VITE_BACK_END;

// Stato iniziale portato fuori per evitare ricreazioni inutili
const INITIAL_FORM = {
  nome: "",
  descrizione: "",
  indirizzo: "",
  città: "",
  provincia: "",
  zipCode: "",
  email: "",
  telefono: "",
  basePrice: "",
  cancellation: "Flessibile",
};

function CreateStruttura({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStrutturaId, setNewStrutturaId] = useState(null);
  const [imagesData, setImagesData] = useState({ mainImage: "", gallery: [] });
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleClose = () => {
    setShow(false);
    setFormData(INITIAL_FORM);
    setNewStrutturaId(null);
    setImagesData({ mainImage: "", gallery: [] });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    
    // Costruzione payload strutturato secondo il tuo schema Mongoose
    const bodyPayload = {
      nome: formData.nome,
      descrizione: formData.descrizione,
      località: {
        indirizzo: formData.indirizzo,
        città: formData.città,
        provincia: formData.provincia.toUpperCase(), // Forza maiuscole per la provincia
        zipCode: formData.zipCode,
      },
      contatti: {
        email: formData.email,
        telefono: formData.telefono,
      },
      policies: {
        basePrice: Number(formData.basePrice),
        cancellation: formData.cancellation,
      }
    };

    try {
      const res = await fetch(`${API_URL}/strutture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (res.ok) {
        setNewStrutturaId(data._id);
        onCreated?.(); // Notifica il genitore solo se la funzione esiste
      } else {
        throw new Error(data.message || "Errore durante la creazione");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
        <PlusLg className="me-2" /> Nuova Struttura
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            {newStrutturaId ? "✨ Passaggio 2: Galleria Foto" : "🏨 Passaggio 1: Dati Struttura"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-0">
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

          {!newStrutturaId ? (
            <Form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Nome Struttura *</Form.Label>
                    <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Prezzo Base (€) *</Form.Label>
                    <Form.Control type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required min="1" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Descrizione *</Form.Label>
                <Form.Control as="textarea" rows={3} name="descrizione" value={formData.descrizione} onChange={handleChange} required />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Indirizzo *</Form.Label>
                    <Form.Control name="indirizzo" value={formData.indirizzo} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Città *</Form.Label>
                    <Form.Control name="città" value={formData.città} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Provincia *</Form.Label>
                    <Form.Control name="provincia" value={formData.provincia} onChange={handleChange} maxLength={2} required placeholder="RM" />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">CAP *</Form.Label>
                    <Form.Control name="zipCode" value={formData.zipCode} onChange={handleChange} maxLength={5} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Policy Cancellazione</Form.Label>
                    <Form.Select name="cancellation" value={formData.cancellation} onChange={handleChange}>
                      <option value="Flessibile">Flessibile</option>
                      <option value="Moderata">Moderata</option>
                      <option value="Rigorosa">Rigorosa</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label className="small fw-bold">Email *</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label className="small fw-bold">Telefono *</Form.Label><Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required /></Form.Group></Col>
              </Row>

              <Button variant="success" type="submit" className="w-100 fw-bold py-2" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Salva e Prosegui"}
              </Button>
            </Form>
          ) : (
            <div className="animate__animated animate__fadeIn text-center">
              <Alert variant="success" className="d-flex align-items-center justify-content-center">
                <CheckCircleFill className="me-2" /> Struttura registrata! Carica i contenuti multimediali.
              </Alert>

              <Row className="g-3 mt-2 text-start">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="d-flex align-items-center mb-3">
                      <ImageIcon className="me-2 text-primary" />
                      <span className="fw-bold small">Copertina Principale</span>
                    </div>
                    <UniversalUploader
                      endpoint={`${API_URL}/strutture/${newStrutturaId}/images`}
                      fieldName="images"
                      method="PATCH"
                      onUploadSuccess={(data) => setImagesData(prev => ({ ...prev, mainImage: data.images.mainImage }))}
                    />
                    {imagesData.mainImage && (
                      <div className="mt-2 text-center">
                        <img src={imagesData.mainImage} alt="Preview" className="rounded shadow-sm img-fluid" style={{maxHeight: '100px'}} />
                        <div className="text-success small fw-bold mt-1">Caricata ✓</div>
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="d-flex align-items-center mb-3">
                      <Images className="me-2 text-success" />
                      <span className="fw-bold small">Galleria (Multiple)</span>
                    </div>
                    <UniversalUploader
                      endpoint={`${API_URL}/strutture/${newStrutturaId}/gallery`}
                      fieldName="gallery"
                      method="PATCH"
                      multiple={true}
                      onUploadSuccess={(data) => setImagesData(prev => ({ ...prev, gallery: data.images.gallery }))}
                    />
                    <Badge bg="info" className="mt-2 w-100">{imagesData.gallery.length} foto in galleria</Badge>
                  </div>
                </Col>
              </Row>

              <Button variant="dark" className="w-100 mt-4 fw-bold" onClick={handleClose}>
                Ho finito, vai alla dashboard
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateStruttura;
