import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_BACK_END;

function DeleteServizio({ servizioId, servizioNome, onDelete }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    // Impedisce la chiusura accidentale durante l'eliminazione
    if (!loading) {
      setShow(false);
      setError(null);
    }
  };

  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    if (!servizioId) {
      setError("ID servizio non valido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sessione scaduta. Effettua il login.");

      const res = await fetch(`${API_URL}/servizi/${servizioId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Chiamata sicura alla callback per aggiornare lo stato del padre
        onDelete?.(); 
        handleClose();
      } else {
        // Tenta di leggere il messaggio d'errore, altrimenti usa un fallback
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Errore durante l'eliminazione del servizio.");
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
        className="rounded-3 border-0 shadow-sm" 
        onClick={handleShow} 
        title="Rimuovi Servizio"
        aria-label={`Rimuovi servizio ${servizioNome}`}
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
          <Modal.Title className="text-danger fw-bold">Rimuovi Servizio</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <p className="mb-1 text-muted">Sei sicuro di voler rimuovere il servizio:</p>
          <h5 className="fw-bold text-dark">{servizioNome || "questo servizio"}?</h5>
          
          <div className="bg-light p-3 rounded-3 mt-3 border">
            <p className="text-danger small mb-0 fw-semibold">
              ⚠️ Nota bene: Se questo servizio è assegnato a delle camere, 
              verrà rimosso dai loro elenchi automaticamente o richiederà un aggiornamento manuale.
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
                <Spinner size="sm" className="me-2" /> Rimozione...
              </>
            ) : (
              "Conferma Rimoziome"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteServizio;