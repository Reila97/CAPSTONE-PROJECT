import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/IsAdmin";

function DeleteProfile ({ userId, userName })  {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
      const res = await fetch(`http://localhost:3002/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Se l'utente sta eliminando SE STESSO, facciamo il logout
        if (user?._id === userId || user?.id === userId) {
          logout();
          navigate("/");
        } else {
          window.location.reload(); 
        }
      } else {
        const data = await res.json();
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
      <Button variant="outline-danger" size="sm" className="rounded-pill px-3 mt-2" onClick={handleShow}>
        <Trash className="me-2" /> 
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger fw-bold">Attenzione!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <p className="mb-1">Sei sicuro di voler eliminare il profilo di:</p>
          <h5 className="fw-bold">{userName}?</h5>
          <p className="text-muted small mt-3">
            Questa azione è irreversibile e tutti i dati andranno perduti.
          </p>
          {error && <Alert variant="danger" className="mt-3 small">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button variant="light" onClick={handleClose} className="px-4">
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading} className="px-4">
            {loading ? <Spinner size="sm" /> : "Sì, Elimina Definivamente"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteProfile;