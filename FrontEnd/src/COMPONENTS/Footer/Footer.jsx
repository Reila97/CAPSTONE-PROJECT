import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Envelope, GeoAlt } from "react-bootstrap-icons";
import "./Footer.css";

function Footer() {
  return (
    <footer className="vf-footer py-5 mt-5">
      <Container>
        <Row className="gy-4">
          {/* Brand Identity */}
          <Col lg={4} md={6}>
            <div className="mb-3">
              <h5 className="fw-bold mb-0 vf-footer-brand">VILLA FENIX</h5>
              <span className="fw-bold d-block vf-footer-subbrand">AFFITTACAMERE</span>
            </div>
            <p className="vf-text-muted small lh-lg mb-3">
              Soluzioni di ospitalità esclusive per soggiorni indimenticabili. 
              Garantiamo standard qualitativi d'eccellenza e il comfort di una vera casa.
            </p>
            {/* Pulsanti di collegamento Social */}
            <div className="d-flex gap-2">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="vf-social-btn"
                aria-label="Profilo Facebook Villa Fenix"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="vf-social-btn"
                aria-label="Profilo Instagram Villa Fenix"
              >
                <Instagram size={16} />
              </a>
            </div>
          </Col>

          {/* Link Rapidi */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3 text-uppercase vf-footer-title">Our Locations</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="/home" className="text-decoration-none vf-footer-link">Home</a>
                </li>

              <li className="mb-2">
                <a href="/camere" className="text-decoration-none vf-footer-link">Camere</a>
                </li>

              <li className="mb-2">
                <a href="/comingSoon" className="text-decoration-none vf-footer-link">Servizi</a>
                </li> //TODO

              <li className="mb-2">
                <a href="/comingSoon" className="text-decoration-none vf-footer-link">Prenotazioni</a>
                </li> //TODO
            </ul>
          </Col>

          {/* Sede Legale e Contatti */}
          <Col lg={6} md={12}>
            <h6 className="fw-bold mb-3 text-uppercase vf-footer-title">Sede Legale & Contatti</h6>
            <ul className="list-unstyled small vf-text-muted">
              <li className="d-flex align-items-start mb-2.5">
                <GeoAlt className="me-2 mt-1 vf-footer-icon" size={16} />
                <span>
                  Via Michelangelo Buonarroti 16<br />
                  24046 Osio Sotto (BG) — Italia
                </span>
              </li>
              <li className="d-flex align-items-center mb-2.5">
                <Envelope className="me-2 vf-footer-icon" size={16} />
                <a href="mailto:info@villafenix.it" className="text-decoration-none vf-footer-link">
                  info@villafenix.it
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Informazioni Holding e Copyright */}
        <Row className="align-items-center mt-4 pt-3 vf-holding-info">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="vf-text-muted small mb-0">
              © {new Date().getFullYear()} <strong>Villa Fenix</strong>. Tutti i diritti riservati.
            </p>
            <span className="d-block text-muted" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              Fenix Holding Srl — P.IVA 04341020164
            </span>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a href="/privacy" className="text-decoration-none vf-footer-link small me-3">Privacy Policy</a>
            <a href="/terms" className="text-decoration-none vf-footer-link small">Termini & Condizioni</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;