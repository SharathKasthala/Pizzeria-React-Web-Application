// ₹ formatting in Indian style (₹1,250)
export function formatPrice(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
