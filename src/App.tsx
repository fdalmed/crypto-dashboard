"use client";

import { useState } from "react";
import useFetchCrypto from "./hooks/useFetchCrypto";
import DashboardModern from "./components/DashboardModern";
import CryptoTable from "./components/CryptoTable";
import Suggestions from "./components/Suggestions";
import Calculator from "./components/Calculator";
import Header from "./components/Header";

export default function App() {
  const { data, loading, error } = useFetchCrypto();
  const [view, setView] = useState<"dashboard" | "table" | "suggestions" | "calculator">("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header 
        title="Crypto Dashboard" 
        activeView={view}
        onViewChange={setView}
      />

      {/* Main content area */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}
        
        {view === "dashboard" && <DashboardModern coins={data} loading={loading} />}
        {view === "table" && <CryptoTable coins={data} loading={loading} />}
        {view === "suggestions" && <Suggestions coins={data} />}
        {view === "calculator" && <Calculator coins={data} />}
      </div>
    </div>
  );
}