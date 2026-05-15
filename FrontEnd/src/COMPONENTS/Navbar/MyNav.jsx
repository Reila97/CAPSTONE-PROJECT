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
    <Navbar expand="lg" className="sticky-top bg-white fenix-navbar py-3" collapseOnSelect>
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to={user ? "/home" : "/"} className="d-flex align-items-center">
          <img
            src="/Villa Fenix_Logo_Colore.png"
            className="logo-img"
            alt="logo villa fenix"
            style={{ height: "45px", objectFit: "contain" }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 fenix-toggle" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* MENU LINK */}
          <Nav className="ms-auto align-items-lg-center navigation-links">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/chiSiamo">Chi Siamo</Nav.Link>
            
            {/* DROPDOWN STRUTTURE */}
            <NavDropdown title="Le Nostre Strutture" id="nav-dropdown-strutture" className="fenix-dropdown">
              <NavDropdown.Item as={Link} to="/strutture" className="fw-bold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                Tutte le Strutture
              </NavDropdown.Item>
              <NavDropdown.Divider />
              {loadingStrutture ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" className="spinner-fenix" />
                </div>
              ) : (
                strutture.map((s) => (
                  <NavDropdown.Item key={s._id} as={Link} to={`/strutture/${s._id}`}>
                    {s.nome}
                  </NavDropdown.Item>
                ))
              )}
            </NavDropdown>

            <Nav.Link as={Link} to="/comingSoon">Convenzioni</Nav.Link>
            <Nav.Link as={Link} to="/comingSoon">Investi con noi</Nav.Link>
            <Nav.Link as={Link} to="/comingSoon">Aziende</Nav.Link>
            <Nav.Link as={Link} to="/comingSoon">Blog</Nav.Link>
            <Nav.Link as={Link} to="/comingSoon">Contatti</Nav.Link>

            {/* SEZIONE AUTHENTICATED */}
            {user ? (
              <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0 user-section">
                <NavDropdown 
                  title={<span>Ciao, <strong className="user-highlight">{user.nome}</strong></span>} 
                  id="user-dropdown"
                  align="end"
                  className="fenix-dropdown user-menu"
                >
                  <NavDropdown.Item as={Link} to="/profilo">Il mio Profilo</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/prenotazioni">Le mie Prenotazioni</NavDropdown.Item>
                  
                  {isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin" className="fw-bold text-admin-link">
                        Admin Panel
                      </NavDropdown.Item>
                    </>
                  )}
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger-fenix">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              /* SE NON LOGGATO */
              <Nav.Link as={Link} to="/" className="ms-lg-3 p-0 mt-3 mt-lg-0">
                <Button className="fenix-nav-btn rounded-pill px-4 shadow-sm text-white border-0">
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