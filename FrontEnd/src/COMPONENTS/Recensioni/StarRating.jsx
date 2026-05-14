import { StarFill, Star } from "react-bootstrap-icons";

function StarRating ({ rating, setRating, editable = false }) {
  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: editable ? "pointer" : "default" }}
          onClick={() => editable && setRating(star)}
        >
          {star <= rating ? (
            <StarFill className="text-warning" size={20} />
          ) : (
            <Star className="text-muted" size={20} />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating