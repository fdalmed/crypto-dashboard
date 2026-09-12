import "server-only";

import { CRYPTO_API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config";

export class CryptoApiError extends Error {
  constructor() {
    super("Crypto market data is temporarily unavailable.");
    this.name = "CryptoApiError";
  }
}

export async function cryptoApiFetch<T>(path: string, revalidate: number): Promise<T> {
  try {
    const response = await fetch(`${CRYPTO_API_BASE_URL}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new CryptoApiError();
    return (await response.json()) as T;
  } catch {
    throw new CryptoApiError();
  }
}
