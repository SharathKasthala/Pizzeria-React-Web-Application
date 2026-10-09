import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

// Mobile-only cart button; hidden where the page has its own bottom bar
const HIDDEN_ON = ["/cart", "/build"];

function FloatingCartButton() {
  const { cartCount, cartTotal, openDrawer, drawerOpen } = useCart();
  const { pathname } = useLocation();

  if (cartCount === 0 || drawerOpen || HIDDEN_ON.includes(pathname)) return null;

  return (
    <button type="button" className="fab-cart d-lg-none" onClick={openDrawer}>
      <i className="bi bi-bag-fill" aria-hidden="true"></i>
      <span>View cart ({cartCount})</span>
      <strong>{formatPrice(cartTotal)}</strong>
    </button>
  );
}

export default FloatingCartButton;
