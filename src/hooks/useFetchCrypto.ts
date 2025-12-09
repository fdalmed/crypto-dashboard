import { useState, useEffect } from "react";
import axios from "axios";
import type { CryptoCoin } from "../types/crypto";

export default function useFetchCrypto() {
  const [data, setData] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<CryptoCoin[]>(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch cryptocurrency data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
