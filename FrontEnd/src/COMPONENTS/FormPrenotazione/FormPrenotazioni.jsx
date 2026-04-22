import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./FormPrenotazioni.css";

const FormPrenotazioni = () => {
  return (
    <>
      <div className="booking-card-wrapper">
        <div className="booking-card-inner">
          {/* LATO A: L'Immagine */}
          <div className="booking-image">
            <img src="./WallPaper TV_1.jpg" alt="Prenotazione" />
            <div className="image-overlay text-white d-flex align-items-start">
              <h3 className="mt-3">Passa qui per prenotare</h3>
            </div>
          </div>
          {/* LATO B: Il Form */}
          <div className="booking-form-content">
            <Form className="p-4 d-flex flex-column h-100 justify-content-center">
              <h2 className="mb-4 text-center">Prenota Ora</h2>

              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control size="lg" type="text" placeholder="Tuo nome" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Control size="lg" type="date" />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-100 mt-3"
              >
                Invia Prenotazione
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormPrenotazioni;
