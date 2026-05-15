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
  const [camere, setCamere] = useState([]); 
  
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
      fetch(`${API_URL}/strutture/camere/${formData.struttura}`)
        .then(res => res.json())
        .then(data => {
          setCamere(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setError("Errore nel caricamento delle camere");
          setCamere([]); 
        });
    } else {
      setCamere([]); 
    }
  }, [formData.struttura]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    loading(true);
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
          <div className="logo-placeholder mb-2">
             <img src="/Villa Fenix_Logo_Colore.png" alt="Villa Fenix Logo" className="img-fluid" style={{maxWidth: '160px'}} />
          </div>
          <h2 className="mt-3">Villa Fenix</h2>
          <p className="mb-0">La tua casa lontano da casa</p>
        </div>

        {/* LATO B: IL FORM */}
        <div className="booking-form-content bg-white p-4 flex-grow-1">
          <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column justify-content-center">
            <h3 className="mb-4 text-center">Prenota il tuo soggiorno</h3>

            {error && <Alert variant="danger" className="py-2 vf-booking-alert">{error}</Alert>}
            {success && <Alert variant="success" className="py-2 vf-booking-alert">Prenotazione effettuata con successo!</Alert>}

            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="vf-form-label">Seleziona Struttura</Form.Label>
                  <Form.Select 
                    className="vf-form-input py-2"
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
                  <Form.Label className="vf-form-label">Tipologia Camera</Form.Label>
                  <Form.Select 
                    className="vf-form-input py-2"
                    value={formData.camera}
                    disabled={!formData.struttura}
                    onChange={(e) => setFormData({...formData, camera: e.target.value})}
                    required
                  >
                    <option value="">Scegli la tua camera</option>
                    {Array.isArray(camere) && camere.map(c => (
                      <option key={c._id} value={c._id}>{c.nome} - €{c.prezzo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="vf-form-label">Check-In</Form.Label>
                  <Form.Control 
                    type="date" 
                    className="vf-form-input py-2"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="vf-form-label">Check-Out</Form.Label>
                  <Form.Control 
                    type="date" 
                    className="vf-form-input py-2"
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
              className="prenotaButton w-100 py-2.5 mt-4 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? <Spinner size="sm" animation="border" /> : <><CalendarCheck size={18} /> Conferma Prenotazione</>}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default FormPrenotazioni;
