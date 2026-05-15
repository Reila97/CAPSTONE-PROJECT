import React, { useState } from "react";
import { Container, Row, Col, Button, Offcanvas, Card } from "react-bootstrap";
import { CalendarCheck, List, CupHot, Wifi, ShieldCheck, Award, Map } from "react-bootstrap-icons";

import FormPrenotazione from "../../COMPONENTS/Prenotazioni/FormPrenotazione/FormPrenotazioni.jsx";
import StruttureClient from "../../COMPONENTS/Strutture/Struttura Clienti/StruttureClient.jsx";
import CamereClient from "../../COMPONENTS/Camere/CamereClient/CamereClient.jsx";

import "./Home.css";

function Home() {
  const [showBooking, setShowBooking] = useState(false);

  // Servizi istituzionali ottimizzati per l'esperienza Affittacamere Villa Fenix
  const serviziBB = [
    { nome: 'Colazione Gourmet', icon: <CupHot /> },
    { nome: 'WiFi Alta Velocità', icon: <Wifi /> },
    { nome: 'Accoglienza Fenix', icon: <Award /> },
    { nome: 'Posizione Centrale', icon: <Map /> },
    { nome: 'Comfort Garantito', icon: <ShieldCheck /> }
  ];

  return (
    <Container fluid className="p-0 vf-home-wrapper">
      
      {/* HEADER MOBILE - Rispetta le restrizioni di scomposizione del brand logo */}
      <div className="d-lg-none p-3 d-flex justify-content-between align-items-center bg-white shadow-sm sticky-top vf-mobile-header">
        <div className="vf-responsive-logo-wrapper">
          {/* Sotto i 30mm/risoluzioni mobile viene mostrato solo il Brand Symbol o una resa testuale controllata */}
          <span className="brand-symbol-fallback">🦅</span>
          <h3 className="vf-brand-name-mobile m-0 text-uppercase">
            Villa Fenix <span className="vf-brand-sub-mobile">Affittacamere</span>
          </h3>
        </div>
        <Button variant="link" className="p-0 vf-menu-toggle-btn">
          <List size={28}/>
        </Button>
      </div>

      {/* SEZIONE HERO: Con payoff istituzionale usato CORRETTAMENTE nel testo e MAI associato al logo */}
      <section className="vf-hero-section text-center text-white px-3 d-flex align-items-center justify-content-center">
        <div className="py-5 vf-hero-content">
          <h1 className="vf-hero-title display-2 text-uppercase mb-3">VILLA FENIX</h1>
          <div className="vf-hero-divider mx-auto mb-3"></div>
       
          <p className="vf-hero-payoff fst-italic">
            "La tua casa... lontano da casa"
          </p>
        </div>
      </section>

      {/* BARRA DI PRENOTAZIONE ORIZZONTALE (DESKTOP) */}
      <Container className="vf-booking-bar-container d-none d-lg-block">
        <Row className="justify-content-center">
          <Col lg={11} xl={10}>
            <Card className="vf-booking-card-wrapper p-4 shadow-sm border-0">
              <FormPrenotazione />
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CONTENUTO PRINCIPALE */}
      <Container className="py-5 mt-3 mt-lg-5 px-4 px-md-5">
        
        {/* Sezione Strutture */}
        <section className="home-section mb-5">
          <div className="text-center text-lg-start mb-4">
            <h2 className="vf-home-section-title h3 text-uppercase mb-1">Le Nostre Strutture</h2>
            <p className="vf-home-section-subtitle mb-0">Scopri le esclusive location firmate Villa Fenix</p>
          </div>
          <div className="px-0">
            <StruttureClient />
          </div>
        </section>

        <hr className="vf-section-divider my-5" />

        {/* Sezione Camere e Suite */}
        <section className="home-section mb-5">
          <div className="text-center text-lg-start mb-4">
            <h2 className="vf-home-section-title h3 text-uppercase mb-1">Camere & Suite</h2>
            <p className="vf-home-section-subtitle mb-0">Ambienti intimi e dettagli di pregio pensati per il tuo riposo</p>
          </div>
          <div className="px-0">
            <CamereClient />
          </div>
        </section>

        <hr className="vf-section-divider my-5" />

        {/* Sezione Servizi Istituzionali */}
        <section className="home-section mb-5 pb-5 pb-lg-0">
          <div className="text-center mb-5">
            <h2 className="vf-home-section-title h3 text-uppercase mb-1">I Servizi Esclusivi</h2>
            <p className="vf-home-section-subtitle mb-0">Ogni dettaglio è pensato per rendere impeccabile la tua permanenza</p>
          </div>
          
          <Row className="g-4 justify-content-center">
            {serviziBB.map((item, i) => (
              <Col xs={6} sm={4} md={3} lg={2} key={i}>
                <Card className="vf-service-card text-center p-3 h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-0">
                    <div className="vf-service-icon-box mb-3">
                      {item.icon}
                    </div>
                    <div className="vf-service-text text-uppercase">{item.nome}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* BOTTONE FLOATING SMART MOBILE (Fix sintassi zIndex) */}
      <div className="d-lg-none fixed-bottom p-3 text-center" style={{ zIndex: 1050 }}>
        <Button 
          className="vf-mobile-floating-btn rounded-pill shadow-lg px-4 py-3 w-100 border-0 text-white text-uppercase tracking-wider"
          onClick={() => setShowBooking(true)}
        >
          <CalendarCheck className="me-2" size={18} /> Verifica Disponibilità
        </Button>
      </div>

      {/* PANNELLO DI PRENOTAZIONE IN OFFCANVAS (MOBILE) */}
      <Offcanvas 
        show={showBooking} 
        onHide={() => setShowBooking(false)} 
        placement="bottom" 
        className="h-75 rounded-top-4 overflow-auto vf-offcanvas-custom"
      >
        <Offcanvas.Header closeButton className="vf-offcanvas-header px-4">
          <Offcanvas.Title className="text-uppercase h5 vf-offcanvas-title">
            Pianifica il Soggiorno
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4 bg-light">
          <FormPrenotazione onCreated={() => setShowBooking(false)} />
        </Offcanvas.Body>
      </Offcanvas>

    </Container>
  );
}

export default Home;