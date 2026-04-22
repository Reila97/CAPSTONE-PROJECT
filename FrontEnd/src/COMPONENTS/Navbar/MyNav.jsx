import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas
} from "react-bootstrap"

import "./MyNav.css";

function MyNav() {
   return (
    <Navbar expand="xxl" className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Brand href="#//TODO">
          <img
            className="Logo"
            src="/Villa Fenix_Logo_Colore.png"
            alt="Villa Fenix Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          Villa Fenix
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">

              <Nav.Link href="//TODO">Home</Nav.Link>

              <NavDropdown
                title="Le Nostre Strutture"
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item href="//TODO">Osio Sotto</NavDropdown.Item>
                <NavDropdown.Item href="//TODO">Osio Sotto 2</NavDropdown.Item>
                <NavDropdown.Item href="//TODO">
                  Ponte San Pietro
                </NavDropdown.Item>
                <NavDropdown.Item href="//TODO">Seriate</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="//TODO">Chi Siamo</Nav.Link>
              <Nav.Link href="//TODO">Convenzioni</Nav.Link>
              <Nav.Link href="//TODO">Servizi</Nav.Link>
              <Nav.Link href="//TODO">Investi con noi</Nav.Link>
              <Nav.Link href="//TODO">Aziende</Nav.Link>
              <Nav.Link href="//TODO">Contatti</Nav.Link>
            </Nav>

            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default MyNav;
