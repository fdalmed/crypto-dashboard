import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currencies";
import type { CurrencyCode } from "@/types/market";

function getFormatter(currency: CurrencyCode, options: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(CURRENCIES[currency].locale, options);
}

export function formatCurrency(value: number, currency: CurrencyCode = DEFAULT_CURRENCY) {
  return getFormatter(currency, {
    style: "currency",
    currency,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

export function formatCompactCurrency(value: number, currency: CurrencyCode = DEFAULT_CURRENCY) {
  return getFormatter(currency, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number | null, fractionDigits = 2) {
  if (value === null || !Number.isFinite(value)) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
