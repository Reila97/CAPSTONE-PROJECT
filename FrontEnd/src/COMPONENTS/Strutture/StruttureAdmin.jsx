import { useState, useEffect } from "react";
import { Container, Table, Badge, Button, Spinner } from "react-bootstrap";
import DeleteStruttura from "../Button/DeleteStruttura"; 
import EditStruttura from "../Button/EditStruttura"; 
import CreateStruttura from "../Button/createStruttura";

const AdminStrutture = () => {
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

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">GESTIONE STRUTTURE</h2>
        <CreateStruttura onCreated={getStrutture} />
      </div>

      <Table responsive hover className="align-middle border">
        <thead className="table-dark">
          <tr>
            <th>Immagine</th>
            <th>Nome</th>
            <th>Località</th>
            <th>Prezzo Base</th>
            <th className="text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {strutture.map((s) => (
            <tr key={s._id}>
              <td>
                <img src={s.images.mainImage} alt={s.nome} style={{width: '60px', height: '40px', objectFit: 'cover'}} />
              </td>
              <td className="fw-bold">{s.nome}</td>
              <td>{s.località.città} ({s.località.provincia})</td>
              <td>€{s.policies.basePrice}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  {/* COMPONENTE MODIFICA */}
                  <EditStruttura struttura={s} onUpdate={getStrutture} />
                  
                  {/* COMPONENTE ELIMINA */}
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
    </Container>
  );
};

export default AdminStrutture;