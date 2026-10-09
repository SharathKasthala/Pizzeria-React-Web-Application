import CartProvider from "./CartProvider";
import { useAuth } from "./AuthContext";
import { cartKeyFor } from "../utils/storage";

// Gives each user (or the guest) their own cart
function CartScope({ children }) {
  const { user } = useAuth();
  const storageKey = cartKeyFor(user);

  return (
    <CartProvider key={storageKey} storageKey={storageKey}>
      {children}
    </CartProvider>
  );
}

export default CartScope;
