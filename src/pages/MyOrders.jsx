import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getUserOrders } from "../utils/orders";
import { formatPrice } from "../utils/format";

const orderDate = (o) =>
  o.createdAt
    ? new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : `${o.orderDate} ${o.orderTime}`;

function MyOrders() {
  const { user } = useAuth();
  const { addManyToCart, openDrawer } = useCart();
  const [orders] = useState(() => getUserOrders(user.email));

  const reorder = (order) => {
    addManyToCart(order.items);
    toast.success("Items added to your cart");
    openDrawer();
  };

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <div className="empty-state empty-state--card">
          <i className="bi bi-receipt display-4 text-body-tertiary" aria-hidden="true"></i>
          <h1 className="h3 mt-3">No orders yet</h1>
          <p className="mb-4">When you place an order, it shows up here so you can reorder in one tap.</p>
          <NavLink to="/order" className="btn btn-primary">Browse the menu</NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <header className="page-head">
        <h1>My orders</h1>
        <p>{orders.length} {orders.length === 1 ? "order" : "orders"} placed from this browser.</p>
      </header>

      <ul className="list-unstyled d-grid gap-3 orders-list">
        {orders.map((order) => {
          const count = order.items.reduce((n, i) => n + i.quantity, 0);
          return (
            <li key={order.orderId} className="order-row">
              <div className="order-row__main">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <NavLink to={`/success/${order.orderId}`} className="order-row__id">#{order.orderId}</NavLink>
                  <span className="badge text-bg-success">{order.status}</span>
                  {order.feedback && (
                    <span className="order-row__rating" aria-label={`Rated ${order.feedback.rating} of 5`}>
                      <i className="bi bi-star-fill" aria-hidden="true"></i> {order.feedback.rating}
                    </span>
                  )}
                </div>
                <p className="order-row__items">
                  {order.items.map((i) => `${i.quantity}× ${i.name}${i.isCustomized ? " (custom)" : ""}`).join(", ")}
                </p>
                <small className="text-body-secondary">{orderDate(order)}, {count} {count === 1 ? "item" : "items"}</small>
              </div>
              <div className="order-row__side">
                <strong className="fs-5">{formatPrice(order.totalAmount)}</strong>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => reorder(order)}>
                  <i className="bi bi-arrow-repeat me-1" aria-hidden="true"></i>
                  Reorder
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MyOrders;
