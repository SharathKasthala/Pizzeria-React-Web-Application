const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// Keyboard-friendly star rating (radio buttons styled as stars)
function StarRating({ value, onChange, disabled = false }) {
  return (
    <div>
      <div className="star-rating" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className={star <= value ? "is-on" : ""}>
            <input
              type="radio"
              name="rating"
              className="visually-hidden"
              value={star}
              checked={value === star}
              disabled={disabled}
              onChange={() => onChange(star)}
            />
            <i className={`bi ${star <= value ? "bi-star-fill" : "bi-star"}`} aria-hidden="true"></i>
            <span className="visually-hidden">{star} star{star > 1 ? "s" : ""}</span>
          </label>
        ))}
      </div>
      {value > 0 && <p className="fw-semibold mt-2 mb-0">{LABELS[value]}</p>}
    </div>
  );
}

export default StarRating;
