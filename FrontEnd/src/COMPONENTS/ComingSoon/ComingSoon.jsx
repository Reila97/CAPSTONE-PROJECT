import React from "react";
import { Container, Button } from "react-bootstrap";
import { ArrowLeft, HourglassSplit } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./ComingSoon.css";

function ComingSoon({ title = "Pagina in Arrivo" }) {
  const navigate = useNavigate();

  return (
    <Container fluid className="coming-soon-wrapper d-flex align-items-center justify-content-center bg-light-fenix">
      <div className="text-center p-4 max-width-550 animation-fade-in">
        
        {/* LOGO BRAND */}
        <div className="logo-container mb-4">
          <img 
            src="/Villa Fenix_Logo_Colore.png" 
            alt="Villa Fenix Logo" 
            className="img-fluid fenix-logo-cs"
          />
        </div>

        {/* ICONA DI ATTESA */}
        <div className="icon-pulse mb-3">
          <HourglassSplit size={40} className="text-orange-fenix" />
        </div>

        {/* TESTI NARRATIVI */}
        <h2 className="headLine display-6 mb-3">{title}</h2>
        
        <p className="bodyCopy mb-4 px-lg-3">
          Stiamo lavorando per darti un'esperienza ancora più smart ed efficiente, 
          curata nei minimi dettagli. Questa sezione sarà disponibile cortisamente a breve.
        </p>

        {/* BOTTONE DI RITORNO */}
        <Button 
          variant="outline-secondary" 
          className="fenix-btn-back rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 fw-medium"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft /> Torna Indietro
        </Button>
        
      </div>
    </Container>
  );
}

export default ComingSoon;