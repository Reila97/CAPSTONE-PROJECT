import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  FloatingLabel,
  Form,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../CONTEXT/IsAdmin";

import "./Login.css";
import GoogleLoginBtn from "../../COMPONENTS/Button/GoogleLoginBtn";

// Usa le variabili d'ambiente per l'URL dell'API (fallback su localhost se non definita)
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3002";

function Login() {
  const [view, setView] = useState("login");

  // Stati iniziali per un facile reset
  const initialLoginState = { email: "", password: "" };
  const initialRegisterState = {
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
  };

  const [loginData, setLoginData] = useState(initialLoginState);
  const [registerData, setRegisterData] = useState(initialRegisterState);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Funzione unica per cambiare scheda e resettare i dati
  const handleViewChange = (newView) => {
    setView(newView);
    setError(null);
    setSuccessMessage(null);
    setLoginData(initialLoginState);
    setRegisterData(initialRegisterState);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  // Logica di gestione del successo del login (DRY - Don't Repeat Yourself)
  const handleLoginSuccess = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const res = await fetch(`${API_URL}/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        login(userData, token);

        // Controllo flessibile del ruolo admin
        if (userData.ruolo === "ADMIN" || userData.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setError("Errore nel recupero del profilo utente.");
      }
    } catch (err) {
      console.error("Dettagli errore:", err);
      setError("Errore tecnico durante il login.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
    } catch (err) {
      setError("Il server non risponde. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const resRegister = await fetch(`${API_URL}/auth/registrazione`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const dataRegister = await resRegister.json();

      if (resRegister.ok) {
        setSuccessMessage("Registrazione completata! Accesso in corso...");

        // Login automatico
        const resLogin = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
          }),
        });

        const dataLogin = await resLogin.json();

        if (resLogin.ok) {
          await handleLoginSuccess(dataLogin.token);
        } else {
          setError(
            "Registrazione completata, ma errore nel login automatico. Prova ad accedere manualmente.",
          );
          setView("login");
          setLoginData({
            email: registerData.email,
            password: registerData.password,
          });
        }
      } else {
        setError(dataRegister.message || "Errore durante la registrazione.");
      }
    } catch (err) {
      console.error("Errore durante il processo:", err);
      setError("Il server non risponde. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  //GOOGLE
  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Reindirizziamo l'utente al backend.
    // Passport.js farà il resto e ci riporterà su /login-success
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <Container className="d-flex justify-content-center my-5">
      <div className="loginContainer w-100" style={{ maxWidth: "450px" }}>
        {/* Logo del Brand */}
        <div className="text-center mb-4">
          <img
            src="/Villa Fenix_Logo_Colore.png"
            className="Logo"
            alt="logo villa fenix"
          />
        </div>

        {/* Pulsanti Switcher */}
        <div className="d-flex mb-4 bg-light border p-1 rounded-5">
          <Button
            variant="transparent"
            className="w-50 rounded-5 fw-bold headLine transition"
            style={{
              backgroundColor: view === "login" ? "#f1901f" : "transparent",
              color: view === "login" ? "white" : "#212529",
              border: "none",
            }}
            onClick={() => handleViewChange("login")}
          >
            LOGIN
          </Button>
          <Button
            variant="transparent"
            className="w-50 rounded-5 fw-bold headLine transition"
            style={{
              backgroundColor: view === "register" ? "#f1901f" : "transparent",
              color: view === "register" ? "white" : "#212529",
              border: "none",
            }}
            onClick={() => handleViewChange("register")}
          >
            REGISTRATI
          </Button>
        </div>

        {/* Feedback messaggi */}
        {error && (
          <Alert
            variant="danger"
            className="py-2 small rounded-0 border-0 shadow-sm"
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            variant="success"
            className="py-2 small rounded-0 border-0 shadow-sm"
          >
            {successMessage}
          </Alert>
        )}

        {/* Form Container */}
        <div className="p-4 bg-white shadow-sm border rounded-4">
          {/* ==================== LOGIN ==================== */}
          {view === "login" && (
            <Form onSubmit={handleLoginSubmit}>
              <h5 className="headLine fw-bold small text-uppercase mb-3 text-secondary">
                Accedi al tuo Account
              </h5>

              <FloatingLabel label="Email" className="formLabel mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="rounded-4"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Password" className="formLabel mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="rounded-4"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </FloatingLabel>

              <Button
                type="submit"
                className="loginBtn w-100 rounded-4 fw-bold py-3 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "ACCEDI"
                )}
              </Button>
            </Form>
          )}

          {/* ==================== REGISTRAZIONE ==================== */}
          {view === "register" && (
            <Form onSubmit={handleRegisterSubmit}>
              <h5 className="headLine fw-bold small text-uppercase mb-3 text-secondary">
                Crea un nuovo Profilo
              </h5>

              <Row className="g-2">
                <Col md={6}>
                  <FloatingLabel label="Nome" className="formLabel mb-3">
                    <Form.Control
                      type="text"
                      name="nome"
                      placeholder="Nome"
                      className="rounded-4"
                      value={registerData.nome}
                      onChange={handleRegisterChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel label="Cognome" className="formLabel mb-3">
                    <Form.Control
                      type="text"
                      name="cognome"
                      placeholder="Cognome"
                      className="rounded-4"
                      value={registerData.cognome}
                      onChange={handleRegisterChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <FloatingLabel label="Email" className="formLabel mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="rounded-4"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />
              </FloatingLabel>

              <FloatingLabel
                label="Password (almeno 6 caratteri)"
                className="formLabel mb-3"
              >
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="rounded-4"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  minLength={6}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Data di Nascita" className="formLabel mb-3">
                <Form.Control
                  type="date"
                  name="dataDiNascita"
                  className="rounded-4"
                  value={registerData.dataDiNascita}
                  onChange={handleRegisterChange}
                  required
                />
              </FloatingLabel>

              <Button
                type="submit"
                className="loginBtn w-100 rounded-4 fw-bold py-3 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "REGISTRATI"
                )}
              </Button>
            </Form>
          )}
        </div>

        <div className="login-container">
          <div className="separator my-4 text-center position-relative">
            <hr />
            <span className="px-3 bg-white position-absolute top-50 start-50 translate-middle text-muted small fw-bold">
              OPPURE
            </span>
          </div>

          <GoogleLoginBtn onClick={handleGoogleLogin} isLoading={isLoading} />
        </div>
      </div>
    </Container>
  );
}

export default Login;

//TODO,non funziona il login con google