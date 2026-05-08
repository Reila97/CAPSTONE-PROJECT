import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_BACK_END;

function DeleteCamera({ cameraId, cameraNome, onDelete }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    if (!loading) { // Impedisce la chiusura mentre sta eliminando
      setShow(false);
      setError(null);
    }
  };

  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    // 1. Controllo sicurezza ID
    if (!cameraId) {
      setError("ID camera mancante.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // 2. Controllo preventivo Token
      if (!token) {
        throw new Error("Sessione scaduta. Effettua nuovamente il login.");
      }

      const res = await fetch(`${API_URL}/camere/${cameraId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // 3. Chiamata sicura alla callback
        onDelete?.(); 
        handleClose();
      } else {
        // Gestione errori complessi dal backend
        const data = await res.json().catch(() => ({})); 
        throw new Error(data.message || "Impossibile eliminare la camera.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bottone trigger con tooltip nativo migliorato */}
      <Button 
        variant="outline-danger" 
        size="sm" 
        className="rounded-3 border-0 shadow-sm" 
        onClick={handleShow} 
        aria-label={`Elimina ${cameraNome}`}
      >
        <Trash />
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        backdrop={loading ? "static" : true} // Impedisce chiusura cliccando fuori durante il caricamento
      >
        <Modal.Header closeButton={!loading} className="border-0">
          <Modal.Title className="text-danger fw-bold">
            Conferma Eliminazione
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <p className="mb-1 text-muted">Stai per eliminare definitivamente:</p>
          <h5 className="fw-bold text-dark">{cameraNome || "questa camera"}</h5>
          
          <div className="bg-light p-3 rounded-3 mt-3">
            <p className="text-danger small mb-0 fw-semibold">
              ⚠️ Attenzione: Questa azione rimuoverà tutti i dati associati alla camera e non può essere annullata.
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3 small border-0 shadow-sm">
              {error}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button 
            variant="light" 
            onClick={handleClose} 
            className="px-4 fw-bold"
            disabled={loading}
          >
            Annulla
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={loading} 
            className="px-4 shadow-sm fw-bold"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" /> Eliminazione...
              </>
            ) : (
              "Sì, Elimina"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteCamera;