import { useState, useId } from "react";
import { Form, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";

function UniversalUploader({
  endpoint,
  fieldName,
  onUploadSuccess,
  method = "PATCH",
  multiple = false,
  label = "Cambia Immagine", // Prop aggiunta per flessibilità
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // Genera un ID univoco per collegare correttamente Label e Input
  const uploaderId = useId();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError(null);
    setProgress(30); // Progresso iniziale simulato

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });

    try {
      const token = localStorage.getItem("token");

      // Nota: Fetch non supporta il progresso reale. 
      // Per il progresso reale servirebbe Axios o XMLHttpRequest.
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Il Content-Type viene gestito automaticamente dal browser
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(100);
        
        setTimeout(() => {
          onUploadSuccess(data);
          // Reset stati
          setProgress(0);
          setLoading(false);
        }, 600);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Errore durante il caricamento");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setProgress(0);
    } finally {
      // Reset dell'input per permettere di selezionare lo stesso file due volte di fila
      e.target.value = "";
    }
  };

  return (
    <div className="universal-uploader">
      <Form.Group>
        {/* Usiamo htmlFor per accessibilità e per attivare l'input nascosto */}
        <Form.Label 
          htmlFor={uploaderId}
          className={`btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm d-inline-flex align-items-center ${loading ? 'disabled' : 'cursor-pointer'}`}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? (
            <Spinner size="sm" animation="border" className="me-2" />
          ) : (
            <Upload className="me-2" />
          )}
          {loading ? "Caricamento..." : label}
        </Form.Label>
        
        <Form.Control
          id={uploaderId}
          type="file"
          className="d-none"
          onChange={handleFileChange}
          accept="image/*"
          disabled={loading}
          multiple={multiple}
        />
      </Form.Group>

      {/* Barra di progresso */}
      {progress > 0 && (
        <ProgressBar
          animated={progress < 100}
          now={progress}
          variant={progress === 100 ? "success" : "primary"}
          className="mt-2 shadow-sm"
          style={{ height: "6px", borderRadius: "10px" }}
        />
      )}

      {error && (
        <Alert variant="danger" className="mt-2 small py-1 shadow-sm" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </div>
  );
}

export default UniversalUploader;