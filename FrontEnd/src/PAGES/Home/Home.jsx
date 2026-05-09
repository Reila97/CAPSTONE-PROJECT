import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import FormPrenotazione from "../../COMPONENTS/FormPrenotazione/FormPrenotazioni.jsx";
import StruttureClient from "../../COMPONENTS/Strutture/Struttura Clienti/StruttureClient.jsx";
import CamereClient from "../../COMPONENTS/Camere/CamereClient/CamereClient.jsx";

import "./Home.css";

function Home() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* COLONNA SINISTRA: Sidebar Prenotazioni */}
        {/* Resta fissa mentre la destra scorre */}
        <Col lg={4} xl={3} className="d-none d-lg-block sticky-column">
          <div className="sidebar-content">
            <FormPrenotazione />
          </div>
        </Col>

        {/* COLONNA DESTRA: Contenuto Dinamico */}
        <Col lg={8} xl={9} className="main-content">
          
          {/* Sezione Strutture */}
          <section className="home-section">
            <div className="horizontal-scroll-wrapper">
              <StruttureClient />
            </div>
          </section>

          <hr className="section-divider" />

          {/* Sezione Camere */}
          <section className="home-section">
            <div className="section-header px-4">
              <h2 className="headLine">Camere in Evidenza</h2>
              <p className="text-muted">Il massimo del comfort, pensato per te</p>
            </div>
            <div className="horizontal-scroll-wrapper">
              <CamereClient />
            </div>
          </section>

          <hr className="section-divider" />

          {/* Sezione Servizi */}
          <section className="home-section mb-5">
            <div className="section-header px-4">
              <h2 className="headLine">I Nostri Servizi</h2>
            </div>
            <div className="services-grid px-4">
               {['Piscina', 'WiFi Alta Velocità', 'Centro Benessere', 'Colazione Gourmet', 'Parcheggio'].map((s, i) => (
                 <div key={i} className="service-card shadow-sm">
                   <span className="service-icon">⭐</span>
                   <span className="service-name">{s}</span>
                 </div>
               ))}
            </div>
          </section>

        </Col>
      </Row>
    </Container>
  );
}

export default Home;