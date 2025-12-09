// src/components/DarkModeToggle.tsx
import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 bg-transparent border-none outline-none hover:bg-transparent focus:ring-0"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "☀️Light " : "🌙 Dark "}
    </button>
  );
}
