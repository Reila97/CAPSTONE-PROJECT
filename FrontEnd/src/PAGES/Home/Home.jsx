import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import FormPrenotazione from "../../COMPONENTS/FormPrenotazione/FormPrenotazioni.jsx";
import StruttureClient from "../../COMPONENTS/Strutture/Struttura Clienti/StruttureClient.jsx";

function Home() {
  return (
    <>
      <Container fluid className="px-0">
        {" "}
        {/* px-0 toglie i padding interni del container */}
        <Row className="mx-0">
          <Col sm={12} md={9} lg={6} className="px-0">
            <FormPrenotazione />
            <StruttureClient/>
          </Col>
        </Row>
      </Container>

      //TODO carosello strutture
    </>
  );
}

export default Home;
