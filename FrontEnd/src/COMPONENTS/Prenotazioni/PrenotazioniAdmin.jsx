import { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Badge, Alert } from "react-bootstrap";
// Immaginiamo di avere bottoni simili per le azioni sulle prenotazioni
// import EditBooking from "../Button/EditBooking"; 
// import DeleteBooking from "../Button/DeleteBooking"; 

const API_URL = import.meta.env.VITE_BACK_END;

function PrenotazioniAdmin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Chiamata all'endpoint getAllBookings (richiede token admin nel fetch)
      const res = await fetch(`${API_URL}/bookings/all`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}` // O il tuo metodo di recupero token
        }
      });
      
      if (!res.ok) throw new Error("Impossibile caricare le prenotazioni");
      
      const json = await res.json();
      setBookings(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Errore fetch prenotazioni:", err);
      setError("Errore nel recupero delle prenotazioni.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    getBookings(); 
  }, [getBookings]);

  // Helper per il colore del Badge
  const getStatusBadge = (stato) => {
    switch (stato) {
      case 'Confermata': return <Badge bg="success" className="rounded-pill px-3">Confermata</Badge>;
      case 'In attesa': return <Badge bg="warning" text="dark" className="rounded-pill px-3">In attesa</Badge>;
      case 'Cancellata': return <Badge bg="danger" className="rounded-pill px-3">Cancellata</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill px-3">{stato}</Badge>;
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted small">Caricamento gestionale...</p>
    </div>
  );

  return (
    <div className="admin-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-1">Gestione Prenotazioni</h4>
          <p className="text-muted small mb-0">Monitora i soggiorni, gli arrivi e lo stato dei pagamenti</p>
        </div>
      </div>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <div className="table-responsive shadow-sm rounded">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead className="bg-light">
            <tr>
              <th className="border-0 text-muted small text-uppercase ps-3">Cliente</th>
              <th className="border-0 text-muted small text-uppercase">Soggiorno</th>
              <th className="border-0 text-muted small text-uppercase">Struttura / Camera</th>
              <th className="border-0 text-muted small text-uppercase text-center">Stato</th>
              <th className="border-0 text-muted small text-uppercase text-end pe-3">Totale</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="border-bottom">
                  <td className="py-3 ps-3">
                    <div className="fw-bold text-dark">{b.utente?.nome} {b.utente?.cognome}</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{b.utente?.email}</div>
                  </td>
                  <td>
                    <div className="small">
                      <div><i className="bi bi-calendar-check me-1"></i><strong>In:</strong> {new Date(b.checkIn).toLocaleDateString()}</div>
                      <div><i className="bi bi-calendar-x me-1"></i><strong>Out:</strong> {new Date(b.checkOut).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium text-primary">{b.struttura?.nome}</div>
                    <div className="text-muted small italic">{b.camera?.nome}</div>
                  </td>
                  <td className="text-center">
                    {getStatusBadge(b.stato)}
                  </td>
                  <td className="text-end pe-3 fw-bold">
                    € {b.prezzoTotale}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">Nessuna prenotazione trovata.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="text-muted small">Prenotazioni totali: <strong>{bookings.length}</strong></div>
      </div>
    </div>
  );
}

export default PrenotazioniAdmin;