import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/IsAdmin";

const API_URL = import.meta.env.VITE_BACK_END;

function DeleteProfile({ userId, userName, onDeleted }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    if (!loading) {
      setShow(false);
      setError(null);
    }
  };
  
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sessione scaduta o non valida.");

      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Verifica se l'ID eliminato corrisponde all'utente loggato
        // Usiamo user?._id o user?.id a seconda di come è strutturato il tuo context
        const isSelfDelete = (user?._id === userId || user?.id === userId);

        if (isSelfDelete) {
          logout();
          navigate("/");
        } else {
          // Se non è auto-eliminazione, notifica il componente padre 
          // per aggiornare la lista utenti dinamicamente
          onDeleted?.(); 
          handleClose();
        }
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Impossibile eliminare il profilo.");
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
        className="rounded-pill px-3 mt-2" 
        onClick={handleShow}
        title="Elimina Profilo"
      >
        <Trash className="me-2" /> Elimina
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        backdrop={loading ? "static" : true}
      >
        <Modal.Header closeButton={!loading} className="border-0">
          <Modal.Title className="text-danger fw-bold">⚠️ Attenzione!</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-center py-4">
          <p className="mb-1">Sei sicuro di voler eliminare il profilo di:</p>
          <h5 className="fw-bold">{userName || "questo utente"}?</h5>
          
          <div className="bg-light p-3 rounded mt-3">
            <p className="text-muted small mb-0">
              Questa azione è <strong>irreversibile</strong>. 
              Tutti i dati, le prenotazioni e le preferenze andranno perduti per sempre.
            </p>
          </div>

          {error && <Alert variant="danger" className="mt-3 small border-0 shadow-sm">{error}</Alert>}
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button variant="light" onClick={handleClose} className="px-4" disabled={loading}>
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
              "Sì, Elimina Definitivamente"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteProfile;