import { useState } from "react";
import { Alert, Button, Container, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSuccess = async (token) => {
    localStorage.setItem("token", token);

    try {
      const decoded = jwtDecode(token);

      const res = await fetch(`http://localhost:3002/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem("user", JSON.stringify(userData)); 
        navigate("/profilo"); 
      } else {
        throw new Error("Errore nel recupero dati profilo");
      }
    } catch (err) {
      console.error("Dettagli errore:", err);
      setError("Login effettuato, ma errore nel caricamento del profilo.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (res.ok) {
        await handleLoginSuccess(data.token);
      } else {
        setError(data.message || "Credenziali non valide");
      }
    } catch (error) {
      setError("Il server non risponde. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  //TODO login google

  return (
    <Container className="d-flex justify-content-center mt-5">
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 fw-light text-uppercase">Villa Fenix</h2>

        {error && (
          <Alert variant="danger" className="py-2 small border-0 rounded-0">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="p-4 bg-white border-0 shadow-sm">
          <FloatingLabel controlId="email" label="Indirizzo Email" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={loginData.email}
              onChange={handleChange}
              className="border-0 border-bottom rounded-0 px-0"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="password" label="Password" className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              className="border-0 border-bottom rounded-0 px-0"
              required
            />
          </FloatingLabel>

          <Button
            variant="dark"
            type="submit"
            className="w-100 mb-3 rounded-0 py-2"
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "ACCEDI"}
          </Button>

          <div className="text-center position-relative my-4">
            <hr />
            <span className="small text-muted bg-white px-3 position-absolute top-50 start-50 translate-middle">
              oppure
            </span>
          </div>

          <div className="d-flex justify-content-center">
            {/* //TODO: Inserire qui il componente per il login con Google */}
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;