import { useCallback, useEffect, useReducer, useState } from "react";
import { CartContext } from "./CartContext";
import { cartReducer, lineIdFor, normalizeCart, unitPrice } from "./cartReducer";
import { readJSON, writeJSON } from "../utils/storage";

// storageKey is the guest cart or the logged-in user's cart.
// CartScope re-mounts the provider whenever the user changes.
function CartProvider({ storageKey, children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, storageKey, (key) =>
    normalizeCart(readJSON(key, []))
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Saving the cart whenever it changes
  useEffect(() => {
    writeJSON(storageKey, cartItems);
  }, [cartItems, storageKey]);

  // stable functions so effects that use them don't re-run
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addToCart = (pizza) =>
    dispatch({ type: "add", item: { ...pizza, isCustomized: false, selectedToppings: [], extraPrice: 0 } });

  const addCustomizedPizza = (pizza) => dispatch({ type: "add", item: { ...pizza, isCustomized: true } });

  const value = {
    cartItems,
    cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => total + unitPrice(item) * item.quantity, 0),
    addToCart,
    addCustomizedPizza,
    addManyToCart: (items) => dispatch({ type: "addMany", items }),
    increaseQuantity: (lineId) => dispatch({ type: "increment", lineId }),
    decreaseQuantity: (lineId) => dispatch({ type: "decrement", lineId }),
    deletePizza: (lineId) => dispatch({ type: "remove", lineId }),
    clearCart: () => dispatch({ type: "clear" }),
    // quantity of the plain (not customized) version of a pizza
    quantityOf: (pizzaId) =>
      cartItems.find((i) => i.lineId === lineIdFor({ id: pizzaId, isCustomized: false }))?.quantity || 0,
    drawerOpen,
    openDrawer,
    closeDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
