import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { StarFill, ChatLeftDots, Send } from "react-bootstrap-icons";
import "./ReviewForm.css";
import { useAuth } from "../../../CONTEXT/IsAdmin";

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
    <Card className="vf-review-card shadow-sm mb-5">
      <div className="vf-review-header-accent"></div>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="vf-icon-container p-2 rounded-3">
            <ChatLeftDots size={22} />
          </div>
          <h4 className="mb-0 vf-review-title">La tua opinione</h4>
        </div>

        {status.msg && (
          <Alert variant={status.type} className="mb-4 vf-review-alert">
            {status.msg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <p className="small text-muted text-uppercase fw-bold mb-3" style={{ letterSpacing: '0.5px' }}>
              Valutazione soggiorno
            </p>
            <div className="vf-star-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="vf-star-wrapper"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <StarFill
                    size={32}
                    className={`vf-star-icon ${(hover || rating) >= star ? "active" : "inactive"}`}
                  />
                </div>
              ))}
            </div>
            {rating > 0 && (
              <Badge className="mt-3 shadow-sm px-3 py-2 vf-rating-badge">
                {rating} / 5 stelle
              </Badge>
            )}
          </div>

          <Form.Group className="mb-4">
            <Form.Control
              as="textarea"
              placeholder="Raccontaci la tua esperienza qui..."
              className="vf-custom-textarea"
              style={{ height: "140px" }}
              value={commento}
              onChange={(e) => setCommento(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            disabled={loading}
            className="vf-submit-review-btn w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <Send size={16} /> PUBBLICA ORA
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
