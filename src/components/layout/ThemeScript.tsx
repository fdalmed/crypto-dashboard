import Script from "next/script";

const themeInitializer = `
  try {
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === null ? prefersDark : savedTheme === "true";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch {
    document.documentElement.style.colorScheme = "light";
  }
`;

export default function ThemeScript() {
  return <Script id="theme-initializer" strategy="beforeInteractive">{themeInitializer}</Script>;
}
