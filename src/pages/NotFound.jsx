import { NavLink } from "react-router-dom";
import PizzaArt from "../components/PizzaArt";

function NotFound() {
  return (
    <div className="container py-5 text-center">
      <PizzaArt size={160} toppings={[]} title="A plain pizza with no toppings" />
      <h1 className="mt-4">Page not found</h1>
      <p className="text-body-secondary mb-4">The link may be old or mistyped. The menu is a good place to start.</p>
      <div className="d-flex gap-2 justify-content-center">
        <NavLink to="/order" className="btn btn-primary">Go to the menu</NavLink>
        <NavLink to="/" className="btn btn-outline-secondary">Home</NavLink>
      </div>
    </div>
  );
}

export default NotFound;
