// Each cart line has a stable lineId so a plain pizza and a customized
// version of the same pizza are separate lines.
export function lineIdFor(item) {
  if (item.lineId) return item.lineId;
  if (!item.isCustomized) return `p-${item.id}`;
  const ids = (item.selectedToppings || []).map((t) => t.id).sort().join("_");
  return `c-${item.id}-${ids || "none"}`;
}

export const unitPrice = (item) => Number(item.price) + Number(item.extraPrice || 0);

// Older saved carts don't have lineId yet
export const normalizeCart = (items) =>
  (Array.isArray(items) ? items : []).map((item) => ({ ...item, lineId: lineIdFor(item) }));

export function mergeCarts(base, extra) {
  return normalizeCart(extra).reduce((items, add) => {
    const found = items.find((i) => i.lineId === add.lineId);
    return found
      ? items.map((i) => (i.lineId === add.lineId ? { ...i, quantity: i.quantity + add.quantity } : i))
      : [...items, add];
  }, normalizeCart(base));
}

export function cartReducer(items, action) {
  switch (action.type) {
    case "add":
      return mergeCarts(items, [{ ...action.item, quantity: action.item.quantity || 1 }]);
    case "increment":
      return items.map((i) => (i.lineId === action.lineId ? { ...i, quantity: i.quantity + 1 } : i));
    case "decrement":
      return items
        .map((i) => (i.lineId === action.lineId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
    case "remove":
      return items.filter((i) => i.lineId !== action.lineId);
    case "addMany":
      return mergeCarts(items, action.items);
    case "clear":
      return [];
    default:
      return items;
  }
}
