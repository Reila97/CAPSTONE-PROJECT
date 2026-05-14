import React from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { StarFill, PersonCircle, Calendar3, ChatQuote } from "react-bootstrap-icons";
import "./ReviewList.css";

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-5 border rounded-4 bg-light">
        <ChatQuote size={40} className="text-muted mb-3" />
        <p className="text-muted">Ancora nessuna recensione. Sii il primo a scriverne una!</p>
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
          <Card className="stat-card p-4 text-center h-100 shadow-sm">
            <h5 className="text-uppercase small fw-bold text-muted mb-3">Valutazione Media</h5>
            <div className="display-3 fw-bold text-dark">{averageRating}</div>
            <div className="d-flex justify-content-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarFill key={i} className={i < Math.round(averageRating) ? "text-warning" : "text-light"} size={20} />
              ))}
            </div>
            <p className="text-muted small">Basato su {totalReviews} recensioni</p>
          </Card>
        </Col>

        {/* Distribuzione Stelle */}
        <Col lg={8}>
          <div className="px-lg-4">
            {distribution.map((item) => (
              <div key={item.star} className="rating-bar-container">
                <span style={{ width: "60px" }}>{item.star} stelle</span>
                <ProgressBar 
                  now={(item.count / totalReviews) * 100} 
                  variant="warning" 
                />
                <span className="text-muted" style={{ width: "30px" }}>{item.count}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Lista Recensioni Effettive */}
      <Card className="border-0">
        <Card.Body className="p-0">
          {reviews.map((rev) => (
            <div key={rev._id} className="review-item">
              <Row>
                <Col xs={12} md={3} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center gap-3">
                    {rev.user?.avatar ? (
                      <img src={rev.user.avatar} alt="User" className="avatar-circle" style={{objectFit: 'cover'}}/>
                    ) : (
                      <div className="avatar-circle">
                        {rev.user?.nome?.charAt(0) || <PersonCircle />}
                      </div>
                    )}
                    <div>
                      <h6 className="mb-0 fw-bold">{rev.user?.nome || "Utente Ospite"}</h6>
                      <div className="review-date d-flex align-items-center gap-1">
                        <Calendar3 size={12} />
                        {new Date(rev.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={9}>
                  <div className="d-flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarFill key={i} size={14} className={i < rev.voto ? "text-warning" : "text-light"} />
                    ))}
                  </div>
                  <p className="text-dark bodyCopy mb-2" style={{ fontStyle: 'italic' }}>
                    "{rev.commento}"
                  </p>
                  {rev.camera && (
                    <Badge bg="light" text="dark" className="border fw-normal">
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