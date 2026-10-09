import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { readJSON, writeJSON, cartKeyFor } from "../utils/storage";
import { mergeCarts } from "./cartReducer";

// Never keep the password in the "currentUser" session copy
const toSessionUser = (user) => {
  const sessionUser = { ...user };
  delete sessionUser.password;
  return sessionUser;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON("currentUser", null));

  const login = (email, password) => {
    const users = readJSON("users", []);
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) return { ok: false, field: "email", error: "No account found for this email. Register first." };
    if (found.password !== password) return { ok: false, field: "password", error: "Incorrect password." };

    const sessionUser = toSessionUser(found);

    // Move anything added as a guest into this user's cart
    const guestCart = readJSON("guestCart", []);
    if (guestCart.length) {
      const userKey = cartKeyFor(sessionUser);
      writeJSON(userKey, mergeCarts(readJSON(userKey, []), guestCart));
      localStorage.removeItem("guestCart");
    }

    writeJSON("currentUser", sessionUser);
    setUser(sessionUser);
    return { ok: true, user: sessionUser };
  };

  const register = ({ name, email, phone, password }) => {
    const users = readJSON("users", []);
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { ok: false, field: "email", error: "This email is already registered. Log in instead." };

    const newUser = {
      id: email.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password, // demo only: stored in the browser, not secure
    };
    writeJSON("users", [...users, newUser]);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
