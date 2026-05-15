import { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Image, Alert } from "react-bootstrap";
import DeleteStruttura from "../Button/DeleteStruttura.jsx"; 
import EditStruttura from "../Button/EditStruttura.jsx"; 
import CreateStruttura from "../Button/CreateStruttura.jsx";

// Utilizzo della variabile d'ambiente per il backend
const API_URL = import.meta.env.VITE_BACK_END;

function AdminStrutture() {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback per stabilizzare la funzione e poterla usare correttamente in useEffect
  const getStrutture = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // FIX: Sostituito l'URL statico con la variabile d'ambiente
      const res = await fetch(`${API_URL}/strutture`);
      
      if (!res.ok) throw new Error("Impossibile caricare le strutture");
      
      const data = await res.json();
      setStrutture(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Errore fetch strutture:", err);
      setError("Si è verificato un errore durante il recupero dei dati.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    getStrutture(); 
  }, [getStrutture]);

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted small">Caricamento catalogo...</p>
    </div>
  );

  return (
    <div className="admin-section">
      {/* Header Sezione */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-1">Gestione Strutture</h4>
          <p className="text-muted small mb-0">Visualizza, modifica o aggiungi nuove strutture al catalogo</p>
        </div>
        <CreateStruttura onCreated={getStrutture} />
      </div>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      {/* Tabella Minimal */}
      <div className="table-responsive shadow-sm rounded">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase ps-3">Struttura</th>
              <th className="border-0 text-muted small text-uppercase">Località</th>
              <th className="border-0 text-muted small text-uppercase text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {strutture.length > 0 ? (
              strutture.map((s) => (
                <tr key={s._id} className="border-bottom">
                  <td className="py-3 ps-3">
                    <div className="d-flex align-items-center">
                      <Image 
                        src={s.images?.mainImage || "https://placehold.co/100x100?text=Fenix"} 
                        alt={s.nome} 
                        rounded
                        className="me-3 shadow-sm border"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                      />
                      <div>
                        <div className="fw-bold text-dark">{s.nome || "Senza Nome"}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          ID: {s._id.substring(s._id.length - 6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-medium">{s.località?.città || "N/D"}</span>
                      <span className="text-muted small">{s.località?.provincia || ""}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2 px-2">
                      <EditStruttura struttura={s} onUpdate={getStrutture} />
                      <DeleteStruttura 
                        strutturaId={s._id} 
                        strutturaNome={s.nome} 
                        onDelete={getStrutture} 
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-5 text-muted italic">
                  Nessuna struttura presente nel database.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Footer Tabella */}
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          Totale strutture: <strong>{strutture.length}</strong>
        </div>
        <div className="text-muted small">
          Ultimo aggiornamento: {new Date().toLocaleTimeString('it-IT')}
        </div>
      </div>
    </div>
  );
}

export default AdminStrutture;