import React, { useState } from "react";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import { CalendarCheck, List } from "react-bootstrap-icons";

import FormPrenotazione from "../../COMPONENTS/Prenotazioni/FormPrenotazione/FormPrenotazioni.jsx";
import StruttureClient from "../../COMPONENTS/Strutture/Struttura Clienti/StruttureClient.jsx";
import CamereClient from "../../COMPONENTS/Camere/CamereClient/CamereClient.jsx";

import "./Home.css";

function Home() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <Container fluid className="p-0 bg-light-fenix">
      {/* BOTTONE FLOATING PER MOBILE - Appare solo su schermi piccoli */}
      <div className="d-lg-none fixed-bottom p-3 text-center">
        <Button 
          className="prenotaButton rounded-pill shadow-lg px-5 py-3 w-100"
          onClick={() => setShowBooking(true)}
        >
          <CalendarCheck className="me-2" /> Prenota Ora
        </Button>
      </div>

      <Row className="g-0">
        {/* SIDEBAR DESKTOP: Resta Col 3/4 solo su grandi schermi */}
        <Col lg={4} xl={3} className="d-none d-lg-block sticky-column bg-white shadow-sm">
          <div className="sidebar-content p-4">
            <FormPrenotazione /> 
          </div>
        </Col>

        {/* CONTENUTO PRINCIPALE */}
        <Col lg={8} xl={9} className="main-content">
          
          {/* Header Mobile: Logo e Menu */}
          <div className="d-lg-none p-3 d-flex justify-content-between align-items-center bg-white shadow-sm mb-3">
             <h3 className="headLine m-0">Villa Fenix</h3>
             <Button variant="link" className="text-dark"><List size={30}/></Button>
          </div>

          {/* Sezione Strutture */}
          <section className="home-section py-4">
            <div className="section-header px-4 mb-3">
               <h2 className="headLine">Le Nostre Strutture</h2>
               <p className="bodyCopy small">Scegli la cornice perfetta per il tuo relax</p>
            </div>
            <div className="horizontal-scroll-wrapper px-2">
              <StruttureClient />
            </div>
          </section>

          <hr className="section-divider mx-4" />

          {/* Sezione Camere */}
          <section className="home-section py-4">
            <div className="section-header px-4 mb-3">
              <h2 className="headLine">Camere in Evidenza</h2>
              <p className="bodyCopy small">Il massimo del comfort, pensato per te</p>
            </div>
            <div className="horizontal-scroll-wrapper px-2">
              <CamereClient />
            </div>
          </section>

          <hr className="section-divider mx-4" />

          {/* Sezione Servizi: Grid Responsive */}
          <section className="home-section py-4 mb-5 pb-5 pb-lg-0">
            <div className="section-header px-4 mb-4">
              <h2 className="headLine">I Nostri Servizi</h2>
            </div>
            <Row className="px-4 g-3">
              {['Piscina', 'WiFi Alta Velocità', 'Centro Benessere', 'Colazione Gourmet', 'Parcheggio'].map((s, i) => (
                <Col xs={6} md={4} lg={2} key={i}>
                  <div className="service-card shadow-sm rounded-4 text-center p-3 h-100 bg-white">
                    <div className="service-icon mb-2">⭐</div>
                    <div className="service-name bodyCopy fw-bold" style={{fontSize: '0.8rem'}}>{s}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        </Col>
      </Row>

      {/* OFFCANVAS PER PRENOTAZIONE MOBILE */}
      <Offcanvas show={showBooking} onHide={() => setShowBooking(false)} placement="bottom" className="h-75 rounded-top-5">
        <Offcanvas.Header closeButton className="border-bottom mx-2">
          <Offcanvas.Title className="headLine">Prenota Soggiorno</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FormPrenotazione onCreated={() => setShowBooking(false)} />
        </Offcanvas.Body>
      </Offcanvas>

    </Container>
  );
}

export default Home;