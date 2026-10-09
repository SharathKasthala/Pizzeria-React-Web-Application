import { useState } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import pizzas from "../assets/data/pizzas.json";
import toppings from "../assets/data/ingredients.json";
import { useCart } from "../context/CartContext";
import PizzaArt from "../components/PizzaArt";
import SafeImage from "../components/SafeImage";
import VegMark from "../components/VegMark";
import { formatPrice } from "../utils/format";

function BuildPizza() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { addCustomizedPizza, openDrawer } = useCart();
  const [selectedIds, setSelectedIds] = useState([]);

  // The base pizza comes from ?pizza=ID (survives refresh); older links pass it in state
  const selectedPizza = pizzas.find((p) => p.id === params.get("pizza")) || location.state?.pizza || null;

  const chooseBase = (id) => {
    setSelectedIds([]);
    setParams({ pizza: id });
  };

  const toggleTopping = (id) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const chosen = toppings.filter((t) => selectedIds.includes(t.id));
  const extraPrice = chosen.reduce((total, t) => total + Number(t.price), 0);
  const totalPrice = selectedPizza ? Number(selectedPizza.price) + extraPrice : 0;

  const handleAdd = () => {
    addCustomizedPizza({
      ...selectedPizza,
      quantity: 1,
      selectedToppings: chosen,
      extraPrice,
    });
    toast.success(`Custom ${selectedPizza.name} added to cart`);
    setSelectedIds([]);
    openDrawer();
  };

  // Step 1: no base chosen yet → pick one here instead of a dead end
  if (!selectedPizza) {
    return (
      <div className="container py-5">
        <header className="page-head">
          <h1>Build your own</h1>
          <p>Start with a base pizza, then add as many extra toppings as you like.</p>
        </header>

        <div className="row g-3">
          {pizzas.map((p) => (
            <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
              <button type="button" className="base-option" onClick={() => chooseBase(p.id)}>
                <SafeImage
                  src={p.image}
                  alt=""
                  className="base-option__img"
                  fallback={<PizzaArt toppings={p.topping} size={64} className="base-option__img" />}
                />
                <span className="flex-grow-1 text-start">
                  <span className="d-flex align-items-center gap-2 fw-semibold">
                    <VegMark type={p.type} size={14} /> {p.name}
                  </span>
                  <span className="text-body-secondary">{formatPrice(p.price)}</span>
                </span>
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 build-page">
      <header className="page-head page-head--row">
        <div>
          <h1>Build your own</h1>
          <p className="d-flex align-items-center gap-2 mb-0">
            <VegMark type={selectedPizza.type} size={16} />
            Base: <strong>{selectedPizza.name}</strong> ({formatPrice(selectedPizza.price)})
          </p>
        </div>
        <NavLink to="/build" className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedIds([])}>
          Change base
        </NavLink>
      </header>

      <div className="row g-4 g-xl-5">
        {/* Left: toppings */}
        <div className="col-lg-7">
          <h2 className="h4 mb-3">
            Extra toppings <span className="text-body-secondary fw-normal fs-6">({chosen.length} selected)</span>
          </h2>

          <div className="topping-grid">
            {toppings.map((t) => {
              const checked = selectedIds.includes(t.id);
              return (
                <label key={t.id} className={`topping-tile ${checked ? "is-checked" : ""}`}>
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    onChange={() => toggleTopping(t.id)}
                  />
                  <SafeImage
                    src={t.image}
                    alt=""
                    className="topping-tile__img"
                    fallback={<span className="topping-tile__img topping-tile__img--empty"><i className="bi bi-egg-fried"></i></span>}
                  />
                  <span className="topping-tile__name">{t.tname}</span>
                  <span className="topping-tile__price">+{formatPrice(t.price)}</span>
                  <i className={`bi ${checked ? "bi-check-circle-fill" : "bi-plus-circle"} topping-tile__check`} aria-hidden="true"></i>
                </label>
              );
            })}
          </div>
        </div>

        {/* Right: live preview + summary (sticky on desktop, shown first on mobile) */}
        <div className="col-lg-5 order-first order-lg-last">
          <aside className="summary-card build-summary">
            <div className="build-preview">
              <PizzaArt
                toppings={[...selectedPizza.topping, ...chosen.map((t) => t.tname)]}
                size={220}
                title={`Preview of ${selectedPizza.name} with ${chosen.length} extra toppings`}
              />
            </div>
            <h2 className="h5 mb-3 mt-3">Your pizza</h2>
            <div className="summary-row">
              <span>{selectedPizza.name}</span>
              <span>{formatPrice(selectedPizza.price)}</span>
            </div>
            {chosen.length === 0 ? (
              <p className="text-body-secondary small my-2">No extra toppings yet. Tap a topping to add it.</p>
            ) : (
              <ul className="list-unstyled my-2">
                {chosen.map((t) => (
                  <li key={t.id} className="summary-row summary-row--sub">
                    <span>+ {t.tname}</span>
                    <span>{formatPrice(t.price)}</span>
                  </li>
                ))}
              </ul>
            )}
            <hr />
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button type="button" className="btn btn-primary btn-lg w-100 mt-3 d-none d-lg-block" onClick={handleAdd}>
              Add to cart for {formatPrice(totalPrice)}
            </button>
          </aside>
        </div>
      </div>

      {/* Mobile: sticky bottom bar with the live price */}
      <div className="sticky-action d-lg-none">
        <div>
          <small className="d-block text-body-secondary">{chosen.length} extra toppings</small>
          <strong className="fs-5">{formatPrice(totalPrice)}</strong>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAdd}>
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default BuildPizza;
