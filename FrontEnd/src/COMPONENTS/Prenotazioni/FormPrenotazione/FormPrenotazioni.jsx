import { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { CalendarCheck } from "react-bootstrap-icons";
import "./FormPrenotazioni.css";

const API_URL = import.meta.env.VITE_BACK_END;

function FormPrenotazioni({ onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Dati per i menu a tendina
  const [strutture, setStrutture] = useState([]);
  const [camere, setCamere] = useState([]); // Inizializzato correttamente come array
  
  const [formData, setFormData] = useState({
    struttura: "",
    camera: "",
    checkIn: "",
    checkOut: ""
  });

  // Caricamento iniziale strutture
  useEffect(() => {
    fetch(`${API_URL}/strutture`)
      .then(res => res.json())
      .then(data => setStrutture(Array.isArray(data) ? data : []))
      .catch(() => setError("Errore nel caricamento delle strutture"));
  }, []);

  // Caricamento camere dinamico
  useEffect(() => {
    if (formData.struttura) {
      // 🛠️ CORRETTO: Aggiunto lo slash "/" prima dell'ID della struttura
      fetch(`${API_URL}/strutture/camere/${formData.struttura}`)
        .then(res => res.json())
        .then(data => {
          // 🛡️ PROTEZIONE: Verifica che il backend restituisca un array, altrimenti imposta un array vuoto
          // Se il tuo backend risponde con un oggetto tipo { camere: [...] }, usa: data.camere
          setCamere(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setError("Errore nel caricamento delle camere");
          setCamere([]); // Svuota le camere in caso di errore
        });
    } else {
      setCamere([]); // Svuota le camere se non c'è una struttura selezionata
    }
  }, [formData.struttura]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella prenotazione");

      setSuccess(true);
      setFormData({ struttura: "", camera: "", checkIn: "", checkOut: "" });
      if (onCreated) onCreated(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-card-wrapper shadow-lg rounded-4 overflow-hidden">
      <div className="booking-card-inner">
        
        {/* LATO A: LOGO & BRANDING */}
        <div className="booking-logo-side d-flex flex-column align-items-center justify-content-center text-center p-4">
          <div className="logo-placeholder mb-3">
             <img src="/Villa Fenix_Logo_Colore.png" alt="Villa Fenix Logo" className="img-fluid" style={{maxWidth: '180px'}} />
          </div>
          <h2 className="headLine mt-3">Villa Fenix</h2>
          <p className="bodyCopy">La tua casa lontano da casa</p>
        </div>

        {/* LATO B: IL FORM */}
        <div className="booking-form-content bg-white">
          <Form onSubmit={handleSubmit} className="p-4 h-100 d-flex flex-column justify-content-center">
            <h3 className="headLine mb-4 text-center">Prenota il tuo soggiorno</h3>

            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            {success && <Alert variant="success" className="py-2 small">Prenotazione effettuata con successo!</Alert>}

            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="bodyCopy fw-bold small">Seleziona Struttura</Form.Label>
                  <Form.Select 
                    className="bodyCopy border-0 bg-light py-2"
                    value={formData.struttura}
                    onChange={(e) => setFormData({...formData, struttura: e.target.value, camera: ""})}
                    required
                  >
                    <option value="">Dove vuoi andare?</option>
                    {strutture.map(s => <option key={s._id} value={s._id}>{s.nome}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="bodyCopy fw-bold small">Tipologia Camera</Form.Label>
                  <Form.Select 
                    className="bodyCopy border-0 bg-light py-2"
                    value={formData.camera}
                    disabled={!formData.struttura}
                    onChange={(e) => setFormData({...formData, camera: e.target.value})}
                    required
                  >
                    <option value="">Scegli la tua camera</option>
                    {/* 🛡️ ULTERIORE BLINDATURA: optional chaining o controllo di sicurezza */}
                    {Array.isArray(camere) && camere.map(c => (
                      <option key={c._id} value={c._id}>{c.nome} - €{c.prezzo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="bodyCopy fw-bold small">Check-In</Form.Label>
                  <Form.Control 
                    type="date" 
                    className="bodyCopy border-0 bg-light"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="bodyCopy fw-bold small">Check-Out</Form.Label>
                  <Form.Control 
                    type="date" 
                    className="bodyCopy border-0 bg-light"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              disabled={loading}
              className="prenotaButton w-100 py-3 mt-4 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? <Spinner size="sm" /> : <><CalendarCheck /> Conferma Prenotazione</>}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default FormPrenotazioni;