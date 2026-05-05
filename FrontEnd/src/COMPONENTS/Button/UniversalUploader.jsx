import { useState } from "react";
import { Form, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";

function UniversalUploader({
  endpoint,
  fieldName,
  onUploadSuccess,
  method = "PATCH",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(10); // Feedback iniziale

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(endpoint, {
        method: method, // <--- Usa la prop method qui!
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(100);
        setTimeout(() => {
          onUploadSuccess(data);
          setProgress(0);
          setLoading(false);
        }, 800);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Errore durante il caricamento");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="universal-uploader">
      <Form.Group>
        <Form.Label className="btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm d-inline-flex align-items-center cursor-pointer">
          {loading ? (
            <Spinner size="sm" animation="border" className="me-2" />
          ) : (
            <Upload className="me-2" />
          )}
          {loading ? "Caricamento..." : "Cambia Immagine"}
          <Form.Control
            type="file"
            className="d-none"
            onChange={handleFileChange}
            accept="image/*"
            disabled={loading}
          />
        </Form.Label>
      </Form.Group>

      {progress > 0 && progress < 100 && (
        <ProgressBar
          animated
          now={progress}
          size="sm"
          className="mt-2"
          style={{ height: "4px" }}
        />
      )}

      {error && (
        <Alert variant="danger" className="mt-2 small py-1">
          {error}
        </Alert>
      )}
    </div>
  );
}

export default UniversalUploader;
