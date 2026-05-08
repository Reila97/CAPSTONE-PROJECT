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
import { useAuth } from "../CONTEXT/IsAdmin.jsx";
import "./Navbar/MyNav.css";

const API_URL = import.meta.env.VITE_BACK_END;

function MyNav() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [strutture, setStrutture] = useState([]);
  const [loadingStrutture, setLoadingStrutture] = useState(false);

  useEffect(() => {
    setLoadingStrutture(true);
    fetch(`${API_URL}/strutture`)
      .then((res) => res.json())
      .then((data) => setStrutture(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Errore caricamento dropdown:", err))
      .finally(() => setLoadingStrutture(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="sticky-top shadow-sm bg-white py-2" collapseOnSelect>
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to={user ? "/home" : "/"} className="d-flex align-items-center">
          <img
            src="/Villa Fenix_Logo_Colore.png"
            className="logo"
            alt="logo villa fenix"
            style={{ height: "50px" }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* MENU VISIBILE A TUTTI */}
          <Nav className="ms-auto align-items-center fw-medium">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/chi-siamo">Chi Siamo</Nav.Link>
            
            {/* DROPDOWN STRUTTURE */}
            <NavDropdown title="Le Nostre Strutture" id="nav-dropdown-strutture">
              <NavDropdown.Item as={Link} to="/strutture">
                Tutte le Strutture
              </NavDropdown.Item>
              <NavDropdown.Divider />
              {loadingStrutture ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" variant="warning" />
                </div>
              ) : (
                strutture.map((s) => (
                  <NavDropdown.Item key={s._id} as={Link} to={`/strutture/${s._id}`}>
                    {s.nome}
                  </NavDropdown.Item>
                ))
              )}
            </NavDropdown>

            <Nav.Link as={Link} to="/convenzioni">Convenzioni</Nav.Link>
            <Nav.Link as={Link} to="/investi-con-noi">Investi con noi</Nav.Link>
            <Nav.Link as={Link} to="/aziende">Aziende</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/contatti">Contatti</Nav.Link>

            {/* SEZIONE LOGGATO (PROFILO / ADMIN) */}
            {user ? (
              <>
                <div className="d-flex align-items-center ms-lg-3 gap-2">
                  
                  {/* DROPDOWN UTENTE */}
                  <NavDropdown 
                    title={<span>Ciao, <strong className="orangeTxt">{user.nome}</strong></span>} 
                    id="user-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/profilo">Il mio Profilo</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/prenotazioni">Le mie Prenotazioni</NavDropdown.Item>
                    
                    {/* ADMIN PANEL (Se admin) */}
                    {isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin" className="fw-bold text-primary">
                          Admin Panel
                        </NavDropdown.Item>
                      </>
                    )}
                    
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout} className="text-danger">
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </>
            ) : (
              /* SE NON LOGGATO */
              <Nav.Link as={Link} to="/" className="ms-lg-3 fw-bold">
                <Button variant="warning" size="sm" className="rounded-pill px-4 shadow-sm text-white">
                  Accedi
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;
//TODO sistemare e mettere in mynav