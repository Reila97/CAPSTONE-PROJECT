import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditServizio({ servizio, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    _id: "",
    nome: "",
    costoExtra: 0,
    icona: ""
  });

  // Aggiorniamo i dati quando il modale si apre o quando cambia il servizio
  useEffect(() => {
if (servizio && show) {
    const serviceId = servizio._id || servizio.id;
    
    if (!serviceId) {
      console.error("Attenzione: l'oggetto servizio non ha un ID valido!", servizio);
    }

    setFormData({
      _id: serviceId || "",
      nome: servizio.nome || "",
      costoExtra: servizio.costoExtra ?? 0,
      icona: servizio.icona || ""
    });
  }
}, [servizio, show]);

  const handleClose = () => {
    setShow(false);
    setError(null);
    // Al ritorno, resettiamo il form con i dati originali del prop
    if (servizio) {
      setFormData({
        _id: servizio._id || servizio.id || "",
        nome: servizio.nome || "",
        costoExtra: servizio.costoExtra ?? 0,
        icona: servizio.icona || ""
      });
    }
  };
  
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Stato del form al submit:", formData);


    
    
    if (!formData._id) {
      setError("Errore: ID servizio mancante.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:3002/servizi/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: formData.nome,
          costoExtra: formData.costoExtra || 0,
          icona: formData.icona
        }),
      });

      if (res.ok) {
        onUpdate(); 
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
      <Button 
        variant="outline-dark" 
        size="sm" 
        className="rounded-pill px-3 shadow-sm" 
        onClick={handleShow}
      >
        <PencilSquare />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Modifica Servizio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nome Servizio</Form.Label>
              <Form.Control 
                type="text"
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Costo Extra (€)</Form.Label>
              <Form.Control 
                type="number"
                name="costoExtra" 
                value={formData.costoExtra} 
                onChange={handleChange} 
                min="0"
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Icona (Classe o URL)</Form.Label>
              <Form.Control 
                type="text"
                name="icona" 
                value={formData.icona} 
                onChange={handleChange} 
                placeholder="Es: wifi, car-front..." 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={handleClose}>Annulla</Button>
            <Button variant="dark" type="submit" disabled={loading} className="px-4">
              {loading ? <Spinner size="sm" animation="border" /> : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default EditServizio;