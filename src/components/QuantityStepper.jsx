// − 1 + control. Going below 1 removes the item.
function QuantityStepper({ quantity, onIncrease, onDecrease, label = "item", size = "md" }) {
  return (
    <div className={`qty-stepper qty-stepper--${size}`} role="group" aria-label={`Quantity of ${label}`}>
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={onDecrease}
        aria-label={quantity === 1 ? `Remove ${label}` : `Decrease ${label}`}
      >
        <i className={`bi ${quantity === 1 ? "bi-trash3" : "bi-dash-lg"}`} aria-hidden="true"></i>
      </button>
      <span className="qty-stepper__value" aria-live="polite">{quantity}</span>
      <button type="button" className="qty-stepper__btn" onClick={onIncrease} aria-label={`Increase ${label}`}>
        <i className="bi bi-plus-lg" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default QuantityStepper;
