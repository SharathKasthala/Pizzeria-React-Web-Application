// Small helpers so every localStorage read/write is safe from bad JSON.
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function cartKeyFor(user) {
  return user ? `cart_${user.email.toLowerCase()}` : "guestCart";
}
