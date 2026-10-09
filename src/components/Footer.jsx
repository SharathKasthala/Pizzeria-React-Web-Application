import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <div className="site-brand mb-2">
              <img src={logo} alt="" width="40" height="32" />
              <span>Pizzeria</span>
            </div>
            <p className="site-footer__muted mb-0">Hand-stretched pizzas, delivered in 45 minutes.</p>
          </div>
          <nav className="col-md-6" aria-label="Footer">
            <ul className="site-footer__links">
              <li><NavLink to="/order">Menu</NavLink></li>
              <li><NavLink to="/build">Build your own</NavLink></li>
              <li><NavLink to="/orders">My orders</NavLink></li>
              <li><NavLink to="/cart">Cart</NavLink></li>
            </ul>
          </nav>
        </div>
        <hr />
        <small className="site-footer__muted">© {new Date().getFullYear()} Pizzeria. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;
