import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { unitPrice } from "../context/cartReducer";
import StarRating from "../components/StarRating";
import { findOrder, saveFeedback } from "../utils/orders";
import { formatPrice } from "../utils/format";

// Reads the order from storage by its id, so this page survives a refresh
function OrderSuccess() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order] = useState(() => findOrder(orderId, user.email));

  const [rating, setRating] = useState(order?.feedback?.rating || 0);
  const [comment, setComment] = useState(order?.feedback?.comment || "");
  const [submitted, setSubmitted] = useState(!!order?.feedback);

  if (!order) {
    return (
      <div className="container py-5">
        <div className="empty-state empty-state--card">
          <h1 className="h3">Order not found</h1>
          <p className="mb-4">This order doesn't exist or belongs to a different account.</p>
          <NavLink to="/orders" className="btn btn-primary">See my orders</NavLink>
        </div>
      </div>
    );
  }

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warning("Choose a star rating first.");
      return;
    }
    const now = new Date();
    saveFeedback(order.orderId, user.email, {
      rating,
      comment: comment.trim(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    });
    setSubmitted(true);
    toast.success("Feedback sent. Thank you!");
  };

  return (
    <div className="container py-5">
      <div className="receipt">
        <div className="receipt__head">
          <span className="receipt__check" aria-hidden="true"><i className="bi bi-check-lg"></i></span>
          <h1 className="h2 mb-1">Order placed</h1>
          <p className="mb-0">Your pizza will be at your door within 45 minutes.</p>
        </div>

        <dl className="receipt__meta">
          <div><dt>Order</dt><dd>#{order.orderId}</dd></div>
          <div><dt>Status</dt><dd><span className="badge text-bg-success">{order.status}</span></dd></div>
          {order.delivery?.payment && (
            <div><dt>Payment</dt><dd>{order.delivery.payment === "upi" ? "UPI on delivery" : "Cash on delivery"}</dd></div>
          )}
        </dl>

        <ul className="list-unstyled mb-0">
          {order.items.map((item) => (
            <li key={item.lineId || item.id} className="summary-row">
              <span>
                {item.name}
                {item.quantity > 1 && <span className="text-body-secondary"> ×{item.quantity}</span>}
                {item.isCustomized && item.selectedToppings?.length > 0 && (
                  <small className="d-block text-body-secondary">
                    + {item.selectedToppings.map((t) => t.tname).join(", ")}
                  </small>
                )}
              </span>
              <span>{formatPrice(unitPrice(item) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <hr />
        <div className="summary-row summary-row--total">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>

        {order.delivery?.address && (
          <p className="receipt__address">
            <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>
            {order.delivery.address}
          </p>
        )}

        <div className="d-flex gap-2 flex-wrap mt-4">
          <NavLink to="/order" className="btn btn-primary flex-grow-1">Order again</NavLink>
          <NavLink to="/orders" className="btn btn-outline-secondary flex-grow-1">My orders</NavLink>
        </div>

        {/* Feedback */}
        <form className="receipt__feedback" onSubmit={handleSubmitFeedback}>
          <h2 className="h5">How was your order?</h2>
          <StarRating value={rating} onChange={setRating} disabled={submitted} />
          <label htmlFor="comment" className="visually-hidden">Comments</label>
          <textarea
            id="comment"
            className="form-control my-3"
            rows="3"
            placeholder="Tell us what you liked or what we can do better (optional)"
            value={comment}
            disabled={submitted}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary w-100" disabled={submitted}>
            {submitted ? (
              <><i className="bi bi-check-lg me-2" aria-hidden="true"></i>Feedback sent</>
            ) : (
              "Send feedback"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderSuccess;
