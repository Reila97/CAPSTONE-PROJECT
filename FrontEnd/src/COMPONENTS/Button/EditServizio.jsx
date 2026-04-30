import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditServizio({ servizio, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inizializziamo lo stato. 
  // Aggiungiamo l'ID nello stato per essere sicuri di non perderlo
  const [formData, setFormData] = useState({
 _id: servizio?._id || "",
    nome: servizio?.nome || "",
    icona: servizio?.icona || ""
  });

  // Questo useEffect "scatta" ogni volta che il prop 'servizio' cambia
  // o quando viene aperto il modale.
  useEffect(() => {
    if (servizio) {
      setFormData({
        _id: servizio._id || servizio.id, // Supporta sia _id che id
        nome: servizio.nome || "",
        icona: servizio.icona || ""
      });
    }
  }, [servizio, show]); // 'show' aggiunto per resettare i dati all'apertura

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
    
    // Controllo di sicurezza prima di partire
    if (!formData._id) {
      setError("Errore: ID servizio mancante.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Usiamo l'id salvato nello stato formData
      const res = await fetch(`http://localhost:3002/servizi/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: formData.nome,
          icona: formData.icona
        }),
      });

      if (res.ok) {
        onUpdate(); // Ricarica la tabella
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
              {loading ? <Spinner size="sm" /> : "Salva Modifiche"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default EditServizio;

//TODO non funziona