import { useSearchParams } from "react-router-dom";
import pizzas from "../assets/data/pizzas.json";
import PizzaCard from "../components/PizzaCard";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "veg", label: "Veg" },
  { value: "nonveg", label: "Non-veg" },
];

const SORTS = {
  popular: { label: "Popular", fn: () => 0 },
  low: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  high: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
};

function OrderPizza() {
  // Filters live in the URL, so they survive refresh and can be shared
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || "all";
  const query = params.get("q") || "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "popular";

  const update = (key, value, fallback) => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const q = query.trim().toLowerCase();
  const results = pizzas
    .filter((p) => type === "all" || p.type === type)
    .filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.topping.some((t) => t.toLowerCase().includes(q))
    )
    .sort(SORTS[sort].fn);

  return (
    <div className="container py-5">
      <header className="page-head">
        <h1>Menu</h1>
        <p>Add a pizza as it comes, or customize it with extra toppings.</p>
      </header>

      {/* Filter bar */}
      <div className="menu-toolbar" role="search">
        <div className="menu-toolbar__search">
          <i className="bi bi-search" aria-hidden="true"></i>
          <input
            type="search"
            className="form-control"
            placeholder="Search pizzas or toppings"
            aria-label="Search pizzas or toppings"
            value={query}
            onChange={(e) => update("q", e.target.value, "")}
          />
        </div>

        <div className="segmented" role="radiogroup" aria-label="Filter by type">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={type === f.value}
              className={`segmented__option ${type === f.value ? "is-active" : ""}`}
              onClick={() => update("type", f.value, "all")}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          className="form-select menu-toolbar__sort"
          aria-label="Sort pizzas"
          value={sort}
          onChange={(e) => update("sort", e.target.value, "popular")}
        >
          {Object.entries(SORTS).map(([value, s]) => (
            <option key={value} value={value}>{s.label}</option>
          ))}
        </select>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p className="mb-3">
            {query ? `No pizzas match “${query}”.` : "No pizzas in this category yet."} Try another search or clear the filters.
          </p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {results.map((pizza) => (
            <div className="col-12 col-sm-6 col-lg-4" key={pizza.id}>
              <PizzaCard pizza={pizza} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPizza;
