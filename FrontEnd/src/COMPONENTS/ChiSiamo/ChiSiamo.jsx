import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Compass, Stars, ClockHistory } from "react-bootstrap-icons";
import "./ChiSiamo.css";

function ChiSiamo() {
  return (
    <Container className="py-5 bg-about-fenix">
      {/* INTRODUZIONE PRINCIPALE */}
      <div className="text-center mb-5 max-width-700 mx-auto px-3">
        <h1 className="vf-main-title display-5 mb-3">Villa Fenix</h1>
        <p className="vf-corporate-payoff lead fw-medium italic-text">
          “…la tua casa lontano da casa resterà sempre la nostra missione…”
        </p>
      </div>

      <Row className="g-4 justify-content-center">
        {/* SEZIONE 1: IL MITO DELLA FENICE */}
        <Col lg={4} md={6} xs={12}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 card-fenix">
            <Card.Body className="d-flex flex-column p-0">
              <div className="icon-wrapper mb-3 text-warning-fenix">
                <Compass size={24} />
              </div>
              <h3 className="vf-section-title h4 mb-3">Il Mito della Fenice</h3>
              <p className="vf-body-text small mb-3">
                Nota fin dall'antico Egitto come <em>Bennu</em> e ridefinita dalla cultura greca come uno splendido uccello d'oro e fuoco, la Fenice rappresenta da sempre la <strong>rinascita</strong> e l'immortalità dello spirito, risorgendo dalle proprie ceneri.
              </p>
              <div className="vf-quote-box mt-auto p-3 rounded-3">
                <p className="vf-body-text italic-text small mb-0">
                  "Non vive di semi ed erbe, ma di gocce d’incenso e della linfa del cardamomo..." 
                  <span className="d-block text-end fw-bold mt-1">— Ovidio</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* SEZIONE 2: LA VISIONE (LA TUA CASA...) */}
        <Col lg={4} md={6} xs={12}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 card-fenix highlight-card">
            <Card.Body className="d-flex flex-column p-0">
              <div className="icon-wrapper mb-3 text-warning-fenix">
                <Stars size={24} />
              </div>
              <h3 className="vf-section-title h4 mb-3">La tua casa... lontano da casa</h3>
              <div className="vf-body-text small mb-3">
                <p className="mb-3">
                  Molto più di una guesthouse: un rifugio di comfort "stellato" a prezzi accessibili. Un luogo di rinnovamento e benessere che si riflette nell'arredamento curato e nell'ispirazione aromatica delle nostre camere:
                </p>
                <span className="d-block mt-2 fw-medium text-uppercase tracking-wider vf-aroma-tagline" style={{ fontSize: '0.72rem' }}>
                  Cannella • Spigonardo • Mirra • Incenso • Resina • Palma
                </span>
              </div>
              <p className="vf-body-text small mt-auto mb-0">
                Ogni ambiente è pensato per regalarvi momenti unici di relax, avvolti da luci e profumi esclusivi.
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* SEZIONE 3: LA NOSTRA STORIA */}
        <Col lg={4} md={12} xs={12}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 card-fenix">
            <Card.Body className="d-flex flex-column p-0">
              <div className="icon-wrapper mb-3 text-warning-fenix">
                <ClockHistory size={24} />
              </div>
              <h3 className="vf-section-title h4 mb-3">La Nostra Storia</h3>
              <p className="vf-body-text small mb-0">
                Il progetto nasce dall'idea di Leonardo Aridelli di offrire accoglienza a chi necessitava di cure ospedaliere presso il Policlinico San Marco a Osio Sotto. Nel 2017, il figlio Mariano trasforma la casa di famiglia dando vita alla prima struttura, inaugurata il 3 febbraio 2018.
              </p>
              <hr className="my-3 opacity-25" style={{ color: '#65513D' }} />
              <p className="vf-body-text small mb-0">
                Oggi Villa Fenix è una realtà solida in costante espansione con 5 strutture strategiche. Perfette sia per scopi sanitari sia per scoprire le bellezze di Bergamo e Milano, combinando automazione smart e calore domestico.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ChiSiamo;