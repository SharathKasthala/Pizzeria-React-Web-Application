import { useState } from "react";

// Light / dark mode using Bootstrap 5.3's data-bs-theme attribute
export default function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-bs-theme") || "light"
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return { theme, toggleTheme };
}
