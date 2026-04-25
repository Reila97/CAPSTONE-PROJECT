import { useState, useEffect } from "react";
import { Container, Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { Trash, ShieldCheck } from "react-bootstrap-icons";
import DeleteProfile from "../Button/DeleteProfile";
import EditProfile from "../Button/EditProfile"
import CreateUser from "../Button/CreateUser";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3002/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      setError("Errore caricamento utenti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleAdmin = async (clickedUser) => {
    const userId = clickedUser._id || clickedUser.id;
    const nuovoStato = !clickedUser.isAdmin;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3002/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: nuovoStato }),
      });

      if (res.ok) {
        setUsers((prevUsers) => 
          prevUsers.map((u) => {
            const currentId = u._id || u.id;
            return currentId === userId ? { ...u, isAdmin: nuovoStato } : u;
          })
        );
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4 fw-bold text-uppercase">Gestione Utenti</h2>

      <CreateUser onCreated={fetchUsers} />
      <Table responsive hover className="border shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Stato</th>
            <th className="text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id || u.id} className="align-middle">
              <td>{u.nome} {u.cognome}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={u.isAdmin ? "danger" : "info"} className="rounded-0 px-3">
                  {u.isAdmin ? "ADMIN" : "USER"}
                </Badge>
              </td>
              <td className="text-center">

                <div className="d-flex">
                  {/* 1. TOGGLE ADMIN */}
                <Button 
                  variant={u.isAdmin ? "outline-warning" : "outline-dark"} 
                  size="sm" 
                  className="rounded-pill me-2"
                  onClick={() => toggleAdmin(u)}
                  title="Cambia Ruolo"
                >
                  <ShieldCheck />
                </Button>

                {/* 2. MODIFICA (CORRETTO: passiamo 'u') */}
                <EditProfile 
                  user={u} 
                  onUpdate={fetchUsers} 
                />

                {/* 3. ELIMINA (CORRETTO: abbiamo cambiato userData con u) */}
                <DeleteProfile 
                  userId={u._id || u.id} 
                  userName={`${u.nome} ${u.cognome}`} />
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllUser