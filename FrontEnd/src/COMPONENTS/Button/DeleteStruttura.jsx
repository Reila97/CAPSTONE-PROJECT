import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

function DeleteStruttura ({ strutturaId, strutturaNome, onDelete })  {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => { setShow(false); setError(null); };
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3002/strutture/${strutturaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onDelete(); // Ricarica la lista nel componente padre
        handleClose();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Errore durante l'eliminazione");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={handleShow}>
        <Trash />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler eliminare la struttura <strong>{strutturaNome}</strong>?
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>Annulla</Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Elimina"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteStruttura;

