import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router";

import EditProfile from "../../Button/EditProfile";
import DeleteProfile from "../../Button/DeleteProfile";
import "./user.css";

function User() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUserUpdate = (newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:3002/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          throw new Error("Sessione scaduta");
        }
      } catch (err) {
        setError(err.message); // Qui era l'errore: ora usa 'err'
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Alert variant="danger" className="mt-5">
        {error}. Reindirizzamento...
      </Alert>
    );

  return (
    <Container className="mt-5">
      <Card className="profile-card border-0 shadow-lg">
        <Row className="g-0">
          <Col
            md={4}
            className="profile-sidebar text-center p-4 bg-dark text-white"
          >
            <div className="profile-avatar-circle mb-3 mx-auto">
              <span className="initials">
                {userData.nome?.charAt(0)}
                {userData.cognome?.charAt(0)}
              </span>
            </div>
            <h4 className="fw-bold">
              {userData.nome} {userData.cognome}
            </h4>
            <Badge bg="light" text="dark">
              {userData.ruolo}
            </Badge>
          </Col>
          <Col md={8}>
            <Card.Body>
              <h5 className="text-muted small fw-bold mb-4">
                DETTAGLI ACCOUNT
              </h5>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Data Nascita:</strong>{" "}
                {userData.dataDiNascita
                  ? new Date(userData.dataDiNascita).toLocaleDateString()
                  : "Non specificata"}
              </p>

              <EditProfile user={userData} onUpdate={handleUserUpdate} />
              <DeleteProfile
                userId={userData._id}
                userName={`${userData.nome} ${userData.cognome}`}
              />
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default User;
