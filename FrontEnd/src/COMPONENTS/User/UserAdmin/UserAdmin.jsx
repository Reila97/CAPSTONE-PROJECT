import { useState, useEffect, useCallback } from "react";
import { Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { ShieldCheck } from "react-bootstrap-icons";
import DeleteProfile from "../../Button/DeleteProfile.jsx";
import EditProfile from "../../Button/EditProfile";
import CreateUser from "../../Button/CreateUser";
import "./UserAdmin.css";

// Utilizzo della variabile d'ambiente corretta
const API_URL = import.meta.env.VITE_BACK_END;

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback evita render ciclici se passata a componenti figli (come CreateUser o EditProfile)
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sessione mancante. Effettua il login.");

      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/"; // Reindirizzamento se il token è scaduto
        return;
      }

      if (!res.ok) throw new Error("Errore nel caricamento dati");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Errore caricamento utenti");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleAdmin = async (clickedUser) => {
    const userId = clickedUser._id || clickedUser.id;
    const nuovoStato = !clickedUser.isAdmin;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: nuovoStato }),
      });

      if (res.ok) {
        // Aggiornamento ottimistico dello stato locale
        setUsers((prevUsers) =>
          prevUsers.map((u) => {
            const currentId = u._id || u.id;
            return currentId === userId ? { ...u, isAdmin: nuovoStato } : u;
          })
        );
      } else {
        alert("Impossibile aggiornare i permessi admin.");
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-3 text-center">
        {error}
      </Alert>
    );

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Gestione Utenti</h4>
          <p className="text-muted small">
            Amministra i permessi e le anagrafiche degli utenti registrati
          </p>
        </div>
        <CreateUser onCreated={fetchUsers} />
      </div>

      <div className="table-responsive shadow-sm rounded-3">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase ps-4">Utente</th>
              <th className="border-0 text-muted small text-uppercase">Email</th>
              <th className="border-0 text-muted small text-uppercase">Ruolo</th>
              <th className="border-0 text-muted small text-uppercase text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const userId = u._id || u.id;
              return (
                <tr key={userId} className="border-bottom">
                  <td className="py-3 ps-4">
                    <div className="d-flex align-items-center">
                      <div className="user-avatar-sm me-3 d-flex align-items-center justify-content-center fw-bold bg-primary text-white rounded-circle" style={{ width: "40px", height: "40px" }}>
                        {u.nome?.charAt(0)}{u.cognome?.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">
                          {u.nome} {u.cognome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted">{u.email}</span>
                  </td>
                  <td>
                    <Badge
                      pill
                      bg={u.isAdmin ? "danger" : "info"}
                      className="px-3 py-2 fw-medium"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {u.isAdmin ? "ADMIN" : "USER"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2 pe-3">
                      <Button
                        className={`rounded-3 border-0 d-flex align-items-center justify-content-center shadow-sm btn-orange-toggle ${u.isAdmin ? "active-admin" : ""}`}
                        size="sm"
                        style={{ width: "35px", height: "35px" }}
                        onClick={() => toggleAdmin(u)}
                        title={u.isAdmin ? "Rendi Utente Semplice" : "Rendi Admin"}
                      >
                        <ShieldCheck
                          size={18}
                          color={u.isAdmin ? "#f1901f" : "currentColor"}
                        />
                      </Button>
                      <EditProfile user={u} onUpdate={fetchUsers} />
                      <DeleteProfile
                        userId={userId}
                        userName={`${u.nome} ${u.cognome}`}
                        onDeleted={fetchUsers} 
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div className="mt-3 text-muted small ps-2">
        Utenti totali nel database: <strong>{users.length}</strong>
      </div>
    </div>
  );
}

export default AllUser;