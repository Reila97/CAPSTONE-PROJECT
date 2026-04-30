import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../../CONTEXT/IsAdmin";

import "./MyNav.css";

function MyNav ()  {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Stato per le strutture dinamiche nel dropdown
  const [strutture, setStrutture] = useState([]);
  const [loadingStrutture, setLoadingStrutture] = useState(false);

  // Caricamento strutture per il dropdown
  useEffect(() => {
    // Carichiamo i dati solo se l'utente esiste
    if (user) {
      setLoadingStrutture(true);
      fetch("http://localhost:3002/strutture")
        .then((res) => res.json())
        .then((data) => setStrutture(data))
        .catch((err) => console.error("Errore caricamento dropdown:", err))
        .finally(() => setLoadingStrutture(false));
    } else {
      // Se l'utente fa logout, svuotiamo la lista
      setStrutture([]);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="sticky-top shadow-sm bg-white">
      <Container>
        {/* Brand Link: cambia destinazione in base allo stato user */}
        <Navbar.Brand as={Link} to={user ? "/home" : "/"} className="main">
          <img
            src="/Villa Fenix_Logo_Colore.png"
            className="logo"
            alt="logo villa fenix"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto bodyCopy align-items-lg-center">
            
            {/* SEZIONE UTENTE LOGGATO */}
            {user ? (
              <>
                <Nav.Link as={Link} to="/home">
                  Home
                </Nav.Link>

                <NavDropdown title="Strutture" id="nav-dropdown-strutture">
                  <NavDropdown.Item as={Link} to="/strutture">
                    Tutte le Strutture
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                  {loadingStrutture ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    strutture.map((s) => (
                      <NavDropdown.Item
                        key={s._id}
                        as={Link}
                        to={`/strutture/${s._id}`}
                      >
                        {s.nome}
                      </NavDropdown.Item>
                    ))
                  )}
                </NavDropdown>

                <div className="d-flex align-items-center">
                  <Nav.Link as={Link} to="/profilo" className="me-2">
                    Ciao,{" "}
                    <span className="main orangeTxt">
                      <strong>{user.nome}</strong>
                    </span>
                  </Nav.Link>

                  {isAdmin && (
                    <Nav.Link as={Link} to="/admin" className="me-2">
                      | <span className="main orangeTxt">Admin Panel</span>
                    </Nav.Link>
                  )}

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                    className="rounded-pill ms-2"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              /* SEZIONE UTENTE NON LOGGATO */
              <Nav.Link as={Link} to="/">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;