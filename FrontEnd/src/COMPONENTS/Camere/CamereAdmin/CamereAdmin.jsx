import { useState, useEffect, useCallback } from "react";
import { Table, Badge, Spinner, Alert } from "react-bootstrap";
import { DoorOpen, People, CheckCircle, XCircle } from "react-bootstrap-icons";
import CreateCamera from "../../Button/CreateCamera";
import EditCamera from "../../Button/EditCamera.jsx";
import DeleteCamera from "../../Button/DeleteCamera.jsx";


const API_URL = import.meta.env.VITE_BACK_END;

function CamereAdmin() {
  const [camere, setCamere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCamere = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // FIX: Sostituito localhost con la variabile d'ambiente API_URL
      const res = await fetch(`${API_URL}/camere`);
      
      if (!res.ok) throw new Error("Errore nel caricamento dei dati");
      
      const data = await res.json();
      setCamere(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Errore fetch camere:", err);
      setError("Impossibile caricare le camere. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCamere();
  }, [getCamere]);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Caricamento in corso...</p>
      </div>
    );

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Gestione Camere</h4>
          <p className="text-muted small">
            Configura le tipologie di stanze, capacità e prezzi
          </p>
        </div>
        <CreateCamera onCreated={getCamere} />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive shadow-sm rounded">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase ps-4">Stanza</th>
              <th className="border-0 text-muted small text-uppercase">Tipologia</th>
              <th className="border-0 text-muted small text-uppercase text-center">Capacità</th>
              <th className="border-0 text-muted small text-uppercase text-center">Lettino</th>
              <th className="border-0 text-muted small text-uppercase">Prezzo/Notte</th>
              <th className="border-0 text-muted small text-uppercase text-center pe-4">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {camere.length > 0 ? (
              camere.map((c) => (
                <tr key={c._id} className="border-bottom">
                  <td className="py-3 ps-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                        <DoorOpen size={20} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">
                          {c.nome || `Camera ${c.numero}`}
                        </div>
                        <div className="text-muted small">
                          {typeof c.strutturaId === "object"
                            ? c.strutturaId?.nome
                            : "Struttura non assegnata"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info" className="bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">
                      {c.tipologia}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <People size={14} className="text-muted" />
                      <span>{c.capienza?.maxAdulti || c.capacità}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    {c.capienza?.possibilitàLettino ? (
                      <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 fw-normal px-2 py-1">
                        <CheckCircle className="me-1" size={12} /> Sì
                      </Badge>
                    ) : (
                      <Badge bg="secondary" className="bg-opacity-10 text-secondary border border-secondary border-opacity-25 fw-normal px-2 py-1">
                        <XCircle className="me-1" size={12} /> No
                      </Badge>
                    )}
                  </td>
                  <td>
                    <span className="fw-bold text-dark">
                      {Number(c.prezzoPerNotte).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </td>
                  <td className="text-center pe-4">
                    <div className="d-flex justify-content-center gap-2">
                      <EditCamera camera={c} onUpdate={getCamere} />
                      <DeleteCamera
                        cameraId={c._id}
                        cameraNome={c.nome}
                        onDelete={getCamere}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Nessuna camera trovata.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CamereAdmin;