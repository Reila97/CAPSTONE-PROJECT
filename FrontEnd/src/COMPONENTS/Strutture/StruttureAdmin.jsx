import { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Image, Alert } from "react-bootstrap";
import DeleteStruttura from "../Button/DeleteStruttura.jsx"; 
import EditStruttura from "../Button/EditStruttura.jsx"; 
import CreateStruttura from "../Button/CreateStruttura.jsx";

import "./StruttureAdmin.css"

const API_URL = import.meta.env.VITE_BACK_END;

function AdminStrutture() {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStrutture = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
    <div className="text-center py-5 v-fenix-loading">
      <Spinner animation="border" className="spinner-fenix" />
      <p className="mt-3 text-muted small text-uppercase tracking-wider">Caricamento catalogo...</p>
    </div>
  );

  return (
    <div className="admin-section p-4 v-fenix-admin-wrapper">
      
      {/* Header Sezione */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-1 v-fenix-title">Gestione Strutture</h4>
          <p className="text-muted small mb-0">Visualizza, modifica o aggiungi nuove strutture al catalogo della holding</p>
        </div>
        <CreateStruttura onCreated={getStrutture} />
      </div>

      {error && <Alert variant="danger" className="border-0 shadow-sm py-2 small">{error}</Alert>}

      {/* Tabella Gestionale Strutture */}
      <div className="table-responsive shadow-sm rounded-3 border-0 bg-white">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th className="ps-4 py-3">Struttura</th>
              <th className="py-3">Località</th>
              <th className="text-center py-3 pe-4">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {strutture.length > 0 ? (
              strutture.map((s) => (
                <tr key={s._id} className="align-middle row-fenix-struttura">
                  
                  {/* Foto Principale e Info Core */}
                  <td className="py-3 ps-4">
                    <div className="d-flex align-items-center">
                      <div className="struttura-image-wrapper me-3">
                        <Image 
                          src={s.images?.mainImage || "https://placehold.co/100x100?text=Fenix"} 
                          alt={s.nome} 
                          rounded
                          className="struttura-img"
                        />
                      </div>
                      <div>
                        <div className="fw-bold struttura-name">{s.nome || "Senza Nome"}</div>
                        <div className="text-muted small id-badge">
                          ID: {s._id.substring(s._id.length - 6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Informazioni di Localizzazione */}
                  <td>
                    <div className="d-flex flex-column location-block">
                      <span className="fw-medium text-dark city-text">{s.località?.città || "N/D"}</span>
                      <span className="text-muted small province-text">{s.località?.provincia || ""}</span>
                    </div>
                  </td>

                  {/* Azioni Modifica / Rimozione */}
                  <td className="pe-4">
                    <div className="d-flex justify-content-center gap-2">
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
                <td colSpan="3" className="text-center py-5 text-muted small table-empty-state">
                  Nessuna struttura presente nel database di Villa Fenix.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Footer della Tabella */}
      <div className="mt-3 d-flex justify-content-between align-items-center px-2 counter-footer">
        <div className="text-muted small">
          Totale strutture a sistema: <strong className="counter-highlight">{strutture.length}</strong>
        </div>
        <div className="text-muted small update-timestamp">
          Ultimo controllo: {new Date().toLocaleTimeString('it-IT')}
        </div>
      </div>
    </div>
  );
}

export default AdminStrutture;