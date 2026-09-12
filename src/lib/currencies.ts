import type { CurrencyCode } from "@/types/market";

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export const CURRENCIES: Record<CurrencyCode, { label: string; locale: string }> = {
  USD: { label: "US Dollar", locale: "en-US" },
  EUR: { label: "Euro", locale: "en-IE" },
  GBP: { label: "British Pound", locale: "en-GB" },
  AED: { label: "UAE Dirham", locale: "en-AE" },
  SAR: { label: "Saudi Riyal", locale: "en-SA" },
  CAD: { label: "Canadian Dollar", locale: "en-CA" },
  AUD: { label: "Australian Dollar", locale: "en-AU" },
  SGD: { label: "Singapore Dollar", locale: "en-SG" },
  JPY: { label: "Japanese Yen", locale: "ja-JP" },
  CHF: { label: "Swiss Franc", locale: "de-CH" },
  INR: { label: "Indian Rupee", locale: "en-IN" },
  MAD: { label: "Moroccan Dirham", locale: "fr-MA" },
};
