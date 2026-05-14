import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  FloatingLabel,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { StarFill, ChatLeftDots, Send } from "react-bootstrap-icons";
import "./ReviewForm.css";
import { useAuth } from "../../CONTEXT/IsAdmin";


const API_URL = import.meta.env.VITE_BACK_END;

export default function ReviewForm({ strutturaId, cameraId, onReviewAdded }) {
    const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commento, setCommento] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return setStatus({ type: "danger", msg: "Devi essere loggato per recensire!" });
    }

    if (rating === 0)
      return setStatus({ type: "danger", msg: "Seleziona almeno una stella!" });

    setLoading(true);
    setStatus({ type: "", msg: "" });
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/recensioni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: user._id,
          struttura: strutturaId,
          camera: cameraId,
          voto: rating,
          commento: commento,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nell'invio");

      setStatus({
        type: "success",
        msg: "Grazie! La tua recensione è stata pubblicata.",
      });
      setCommento("");
      setRating(0);
      if (onReviewAdded) onReviewAdded(data);
    } catch (err) {
      setStatus({ type: "danger", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="review-card shadow-sm mb-5">
      <div className="review-header-accent"></div>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-primary bg-opacity-10 p-2 rounded-3">
            <ChatLeftDots className="text-primary" size={24} />
          </div>
          <h4 className="fw-bold mb-0">La tua opinione</h4>
        </div>

        {status.msg && (
          <Alert variant={status.type} className="animate-success mb-4">
            {status.msg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <p className="small text-muted text-uppercase fw-bold mb-2">
              Valutazione soggiorno
            </p>
            <div className="star-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="star-wrapper"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <StarFill
                    size={35}
                    className={`star-icon ${(hover || rating) >= star ? "active" : "inactive"}`}
                  />
                </div>
              ))}
            </div>
            {rating > 0 && (
              <Badge bg="dark" className="mt-3 shadow-sm px-3 py-2">
                {rating} / 5 stelle
              </Badge>
            )}
          </div>

          <FloatingLabel className="mb-4">
            <Form.Control
              as="textarea"
              placeholder="Commento"
              className="custom-textarea"
              style={{ height: "140px" }}
              value={commento}
              onChange={(e) => setCommento(e.target.value)}
              required
            />
          </FloatingLabel>

          <Button
            type="submit"
            disabled={loading}
            className="prenotaButton w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Send size={18} /> PUBBLICA ORA
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
