import { useState, useEffect } from "react";
import { Table, Badge, Spinner, Image } from "react-bootstrap"; 
import { Gear } from "react-bootstrap-icons";
import CreateServizio from "../../Button/CreateServizio.jsx";
import DeleteServizio from "../../Button/DeleteServizio.jsx";
import EditServizio from "../../Button/EditServizio.jsx";

import "./ServiziAdmin.css"

const API_URL = import.meta.env.VITE_BACK_END;

function ServiziAdmin() {
  const [servizi, setServizi] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServizi = async () => {
    try {
      const res = await fetch(`${API_URL}/servizi`);
      const data = await res.json();
      setServizi(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServizi();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5 v-fenix-loading">
        <Spinner animation="border" className="spinner-fenix" />
        <p className="mt-3 text-muted small text-uppercase tracking-wider">Caricamento servizi...</p>
      </div>
    );

  return (
    <div className="admin-section p-4 v-fenix-admin-wrapper">
      
      {/* Header Sezione */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 v-fenix-title">Gestione Servizi</h4>
          <p className="text-muted small mb-0">
            Aggiungi o modifica i servizi offerti dalle tue strutture
          </p>
        </div>
        <CreateServizio onCreated={getServizi} />
      </div>

      {/* Tabella Gestionale Servizi */}
      <div className="table-responsive shadow-sm rounded-3 border-0 bg-white">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th className="ps-4 py-3">Servizio</th>
              <th className="py-3">Costo Extra</th>
              <th className="text-center py-3 pe-4">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {servizi.length > 0 ? (
              servizi.map((s) => (
                <tr key={s._id} className="align-middle row-fenix-service">
                  
                  {/* Info Servizio + Icona/Immagine */}
                  <td className="py-3 ps-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3 service-image-wrapper">
                        {s.icona ? (
                          <Image
                            src={s.icona}
                            rounded
                            fluid
                            className="service-img"
                            alt={s.nome}
                          />
                        ) : (
                          <div className="service-icon-placeholder">
                            <Gear size={16} />
                          </div>
                        )}
                      </div>
                      <span className="fw-bold service-name">{s.nome}</span>
                    </div>
                  </td>
                
                  {/* Costo Extra o Badge Gratuito */}
                  <td>
                    {s.costoExtra > 0 ? (
                      <span className="fw-bold service-price">
                        {Number(s.costoExtra).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                      </span>
                    ) : (
                      <Badge bg="none" className="badge-fenix badge-fenix-free">
                        Gratuito
                      </Badge>
                    )}
                  </td>

                  {/* Azioni di Gestione */}
                  <td className="pe-4">
                    <div className="d-flex justify-content-center gap-2">
                      <EditServizio servizio={s} onUpdate={getServizi} />
                      <DeleteServizio
                        servizioId={s._id}
                        servizioNome={s.nome}
                        onDelete={getServizi}
                      />
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-5 text-muted small">
                  Nessun servizio configurato al momento per Villa Fenix.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ServiziAdmin;