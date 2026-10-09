import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartLine from "../components/CartLine";
import { readJSON, writeJSON } from "../utils/storage";
import { formatPrice } from "../utils/format";
import { unitPrice } from "../context/cartReducer";

const STEPS = ["Cart", "Delivery", "Confirmed"];
const PAYMENT_OPTIONS = [
  { value: "cod", label: "Cash on delivery", icon: "bi-cash-coin" },
  { value: "upi", label: "UPI on delivery", icon: "bi-qr-code" },
];

function Steps({ current }) {
  return (
    <ol className="checkout-steps" aria-label="Checkout progress">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={i < current ? "is-done" : i === current ? "is-current" : ""}
          aria-current={i === current ? "step" : undefined}
        >
          <span className="checkout-steps__dot">{i < current ? <i className="bi bi-check-lg"></i> : i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function Cart() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    notes: "",
    payment: "cod",
  });

  const goToDelivery = () => {
    if (!user) {
      toast.info("Log in to continue to delivery");
      navigate("/auth", { state: { from: "/cart" } });
      return;
    }
    setStep(1);
  };

  const handleChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!details.name.trim()) next.name = "Enter the name for the delivery.";
    if (!/^[0-9]{10}$/.test(details.phone.trim())) next.phone = "Enter a 10-digit phone number.";
    if (details.address.trim().length < 10) next.address = "Enter the full delivery address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);

    const now = new Date();
    const order = {
      orderId: now.getTime(),
      userEmail: user.email,
      items: cartItems,
      totalAmount: cartTotal,
      createdAt: now.toISOString(),
      orderDate: now.toLocaleDateString(),
      orderTime: now.toLocaleTimeString(),
      status: "Placed",
      delivery: { ...details, name: details.name.trim(), phone: details.phone.trim(), address: details.address.trim() },
    };

    // Short pause so the button's loading state is visible
    setTimeout(() => {
      writeJSON("orders", [...readJSON("orders", []), order]);
      clearCart();
      toast.success("Order placed");
      navigate(`/success/${order.orderId}`, { replace: true });
    }, 600);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="empty-state empty-state--card">
          <i className="bi bi-bag display-4 text-body-tertiary" aria-hidden="true"></i>
          <h1 className="h3 mt-3">Your cart is empty</h1>
          <p className="mb-4">Add a pizza from the menu, or build your own with extra toppings.</p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <NavLink to="/order" className="btn btn-primary">Browse the menu</NavLink>
            <NavLink to="/build" className="btn btn-outline-secondary">Build your own</NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 cart-page">
      <header className="page-head">
        <h1>Checkout</h1>
        <Steps current={step} />
      </header>

      <div className="row g-4 g-xl-5">
        <div className="col-lg-7">
          {step === 0 ? (
            <section className="panel">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 mb-0">{cartCount} items</h2>
                <button type="button" className="btn btn-link btn-sm text-danger" onClick={clearCart}>
                  Clear cart
                </button>
              </div>
              <ul className="list-unstyled mb-0">
                {cartItems.map((item) => (
                  <CartLine key={item.lineId} item={item} />
                ))}
              </ul>
            </section>
          ) : (
            <form id="delivery-form" className="panel" onSubmit={handlePlaceOrder} noValidate>
              <h2 className="h5 mb-3">Delivery details</h2>

              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="d-name" className="form-label">Name</label>
                  <input id="d-name" name="name" className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={details.name} onChange={handleChange} autoComplete="name" />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="d-phone" className="form-label">Phone</label>
                  <input id="d-phone" name="phone" type="tel" inputMode="numeric" maxLength={10}
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    value={details.phone} onChange={handleChange} autoComplete="tel" />
                  <div className="invalid-feedback">{errors.phone}</div>
                </div>
                <div className="col-12">
                  <label htmlFor="d-address" className="form-label">Address</label>
                  <textarea id="d-address" name="address" rows="3"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    placeholder="House / flat, street, area, city"
                    value={details.address} onChange={handleChange} autoComplete="street-address" />
                  <div className="invalid-feedback">{errors.address}</div>
                </div>
                <div className="col-12">
                  <label htmlFor="d-notes" className="form-label">
                    Delivery notes <span className="text-body-secondary">(optional)</span>
                  </label>
                  <input id="d-notes" name="notes" className="form-control"
                    placeholder="e.g. Ring the bell, gate code 1234" value={details.notes} onChange={handleChange} />
                </div>
              </div>

              <fieldset className="mt-4">
                <legend className="form-label fs-6">Payment</legend>
                <div className="pay-options">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label key={opt.value} className={`pay-option ${details.payment === opt.value ? "is-checked" : ""}`}>
                      <input type="radio" name="payment" value={opt.value} className="visually-hidden"
                        checked={details.payment === opt.value} onChange={handleChange} />
                      <i className={`bi ${opt.icon}`} aria-hidden="true"></i>
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="button" className="btn btn-link px-0 mt-3" onClick={() => setStep(0)}>
                <i className="bi bi-arrow-left me-2" aria-hidden="true"></i>
                Back to cart
              </button>
            </form>
          )}
        </div>

        {/* Order summary (sticky on desktop) */}
        <div className="col-lg-5">
          <aside className="summary-card">
            <h2 className="h5 mb-3">Order summary</h2>
            <ul className="list-unstyled mb-0">
              {cartItems.map((item) => (
                <li key={item.lineId} className="summary-row">
                  <span>
                    {item.name}
                    {item.quantity > 1 && <span className="text-body-secondary"> ×{item.quantity}</span>}
                    {item.isCustomized && <small className="d-block text-body-secondary">Customized</small>}
                  </span>
                  <span>{formatPrice(unitPrice(item) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <hr />
            <div className="summary-row">
              <span>Delivery</span>
              <span className="text-success fw-semibold">Free</span>
            </div>
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            {step === 0 ? (
              <button type="button" className="btn btn-primary btn-lg w-100 mt-3" onClick={goToDelivery}>
                Continue to delivery
              </button>
            ) : (
              <button type="submit" form="delivery-form" className="btn btn-primary btn-lg w-100 mt-3" disabled={placing}>
                {placing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Placing order…
                  </>
                ) : (
                  `Place order for ${formatPrice(cartTotal)}`
                )}
              </button>
            )}
            <NavLink to="/order" className="btn btn-link w-100 mt-1">Keep browsing</NavLink>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
