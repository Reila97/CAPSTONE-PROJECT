import { useState } from "react";
import { Alert, Button, Container, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../CONTEXT/IsAdmin";

import "./Login.css"

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSuccess = async (token) => {
    try {
      const decoded = jwtDecode(token);
      // Recupero i dati completi dell'utente dopo il login
      const res = await fetch(`http://localhost:3002/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        login(userData, token); // Salvo nel context e localStorage
        
        if (userData.ruolo === "ADMIN" || userData.isAdmin) {
          navigate("/admin"); //TODO
        } else {
          navigate("/home");
        }
      } else {
        setError("Errore nel recupero profilo utente.");
      }
    } catch (err) {
      console.error("Dettagli errore:", err);
      setError("Errore tecnico durante il login.");
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

  return (
    <Container className="d-flex justify-content-center mt-5">

      <div className="loginContainer">

     <img 
     src="/Villa Fenix_Logo_Colore.png" 
     className="Logo"
     alt="logo villa fenix"/>

        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        
        <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm">
          <FloatingLabel label="Email" className="formLabel mb-3">
            <Form.Control 
              type="email" name="email" 
              value={loginData.email} onChange={handleChange} required 
            />
          </FloatingLabel>


          <FloatingLabel label="Password" className="formLabel mb-3">
            <Form.Control 
              type="password" name="password" 
              value={loginData.password} onChange={handleChange} required 
            />
          </FloatingLabel>


          <Button 
           type="submit" 
           className="logoButton w-100" 
           disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "ACCEDI"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;