import { useState, useEffect } from "react";
import { Table, Badge, Spinner, Image } from "react-bootstrap";
import DeleteStruttura from "../Button/DeleteStruttura"; 
import EditStruttura from "../Button/EditStruttura"; 
import CreateStruttura from "../Button/createStruttura";

function AdminStrutture () {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStrutture = async () => {
    try {
      const res = await fetch("http://localhost:3002/strutture");
      const data = await res.json();
      setStrutture(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getStrutture(); }, []);

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="admin-section">
      {/* Header Sezione */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Gestione Strutture</h4>
          <p className="text-muted small">Visualizza, modifica o aggiungi nuove strutture al catalogo</p>
        </div>
        <CreateStruttura onCreated={getStrutture} />
      </div>

      {/* Tabella Minimal */}
      <div className="table-responsive">
        <Table hover className="align-middle custom-admin-table">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase">Struttura</th>
              <th className="border-0 text-muted small text-uppercase">Località</th>
            
              <th className="border-0 text-muted small text-uppercase text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {strutture.map((s) => (
              <tr key={s._id} className="border-bottom">
                <td className="py-3">
                  <div className="d-flex align-items-center">
                    <Image 
                      src={s.images?.mainImage} 
                      alt={s.nome} 
                      rounded
                      className="me-3 shadow-sm"
                      style={{ width: '55px', height: '55px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div className="fw-bold text-dark">{s.nome}</div>
                      
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span>{s.località.città}</span>
                    <span className="text-muted small">{s.località.provincia}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* I bottoni Edit/Delete ora respirano di più */}
                    <EditStruttura struttura={s} onUpdate={getStrutture} />
                    <DeleteStruttura 
                      strutturaId={s._id} 
                      strutturaNome={s.nome} 
                      onDelete={getStrutture} 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Footer Tabella */}
      <div className="mt-3 text-muted small">
        Totale strutture registrate: <strong>{strutture.length}</strong>
      </div>
    </div>
  );
};

export default AdminStrutture;