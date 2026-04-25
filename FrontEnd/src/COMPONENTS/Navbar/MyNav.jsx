import { Navbar, Nav, Container, NavDropdown, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../CONTEXT/IsAdmin";

const MyNav = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  // Stato per le strutture dinamiche nel dropdown
  const [strutture, setStrutture] = useState([]);
  const [loadingStrutture, setLoadingStrutture] = useState(false);

  // Caricamento strutture per il dropdown
  useEffect(() => {
    if (user) {
      setLoadingStrutture(true);
      fetch("http://localhost:3002/strutture")
        .then((res) => res.json())
        .then((data) => setStrutture(data))
        .catch((err) => console.error("Errore caricamento dropdown:", err))
        .finally(() => setLoadingStrutture(false));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="sticky-top shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={user ? "/home" : "/"}>
          VILLA FENIX
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            
            {/* ROTTE PUBBLICHE / HOME */}
            {user && <Nav.Link as={Link} to="/home">Home</Nav.Link>}

            {/* DROPDOWN DINAMICO STRUTTURE */}
            {user && (
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
                    <NavDropdown.Item key={s._id} as={Link} to={`/strutture/${s._id}`}>
                      {s.nome}
                    </NavDropdown.Item>
                  ))
                )}
              </NavDropdown>
            )}

            {/* ROTTE RISERVATE ADMIN */}
            {isAdmin && (
              <NavDropdown title="Pannello Admin" id="admin-nav-dropdown" className="bg-warning rounded px-1">
                <NavDropdown.Item as={Link} to="/admin/users">
                  Gestione Utenti
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/strutture">
                  Gestione Strutture
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/profilo" className="me-2">
                  Ciao, <strong>{user.nome}</strong>
                </Nav.Link>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleLogout}
                  className="rounded-pill"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;

