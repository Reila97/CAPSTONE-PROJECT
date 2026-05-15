import { useState, useEffect, useCallback } from "react";
import { Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { ShieldCheck } from "react-bootstrap-icons";
import DeleteProfile from "../../Button/DeleteProfile.jsx";
import EditProfile from "../../Button/EditProfile";
import CreateUser from "../../Button/CreateUser";
import "./UserAdmin.css";

const API_URL = import.meta.env.VITE_BACK_END;

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sessione mancante. Effettua il login.");

      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
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
      <div className="text-center py-5 v-fenix-loading">
        <Spinner animation="border" className="spinner-fenix" />
        <p className="mt-3 text-muted small text-uppercase tracking-wider">Sincronizzazione anagrafiche...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="border-0 shadow-sm py-3 text-center v-fenix-alert">
        {error}
      </Alert>
    );

  return (
    <div className="admin-section p-4 v-fenix-admin-wrapper">
      
      {/* Intestazione Sezione */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 v-fenix-title">Gestione Utenti</h4>
          <p className="text-muted small mb-0">
            Amministra i permessi e le anagrafiche degli utenti registrati nel circuito
          </p>
        </div>
        <CreateUser onCreated={fetchUsers} />
      </div>

      {/* Tabella Utenti */}
      <div className="table-responsive shadow-sm rounded-3 border-0 bg-white">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th className="ps-4 py-3">Utente</th>
              <th className="py-3">Email</th>
              <th className="py-3">Ruolo</th>
              <th className="text-center py-3 pe-4">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => {
                const userId = u._id || u.id;
                return (
                  <tr key={userId} className="align-middle row-fenix-user">
                    
                    {/* Avatar Initials e Nome */}
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div className="user-avatar-sm me-3 d-flex align-items-center justify-content-center fw-bold shadow-sm">
                          {u.nome?.charAt(0)}{u.cognome?.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-bold user-fullname-text">
                            {u.nome} {u.cognome}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Indirizzo Email */}
                    <td>
                      <span className="user-email-text">{u.email}</span>
                    </td>
                    
                    {/* Badge Ruolo Amministrativo */}
                    <td>
                      <Badge bg="none" className={`badge-fenix-role ${u.isAdmin ? "role-admin" : "role-user"}`}>
                        {u.isAdmin ? "ADMIN" : "USER"}
                      </Badge>
                    </td>
                    
                    {/* Gruppo di Bottoni Azione */}
                    <td className="pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="none"
                          className={`btn-fenix-toggle-admin d-flex align-items-center justify-content-center shadow-sm ${u.isAdmin ? "is-admin-active" : ""}`}
                          size="sm"
                          onClick={() => toggleAdmin(u)}
                          title={u.isAdmin ? "Rendi Utente Semplice" : "Rendi Amministratore"}
                        >
                          <ShieldCheck size={16} />
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
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted small">
                  Nessun profilo utente censito nel database.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Contatore Piè di Pagina */}
      <div className="mt-3 d-flex justify-content-between align-items-center px-2 counter-footer">
        <div className="text-muted small">
          Utenti totali nel database aziendale: <strong className="counter-highlight">{users.length}</strong>
        </div>
      </div>
    </div>
  );
}

export default AllUser;