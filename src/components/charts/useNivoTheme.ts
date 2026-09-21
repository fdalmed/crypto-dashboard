"use client";

import { useSyncExternalStore } from "react";

const lightNivoTheme = {
  text: { fill: "#334155" },
  axis: {
    domain: { line: { stroke: "#94a3b8" } },
    ticks: {
      line: { stroke: "#cbd5e1" },
      text: { fill: "#475569", fontSize: 11 },
    },
    legend: { text: { fill: "#334155" } },
  },
  grid: { line: { stroke: "#e2e8f0" } },
  legends: { text: { fill: "#475569" } },
  labels: { text: { fill: "#334155" } },
  tooltip: {
    container: {
      background: "#ffffff",
      color: "#111827",
      border: "1px solid #e5e7eb",
      borderRadius: "0.375rem",
      boxShadow: "0 4px 12px rgb(15 23 42 / 0.12)",
    },
  },
  crosshair: { line: { stroke: "#64748b", strokeWidth: 1 } },
};

const darkNivoTheme = {
  text: { fill: "#cbd5e1" },
  axis: {
    domain: { line: { stroke: "#475569" } },
    ticks: {
      line: { stroke: "#475569" },
      text: { fill: "#cbd5e1", fontSize: 11 },
    },
    legend: { text: { fill: "#e2e8f0" } },
  },
  grid: { line: { stroke: "#334155" } },
  legends: { text: { fill: "#cbd5e1" } },
  labels: { text: { fill: "#e2e8f0" } },
  tooltip: {
    container: {
      background: "#1f2937",
      color: "#f1f5f9",
      border: "1px solid #475569",
      borderRadius: "0.375rem",
      boxShadow: "0 4px 12px rgb(0 0 0 / 0.35)",
    },
  },
  crosshair: { line: { stroke: "#94a3b8", strokeWidth: 1 } },
};

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export function useNivoTheme() {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  return isDark ? darkNivoTheme : lightNivoTheme;
}
