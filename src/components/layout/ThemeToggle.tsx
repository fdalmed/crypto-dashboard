"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDarkMode = savedTheme === null ? prefersDark : savedTheme === "true";
    document.documentElement.classList.toggle("dark", nextDarkMode);
    document.documentElement.style.colorScheme = nextDarkMode ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const nextDarkMode = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDarkMode);
    document.documentElement.style.colorScheme = nextDarkMode ? "dark" : "light";
    window.localStorage.setItem("darkMode", JSON.stringify(nextDarkMode));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle dark mode"
    >
      Theme
    </button>
  );
}
