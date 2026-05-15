import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";
import { StarFill, PersonCircle, Calendar3, ChatQuote } from "react-bootstrap-icons";
import "./ReviewList.css";

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-5 border rounded-4 vf-empty-reviews">
        <ChatQuote size={40} className="vf-text-brand-muted mb-3" />
        <p className="vf-text-brand-muted mb-0">Ancora nessuna recensione. Sii il primo a scriverne una!</p>
      </div>
    );
  }

  // Calcolo Statistiche
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((acc, rev) => acc + rev.voto, 0) / totalReviews).toFixed(1);
  
  // Conteggio voti per stella (per le barre)
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.floor(r.voto) === star).length
  }));

  return (
    <div className="reviews-container">
      <Row className="mb-5 gy-4">
        {/* Riepilogo Statistico */}
        <Col lg={4}>
          <Card className="vf-stat-card p-4 text-center h-100 shadow-sm">
            <h5 className="text-uppercase small fw-bold vf-text-brand-muted mb-3" style={{ letterSpacing: '0.5px' }}>Valutazione Media</h5>
            <div className="display-3 fw-bold vf-stat-number mb-1">{averageRating}</div>
            <div className="d-flex justify-content-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarFill 
                  key={i} 
                  className={i < Math.round(averageRating) ? "vf-star-active" : "vf-star-inactive"} 
                  size={18} 
                />
              ))}
            </div>
            <p className="vf-text-brand-muted small mb-0">Basato su {totalReviews} recensioni</p>
          </Card>
        </Col>

        {/* Distribuzione Stelle */}
        <Col lg={8}>
          <div className="px-lg-4 d-flex flex-column justify-content-center h-100">
            {distribution.map((item) => (
              <div key={item.star} className="rating-bar-container">
                <span style={{ width: "65px", fontWeight: "500" }}>{item.star} stelle</span>
                <ProgressBar 
                  now={(item.count / totalReviews) * 100} 
                  className="vf-progress-bar-wrapper"
                  label=""
                  // Utilizzo della classe personalizzata tramite l'override del background o della proprietà standard
                  style={{"--bs-progress-bar-bg": "#F28B2D"}} 
                />
                <span className="vf-text-brand-muted text-end" style={{ width: "30px", fontWeight: "500" }}>{item.count}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Lista Recensioni Effettive */}
      <Card className="border-0 bg-transparent">
        <Card.Body className="p-0">
          {reviews.map((rev) => (
            <div key={rev._id} className="vf-review-item">
              <Row>
                <Col xs={12} md={3} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center gap-3">
                    {rev.user?.avatar ? (
                      <img src={rev.user.avatar} alt="User" className="vf-avatar-circle" style={{objectFit: 'cover'}}/>
                    ) : (
                      <div className="vf-avatar-circle">
                        {rev.user?.nome?.charAt(0) || <PersonCircle size={20} />}
                      </div>
                    )}
                    <div>
                      <h6 className="mb-0 vf-review-user-name">{rev.user?.nome || "Utente Ospite"}</h6>
                      <div className="vf-review-date d-flex align-items-center gap-1 mt-1">
                        <Calendar3 size={11} />
                        {new Date(rev.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={9}>
                  <div className="d-flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarFill key={i} size={13} className={i < rev.voto ? "vf-star-active" : "vf-star-inactive"} />
                    ))}
                  </div>
                  <p className="vf-review-comment mb-3.5">
                    "{rev.commento}"
                  </p>
                  {rev.camera && (
                    <Badge className="vf-camera-badge">
                      Soggiornato in: {rev.camera.nome}
                    </Badge>
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewList;