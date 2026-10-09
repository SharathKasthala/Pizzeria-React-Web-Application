import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import SafeImage from "./SafeImage";
import PizzaArt from "./PizzaArt";
import VegMark from "./VegMark";
import QuantityStepper from "./QuantityStepper";
import { formatPrice } from "../utils/format";

function PizzaCard({ pizza }) {
  const { addToCart, quantityOf, increaseQuantity, decreaseQuantity } = useCart();
  const quantity = quantityOf(pizza.id);
  const lineId = `p-${pizza.id}`;

  const handleAdd = () => {
    addToCart(pizza);
    toast.success(`${pizza.name} added to cart`);
  };

  return (
    <article className="pizza-card">
      <div className="pizza-card__media">
        <SafeImage
          src={pizza.image}
          alt={pizza.name}
          className="pizza-card__img"
          fallback={<div className="pizza-card__art"><PizzaArt toppings={pizza.topping} size={170} title={pizza.name} /></div>}
        />
        <span className="pizza-card__type">
          <VegMark type={pizza.type} size={14} />
          {pizza.type === "veg" ? "Veg" : "Non-veg"}
        </span>
      </div>

      <div className="pizza-card__body">
        <div className="d-flex justify-content-between align-items-baseline gap-3">
          <h2 className="pizza-card__name">{pizza.name}</h2>
          <span className="pizza-card__price">{formatPrice(pizza.price)}</span>
        </div>

        <p className="pizza-card__desc">{pizza.description}</p>
        <p className="pizza-card__toppings">
          <span className="fw-semibold">Toppings:</span> {pizza.topping.map((t) => t.trim()).join(", ")}
        </p>

        <div className="pizza-card__actions">
          <NavLink to={`/build?pizza=${pizza.id}`} className="btn btn-outline-secondary">
            <i className="bi bi-sliders2 me-2" aria-hidden="true"></i>
            Customize
          </NavLink>

          {quantity === 0 ? (
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
              Add to cart
            </button>
          ) : (
            <QuantityStepper
              label={pizza.name}
              quantity={quantity}
              onIncrease={() => increaseQuantity(lineId)}
              onDecrease={() => decreaseQuantity(lineId)}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default PizzaCard;
