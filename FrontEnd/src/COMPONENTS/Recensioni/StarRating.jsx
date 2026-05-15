import React from "react";
import { StarFill, Star } from "react-bootstrap-icons";
import "./StarRating.css";

function StarRating({ rating, setRating, editable = false }) {
  return (
    <div className="d-flex gap-1 vf-star-rating-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`vf-star-item ${editable ? "editable" : ""}`}
          style={{ cursor: editable ? "pointer" : "default" }}
          onClick={() => editable && setRating(star)}
        >
          {star <= rating ? (
            <StarFill className="vf-star-icon-active" size={20} />
          ) : (
            <Star className="vf-star-icon-inactive" size={20} />
          )}
        </span>
      ))}
    </div>
  );
}

export default StarRating;