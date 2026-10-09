import { readJSON, writeJSON } from "./storage";

export const getOrders = () => readJSON("orders", []);

export const getUserOrders = (email) =>
  getOrders()
    .filter((o) => o.userEmail?.toLowerCase() === email.toLowerCase())
    .sort((a, b) => b.orderId - a.orderId);

export const findOrder = (orderId, email) =>
  getOrders().find((o) => String(o.orderId) === String(orderId) && o.userEmail?.toLowerCase() === email.toLowerCase()) ||
  null;

// Saves feedback on the order, and in the old feedback_<email> list for compatibility
export function saveFeedback(orderId, email, feedback) {
  const orders = getOrders().map((o) => (String(o.orderId) === String(orderId) ? { ...o, feedback } : o));
  writeJSON("orders", orders);

  const key = "feedback_" + email.toLowerCase();
  writeJSON(key, [...readJSON(key, []), { orderId, ...feedback }]);
}
