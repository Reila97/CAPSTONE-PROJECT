import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Twitter, Envelope, GeoAlt, Telephone } from "react-bootstrap-icons";

import "./Footer.css"


function Footer() {
  return (
<footer className="bg-white border-top py-5 mt-5">
      <Container>
        <Row className="gy-4 bodyCopy">
          {/* Brand e Descrizione */}
          <Col lg={4} md={6}>
            <h5 className="fw-bold mb-3 orangeTxt main">VILLA FENIX</h5>
            <p className="text-muted small lh-lg">
              Soluzioni di ospitalità esclusive per soggiorni indimenticabili. 
              Gestiamo le tue strutture con cura e professionalità, 
              garantendo standard qualitativi d'eccellenza.
            </p>
            <div className="d-flex gap-3 mt-3">
              <Facebook className="text-secondary cursor-pointer" size={18} />
              <Instagram className="text-secondary cursor-pointer" size={18} />
              <Twitter className="text-secondary cursor-pointer" size={18} />
            </div>
          </Col>

          {/* Link Rapidi */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3 small text-uppercase orangeTxt">Link Rapidi</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/" className="text-decoration-none text-muted">Home</a></li>
              <li className="mb-2"><a href="/camere" className="text-decoration-none text-muted">Camere</a></li>
              <li className="mb-2"><a href="/servizi" className="text-decoration-none text-muted">Servizi</a></li>
              <li className="mb-2"><a href="/prenotazioni" className="text-decoration-none text-muted">Prenotazioni</a></li>
            </ul>
          </Col>

          {/* Contatti */}
          <Col lg={4} md={6}>
            <h6 className="fw-bold mb-3 small text-uppercase orangeTxt">Contatti</h6>
            <ul className="list-unstyled small text-muted">
              <li className="d-flex align-items-center mb-2">
                <GeoAlt className="me-2" /> Via Roma 123, Italia
              </li>
              <li className="d-flex align-items-center mb-2">
                <Telephone className="me-2" /> +39 012 345 6789
              </li>
              <li className="d-flex align-items-center mb-2">
                <Envelope className="me-2" /> info@villafenix.it
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 text-muted opacity-25" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} Villa Fenix. Tutti i diritti riservati.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
            <a href="/privacy" className="text-decoration-none text-muted small me-3">Privacy Policy</a>
            <a href="/terms" className="text-decoration-none text-muted small">Termini & Condizioni</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;