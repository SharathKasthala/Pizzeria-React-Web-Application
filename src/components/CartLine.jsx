import SafeImage from "./SafeImage";
import PizzaArt from "./PizzaArt";
import VegMark from "./VegMark";
import QuantityStepper from "./QuantityStepper";
import { useCart } from "../context/CartContext";
import { unitPrice } from "../context/cartReducer";
import { formatPrice } from "../utils/format";

// One item row, used in the drawer and on the cart page
function CartLine({ item, compact = false }) {
  const { increaseQuantity, decreaseQuantity, deletePizza } = useCart();
  const toppings = item.selectedToppings || [];

  return (
    <li className={`cart-line ${compact ? "cart-line--compact" : ""}`}>
      <SafeImage
        src={item.image}
        alt=""
        className="cart-line__img"
        fallback={<PizzaArt toppings={item.topping || []} size={compact ? 56 : 72} className="cart-line__img" />}
      />

      <div className="cart-line__body">
        <div className="d-flex align-items-start gap-2">
          <VegMark type={item.type} size={14} className="mt-1" />
          <h3 className="cart-line__name">{item.name}</h3>
        </div>

        {item.isCustomized && (
          <p className="cart-line__meta">
            {toppings.length
              ? `+ ${toppings.map((t) => t.tname).join(", ")}`
              : "Customized, no extra toppings"}
          </p>
        )}
        <p className="cart-line__meta">{formatPrice(unitPrice(item))} each</p>

        <div className="d-flex align-items-center justify-content-between gap-2 mt-2">
          <QuantityStepper
            size="sm"
            label={item.name}
            quantity={item.quantity}
            onIncrease={() => increaseQuantity(item.lineId)}
            onDecrease={() => decreaseQuantity(item.lineId)}
          />
          <strong className="cart-line__price">{formatPrice(unitPrice(item) * item.quantity)}</strong>
        </div>
      </div>

      {!compact && (
        <button
          type="button"
          className="btn btn-icon btn-icon--quiet align-self-start"
          onClick={() => deletePizza(item.lineId)}
          aria-label={`Remove ${item.name}`}
        >
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      )}
    </li>
  );
}

export default CartLine;
