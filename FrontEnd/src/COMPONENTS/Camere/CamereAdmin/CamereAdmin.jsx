import { useState, useEffect } from "react";
import { Table, Badge, Spinner, Image } from "react-bootstrap";
import { DoorOpen, People, Fullscreen } from "react-bootstrap-icons";
// Importa i tuoi bottoni (da creare o adattare)
import CreateCamera from "../../Button/CreateCamera";
import EditCamera from "../../Button/EditCamera.jsx"
import DeleteCamera from "../../Button/DeleteCamera.jsx";

function CamereAdmin ()  {
  const [camere, setCamere] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCamere = async () => {
    try {
      const res = await fetch("http://localhost:3002/camere");
      const data = await res.json();
      setCamere(data);
    } catch (err) {
      console.error("Errore fetch camere:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getCamere(); }, []);

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Gestione Camere</h4>
          <p className="text-muted small">Configura le tipologie di stanze, capacità e prezzi</p>
        </div>
         <CreateCamera onCreated={getCamere} /> 
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle custom-admin-table">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase">Stanza</th>
              <th className="border-0 text-muted small text-uppercase">Tipologia</th>
              <th className="border-0 text-muted small text-uppercase text-center">Capacità</th>
              <th className="border-0 text-muted small text-uppercase">Prezzo/Notte</th>
              <th className="border-0 text-muted small text-uppercase text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {camere.map((c) => (
              <tr key={c._id} className="border-bottom">
                <td className="py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                      <DoorOpen size={24} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{c.nome || `Camera ${c.numero}`}</div>
                      <div className="text-muted small">{c.strutturaNome || "Struttura non assegnata"}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge bg="secondary" className="fw-normal">{c.tipologia}</Badge>
                </td>
                <td className="text-center">
                  <div className="d-flex align-items-center justify-content-center gap-1">
                    <People size={14} className="text-muted" />
                    <span>{c.capacità}</span>
                  </div>
                </td>
                <td>
                  <span className="fw-bold text-success">€ {c.prezzoPerNotte}</span>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <EditCamera camera={c} onUpdate={getCamere} /> 
                     <DeleteCamera cameraId={c._id} cameraNome={c.nome} onDelete={getCamere} />
                   
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CamereAdmin;