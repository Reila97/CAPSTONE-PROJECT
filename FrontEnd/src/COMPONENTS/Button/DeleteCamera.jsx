import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

function DeleteCamera({ cameraId, cameraNome, onDelete }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setShow(false);
    setError(null);
  };
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3002/camere/${cameraId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onDelete(); // Funzione passata dal padre (AdminCamere) per aggiornare la lista
        handleClose();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Errore durante l'eliminazione della camera.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-danger" size="sm" className="rounded-3 border-0 shadow-sm" onClick={handleShow} title="Elimina Camera">
        <Trash />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger fw-bold">Elimina Camera</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <p className="mb-1">Sei sicuro di voler eliminare definitivamente la camera:</p>
          <h5 className="fw-bold">{cameraNome}?</h5>
          <p className="text-muted small mt-3">
            L'azione rimuoverà la stanza dalla struttura e non potrà essere annullata.
          </p>
          {error && <Alert variant="danger" className="mt-3 small">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button variant="light" onClick={handleClose} className="px-4">
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading} className="px-4 shadow-sm">
            {loading ? <Spinner size="sm" /> : "Conferma Eliminazione"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteCamera;