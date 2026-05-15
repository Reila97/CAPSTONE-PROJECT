import { useState, useEffect, useCallback } from "react";
import { Table, Badge, Spinner, Alert } from "react-bootstrap";
import { DoorOpen, People, CheckCircle, XCircle } from "react-bootstrap-icons";
import CreateCamera from "../../Button/CreateCamera";
import EditCamera from "../../Button/EditCamera.jsx";
import DeleteCamera from "../../Button/DeleteCamera.jsx";

import "./CamereAdmin.css"

const API_URL = import.meta.env.VITE_BACK_END;

function CamereAdmin() {
  const [camere, setCamere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCamere = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      <div className="text-center py-5 v-fenix-loading">
        {/* Spinner personalizzato tramite stile inline/variabile per brand identity */}
        <Spinner animation="border" style={{ color: "var(--brand-primary-hex, #65513D)" }} />
        <p className="mt-3 text-muted small text-uppercase tracking-wider">Caricamento in corso...</p>
      </div>
    );

  return (
    <div className="admin-section p-4" style={{ backgroundColor: "var(--admin-bg-main, #F7F9FA)", fontFamily: "var(--font-family-body, 'Ubuntu', sans-serif)" }}>
      
      {/* Header Sezione */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ fontFamily: "var(--font-family-headlines, 'Gotham', sans-serif)", color: "var(--admin-text-main, #2C2520)", letterSpacing: "-0.5px" }}>
            Gestione Camere
          </h4>
          <p className="text-muted small mb-0">
            Configura le tipologie di stanze, capacità e prezzi della struttura
          </p>
        </div>
        <CreateCamera onCreated={getCamere} />
      </div>

      {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

      {/* Tabella Gestionale */}
      <div className="table-responsive shadow-sm rounded-3 border-0 bg-white">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead style={{ backgroundColor: "#FDFDFD", borderBottom: "2px solid var(--admin-border-color, #D4D6D6)" }}>
            <tr>
              <th className="text-muted small text-uppercase ps-4 py-3 fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Stanza</th>
              <th className="text-muted small text-uppercase py-3 fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Tipologia</th>
              <th className="text-muted small text-uppercase text-center py-3 fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Capacità</th>
              <th className="text-muted small text-uppercase text-center py-3 fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Lettino</th>
              <th className="text-muted small text-uppercase py-3 fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Prezzo / Notte</th>
              <th className="text-muted small text-uppercase text-center pe-4 py-3 fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {camere.length > 0 ? (
              camere.map((c) => (
                <tr key={c._id} className="align-middle" style={{ borderBottom: "1px solid rgba(212, 214, 216, 0.5)" }}>
                  
                  {/* Info Stanza con Icona Istituzionale */}
                  <td className="py-3 ps-4">
                    <div className="d-flex align-items-center">
                      <div className="rounded-3 me-3 d-flex align-items-center justify-content-center" 
                           style={{ width: "40px", height: "40px", backgroundColor: "rgba(101, 81, 61, 0.08)", color: "var(--brand-primary-hex, #65513D)" }}>
                        <DoorOpen size={18} />
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: "var(--admin-text-main, #2C2520)" }}>
                          {c.nome || `Camera ${c.numero}`}
                        </div>
                        <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                          {typeof c.strutturaId === "object"
                            ? c.strutturaId?.nome
                            : "Struttura non assegnata"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipologia con Badge di Accento Neutro (Mirra/Spigonardo context) */}
                  <td>
                    <Badge bg="none" className="fw-normal px-2 py-1.5" 
                           style={{ backgroundColor: "rgba(186, 178, 162, 0.15)", color: "#5A5245", border: "1px solid rgba(186, 178, 162, 0.3)" }}>
                      {c.tipologia}
                    </Badge>
                  </td>

                  {/* Capacità */}
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 text-dark">
                      <People size={15} className="text-muted" />
                      <span className="fw-medium">{c.capienza?.maxAdulti || c.capacità}</span>
                    </div>
                  </td>

                  {/* Stato Disponibilità Lettino */}
                  <td className="text-center">
                    {c.capienza?.possibilitàLettino ? (
                      <Badge bg="none" className="fw-medium px-2 py-1" 
                             style={{ backgroundColor: "rgba(46, 125, 50, 0.08)", color: "#2E7D32", border: "1px solid rgba(46, 125, 50, 0.2)" }}>
                        <CheckCircle className="me-1" size={12} /> Sì
                      </Badge>
                    ) : (
                      <Badge bg="none" className="fw-medium px-2 py-1" 
                             style={{ backgroundColor: "rgba(108, 117, 125, 0.08)", color: "#6C757D", border: "1px solid rgba(108, 117, 125, 0.2)" }}>
                        <XCircle className="me-1" size={12} /> No
                      </Badge>
                    )}
                  </td>

                  {/* Prezzo con font d'impatto Gotham */}
                  <td>
                    <span className="fw-bold" style={{ fontFamily: "var(--font-family-headlines, 'Gotham', sans-serif)", color: "var(--admin-text-main, #2C2520)" }}>
                      {Number(c.prezzoPerNotte).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </td>

                  {/* Azioni CRUD */}
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
                <td colSpan="6" className="text-center py-5 text-muted small">
                  Nessuna camera trovata nei database di Villa Fenix.
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