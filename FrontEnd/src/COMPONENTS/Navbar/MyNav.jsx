import "./MyNav.css";
import { Button, Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";

function MyNav() {
  return (
    // 'w-100' e 'vw-100' forzano la larghezza totale.
    // 'px-0' rimuove padding laterali della navbar stessa.
    <Navbar expand="lg" className="bg-body-tertiary w-100" style={{ width: '100vw' }}>
      <Container fluid className="px-4"> 
        {/* 'fluid' permette l'espansione, 'px-4' dà un minimo di respiro ai lati */}
        
        <Navbar.Brand href="#home">
          <img
            className="Logo"
            src="/Villa Fenix_Logo_Colore.png" 
            alt="Villa Fenix Logo"
            style={{ height: '40px', marginRight: '10px' }}
          />
          Villa Fenix
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          {/* 'ms-auto' sposta tutto il menu a DESTRA. Se vuoi i link a sinistra usa 'me-auto' */}
          <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="#home">Home</Nav.Link>

            <NavDropdown title="Le Nostre Strutture" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#osio">Osio Sotto</NavDropdown.Item>
              <NavDropdown.Item href="#osio2">Osio Sotto 2</NavDropdown.Item>
              <NavDropdown.Item href="#ponte">Ponte San Pietro</NavDropdown.Item>
              <NavDropdown.Item href="#seriate">Seriate</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#chi-siamo">Chi Siamo</Nav.Link>
            <Nav.Link href="#convenzioni">Convenzioni</Nav.Link>
            <Nav.Link href="#servizi">Servizi</Nav.Link>
            <Nav.Link href="#investi">Investi con noi</Nav.Link>
            <Nav.Link href="#aziende">Aziende</Nav.Link>
            <Nav.Link href="#contatti">Contatti</Nav.Link>
          </Nav>

          <Form className="d-flex ms-lg-3">
            <Form.Control
              type="search"
              placeholder="Cerca"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;