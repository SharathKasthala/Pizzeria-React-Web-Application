import { NavLink } from "react-router-dom";
import PizzaArt from "../PizzaArt";

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1 className="hero__title">Hot, hand-stretched pizza at your door in 45 minutes.</h1>
            <p className="hero__lead">
              Pick a favourite from the menu, or start from a base and pile on the toppings you want.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <NavLink to="/order" className="btn btn-primary btn-lg">Order now</NavLink>
              <NavLink to="/build" className="btn btn-outline-light btn-lg">Build your own</NavLink>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="hero__art">
              <PizzaArt
                spin
                size={420}
                toppings={["Pepperoni", "Mushroom", "Black olive", "Capsicum", "Sweet corn"]}
                title="Illustration of a pizza with pepperoni, mushroom, olives, capsicum and corn"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
