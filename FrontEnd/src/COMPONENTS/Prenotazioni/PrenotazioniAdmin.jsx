import { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Badge, Alert } from "react-bootstrap";
// import EditBooking from "../Button/EditBooking"; 
// import DeleteBooking from "../Button/DeleteBooking"; 

import "./PrenotazioniAdmin.css"

const API_URL = import.meta.env.VITE_BACK_END;

function PrenotazioniAdmin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/bookings/all`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
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

  const getStatusBadge = (stato) => {
    switch (stato) {
      case 'Confermata': 
        return <Badge bg="none" className="badge-fenix badge-fenix-success">Confermata</Badge>;
      case 'In attesa': 
        return <Badge bg="none" className="badge-fenix badge-fenix-warning">In attesa</Badge>;
      case 'Cancellata': 
        return <Badge bg="none" className="badge-fenix badge-fenix-danger">Cancellata</Badge>;
      default: 
        return <Badge bg="none" className="badge-fenix badge-fenix-muted">{stato}</Badge>;
    }
  };

  if (loading) return (
    <div className="text-center py-5 v-fenix-loading">
      <Spinner animation="border" className="spinner-fenix" />
      <p className="mt-3 text-muted small text-uppercase tracking-wider">Caricamento gestionale...</p>
    </div>
  );

  return (
    <div className="admin-section p-4 v-fenix-admin-wrapper">
      
      {/* Header Sezione */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-1 v-fenix-title">
            Gestione Prenotazioni
          </h4>
          <p className="text-muted small mb-0">Monitora i soggiorni, gli arrivi e lo stato dei pagamenti della holding</p>
        </div>
      </div>

      {error && <Alert variant="danger" className="border-0 shadow-sm py-2 small">{error}</Alert>}

      {/* Tabella Gestionale Prenotazioni */}
      <div className="table-responsive shadow-sm rounded-3 border-0 bg-white">
        <Table hover className="align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th className="ps-4 py-3">Cliente</th>
              <th className="py-3">Soggiorno</th>
              <th className="py-3">Struttura / Camera</th>
              <th className="text-center py-3">Stato</th>
              <th className="text-end pe-4 py-3">Totale</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="align-middle row-fenix-booking">
                  
                  {/* Informazioni Cliente */}
                  <td className="py-3 ps-4">
                    <div className="fw-bold client-name">
                      {b.utente?.nome} {b.utente?.cognome}
                    </div>
                    <div className="text-muted small client-email">
                      {b.utente?.email}
                    </div>
                  </td>
                  
                  {/* Date di Soggiorno */}
                  <td>
                    <div className="small text-dark booking-dates">
                      <div className="mb-1">
                        <strong className="text-muted me-1 label-date">IN:</strong> 
                        <span className="fw-medium">{new Date(b.checkIn).toLocaleDateString('it-IT')}</span>
                      </div>
                      <div>
                        <strong className="text-muted me-1 label-date">OUT:</strong> 
                        <span className="fw-medium">{new Date(b.checkOut).toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Riferimento Struttura e Camera */}
                  <td>
                    <div className="fw-bold structure-name">
                      {b.struttura?.nome}
                    </div>
                    <div className="text-muted small camera-name">
                      {b.camera?.nome}
                    </div>
                  </td>
                  
                  {/* Stato della Prenotazione */}
                  <td className="text-center">
                    {getStatusBadge(b.stato)}
                  </td>
                  
                  {/* Totale Economico */}
                  <td className="text-end pe-4 fw-bold price-total">
                    {Number(b.prezzoTotale).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted small">
                  Nessuna prenotazione trovata nel registro digitale.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Footer della tabella con contatore */}
      <div className="mt-3 d-flex justify-content-between align-items-center px-2 counter-footer">
        <div className="text-muted small">
          Prenotazioni totali in elenco: <strong className="counter-highlight">{bookings.length}</strong>
        </div>
      </div>
    </div>
  );
}

export default PrenotazioniAdmin;