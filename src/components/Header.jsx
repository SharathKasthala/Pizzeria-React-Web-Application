import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import { formatPrice } from "../utils/format";

const navClass = ({ isActive }) => `nav-link site-nav__link ${isActive ? "active" : ""}`;

function Header() {
  const { cartCount, cartTotal, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <header className="site-header sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark" aria-label="Main">
        <div className="container">
          {/* Logo */}
          <NavLink to="/" className="navbar-brand site-brand" onClick={closeMenu}>
            <img src={logo} alt="" width="44" height="35" className="rounded-circle" />
            <span>Pizzeria</span>
          </NavLink>

          <div className="d-flex align-items-center gap-2 order-lg-last">
            {/* Light / dark toggle */}
            <button
              type="button"
              className="btn btn-icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} aria-hidden="true"></i>
            </button>

            {/* Cart opens the drawer */}
            <button type="button" className="btn btn-cheese cart-btn" onClick={openDrawer}>
              <i className="bi bi-bag" aria-hidden="true"></i>
              <span className="d-none d-sm-inline">Cart</span>
              <span key={cartCount} className="cart-btn__count" aria-label={`${cartCount} items`}>
                {cartCount}
              </span>
              {cartCount > 0 && <span className="cart-btn__total d-none d-md-inline">{formatPrice(cartTotal)}</span>}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarContent"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true"></i>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarContent">
            <ul className="navbar-nav me-auto ms-lg-4 gap-lg-2">
              <li className="nav-item">
                <NavLink to="/order" className={navClass} onClick={closeMenu}>Menu</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/build" className={navClass} onClick={closeMenu}>Build your own</NavLink>
              </li>
              {user && (
                <li className="nav-item">
                  <NavLink to="/orders" className={navClass} onClick={closeMenu}>My orders</NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2 py-3 py-lg-0 me-lg-3">
              {user ? (
                <>
                  <span className="site-header__user">
                    <i className="bi bi-person-circle me-2" aria-hidden="true"></i>
                    Hi, {user.name.split(" ")[0]}
                  </span>
                  <button type="button" className="btn btn-sm btn-outline-light" onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <NavLink to="/auth" className="btn btn-sm btn-outline-light" onClick={closeMenu}>
                  <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>
                  Log in
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
