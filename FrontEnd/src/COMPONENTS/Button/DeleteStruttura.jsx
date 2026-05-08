import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash, ExclamationTriangleFill } from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_BACK_END;

function DeleteStruttura({ strutturaId, strutturaNome, onDelete }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    if (!loading) {
      setShow(false);
      setError(null);
    }
  };

  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    if (!strutturaId) {
      setError("Errore: ID struttura non identificato.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sessione scaduta. Effettua il login.");

      const res = await fetch(`${API_URL}/strutture/${strutturaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Notifica il componente padre per aggiornare la lista
        onDelete?.(); 
        handleClose();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Impossibile eliminare la struttura.");
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
        variant="outline-danger" 
        size="sm" 
        className="rounded-pill px-3 shadow-sm" 
        onClick={handleShow}
        title="Elimina Struttura"
      >
        <Trash />
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        backdrop={loading ? "static" : true}
      >
        <Modal.Header closeButton={!loading} className="border-0">
          <Modal.Title className="text-danger fw-bold d-flex align-items-center">
            <ExclamationTriangleFill className="me-2" /> Conferma Eliminazione
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-4">
          <p className="text-center mb-1">
            Sei sicuro di voler eliminare definitivamente:
          </p>
          <h5 className="text-center fw-bold text-dark">{strutturaNome}?</h5>
          
          <div className="bg-danger bg-opacity-10 p-3 rounded-3 mt-4 border border-danger border-opacity-25">
            <p className="text-danger small mb-0 text-center fw-bold">
              ATTENZIONE: Questa azione eliminerà anche tutte le camere e i dati associati a questa struttura. L'operazione non può essere annullata.
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3 small shadow-sm border-0">
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
            className="px-4 fw-bold shadow-sm"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" /> Eliminazione...
              </>
            ) : (
              "Sì, Elimina Tutto"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteStruttura;