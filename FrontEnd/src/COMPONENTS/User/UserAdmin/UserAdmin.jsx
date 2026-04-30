import { useState, useEffect } from "react";

import { Table, Button, Badge, Spinner, Alert, Image } from "react-bootstrap";

import { ShieldCheck } from "react-bootstrap-icons";

import DeleteProfile from "../../Button/DeleteProfile.jsx";
import EditProfile from "../../Button/EditProfile";
import CreateUser from "../../Button/CreateUser";

import "./UserAdmin.css"

function AllUser() {
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

  useEffect(() => {
    fetchUsers();
  }, []);

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
          }),
        );
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
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );

  return (
    <div className="admin-section">
      {/* Header Sezione */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Gestione Utenti</h4>
          <p className="text-muted small">
            Amministra i permessi e le anagrafiche degli utenti registrati
          </p>
        </div>
        <CreateUser onCreated={fetchUsers} />
      </div>

      {/* Tabella Minimal */}
      <div className="table-responsive">
        <Table hover className="align-middle custom-admin-table">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase">
                Utente
              </th>
              <th className="border-0 text-muted small text-uppercase">
                Email
              </th>
              <th className="border-0 text-muted small text-uppercase">
                Ruolo
              </th>
              <th className="border-0 text-muted small text-uppercase text-center">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.id} className="border-bottom">
                <td className="py-3">
                  <div className="d-flex align-items-center">
                    <div className="user-avatar-sm me-3">
                      {u.nome?.charAt(0)}
                      {u.cognome?.charAt(0)}
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
                    className="px-3 py-2 fw-medium shadow-sm"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {u.isAdmin ? "ADMIN" : "USER"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* Toggle Admin */}
                    <Button
                      // Usiamo una classe custom invece di variant="warning"
                      className={`rounded-3 border-0 d-flex align-items-center justify-content-center shadow-sm btn-orange-toggle ${u.isAdmin ? "active-admin" : ""}`}
                      size="sm"
                      style={{ width: "32px", height: "32px" }}
                      onClick={() => toggleAdmin(u)}
                      title={
                        u.isAdmin ? "Rendi Utente Semplice" : "Rendi Admin"
                      }
                    >
                      <ShieldCheck
                        size={18}
                        color={u.isAdmin ? "#f1901f" : "currentColor"}
                      />
                    </Button>

                    {/* Modifica */}
                    <EditProfile user={u} onUpdate={fetchUsers} />

                    {/* Elimina */}
                    <DeleteProfile
                      userId={u._id || u.id}
                      userName={`${u.nome} ${u.cognome}`}
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
        Utenti totali nel database: <strong>{users.length}</strong>
      </div>
    </div>
  );
};

export default AllUser;
