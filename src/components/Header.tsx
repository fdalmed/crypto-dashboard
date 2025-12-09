// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { FaTable, FaChartLine } from "react-icons/fa";

type Props = {
  title: string;
  activeView: "dashboard" | "table" | "suggestions" | "calculator";
  onViewChange: (view: "dashboard" | "table" | "suggestions" | "calculator") => void;
};

export default function Header({ title, activeView, onViewChange }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileMenuOpen && !(e.target as Element).closest('.header-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 header-container ${
      isScrolled 
        ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700" 
        : "py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Top row: Title + Dark Mode + Mobile Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <h1 className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300 ${
              isScrolled ? "scale-95" : "scale-100"
            }`}>
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
          </div>
        </div>

        {/* Navigation buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              onViewChange("dashboard");
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === "dashboard"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaChartLine className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => {
              onViewChange("table");
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === "table"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaTable className="w-4 h-4" />
            Table
          </button>

          <button
            onClick={() => {
              onViewChange("suggestions");
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === "suggestions"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">🤖</span>
            AI Suggestions
          </button>

          <button
            onClick={() => {
              onViewChange("calculator");
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === "calculator"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">💰</span>
            Calculator
          </button>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onViewChange("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-medium transition-all ${
                  activeView === "dashboard"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <FaChartLine className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onViewChange("table");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-medium transition-all ${
                  activeView === "table"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <FaTable className="w-4 h-4" />
                <span className="text-sm">Table</span>
              </button>

              <button
                onClick={() => {
                  onViewChange("suggestions");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-medium transition-all ${
                  activeView === "suggestions"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-lg">🤖</span>
                <span className="text-sm">AI</span>
              </button>

              <button
                onClick={() => {
                  onViewChange("calculator");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-medium transition-all ${
                  activeView === "calculator"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-lg">💰</span>
                <span className="text-sm">Calculator</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}