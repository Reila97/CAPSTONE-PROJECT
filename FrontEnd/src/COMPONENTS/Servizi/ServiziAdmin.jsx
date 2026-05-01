import { useState, useEffect } from "react";
import { Table, Badge, Spinner } from "react-bootstrap";
import { PlusCircle, Gear } from "react-bootstrap-icons";
import CreateServizio from "../Button/CreareServizio";
import DeleteServizio from "../Button/DeleteServizio.jsx";
import EditServizio from "../Button/EditServizio.jsx"


function ServiziAdmin() {
  const [servizi, setServizi] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServizi = async () => {
    try {
      const res = await fetch("http://localhost:3002/servizi");
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
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Gestione Servizi</h4>
          <p className="text-muted small">
            Aggiungi o modifica i servizi offerti dalle tue strutture
          </p>
        </div>
        <CreateServizio onCreated={getServizi} />
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle custom-admin-table">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase">
                Servizio
              </th>
              <th className="border-0 text-muted small text-uppercase">
                Costo Extra
              </th>
              <th className="border-0 text-muted small text-uppercase text-center">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {servizi.map((s) => (
              <tr key={s._id} className="border-bottom">
                <td className="py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-light border rounded p-2 me-3">
                      <Gear size={18} className="text-secondary" />
                    </div>
                    <span className="fw-bold">{s.nome}</span>
                  </div>
                </td>
              
                <td>
                  {s.costoExtra > 0 ? (
                    `€ ${s.costoExtra}`
                  ) : (
                    <Badge bg="success" className="fw-normal">
                      Gratuito
                    </Badge>
                  )}
                </td>
                <td>
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
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ServiziAdmin;
