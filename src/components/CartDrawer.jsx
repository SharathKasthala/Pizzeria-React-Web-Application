import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartLine from "./CartLine";
import { formatPrice } from "../utils/format";

// Slide-out cart, available from every page
function CartDrawer() {
  const { cartItems, cartCount, cartTotal, drawerOpen, closeDrawer } = useCart();
  const navigate = useNavigate();
  const closeRef = useRef(null);

  // Escape closes, background doesn't scroll, focus moves into the drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  const go = (path) => {
    closeDrawer();
    navigate(path);
  };

  return (
    <>
      <div className={`drawer-backdrop ${drawerOpen ? "is-open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <aside
        className={`cart-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div className="cart-drawer__head">
          <h2 id="cart-drawer-title" className="h4 mb-0">
            Your cart <span className="text-body-secondary fw-normal fs-6">({cartCount})</span>
          </h2>
          <button ref={closeRef} type="button" className="btn btn-icon btn-icon--quiet" onClick={closeDrawer} aria-label="Close cart">
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-drawer__empty">
            <i className="bi bi-bag display-5 text-body-tertiary" aria-hidden="true"></i>
            <p className="mt-3 mb-4">Your cart is empty. Pick a pizza from the menu to get started.</p>
            <button type="button" className="btn btn-primary" onClick={() => go("/order")}>
              Browse the menu
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {cartItems.map((item) => (
                <CartLine key={item.lineId} item={item} compact />
              ))}
            </ul>
            <div className="cart-drawer__foot">
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <span>Total</span>
                <strong className="fs-4">{formatPrice(cartTotal)}</strong>
              </div>
              <button type="button" className="btn btn-primary btn-lg w-100" onClick={() => go("/cart")}>
                Go to checkout
              </button>
              <button type="button" className="btn btn-link w-100 mt-1" onClick={closeDrawer}>
                Keep browsing
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
