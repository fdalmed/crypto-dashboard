export function convertCryptoToFiat(amount: number, priceUsd: number | null, fiatPerUsd: number | null) {
  assertAmount(amount);
  if (!isValidPrice(priceUsd) || !isValidPrice(fiatPerUsd)) return null;
  return amount * priceUsd * fiatPerUsd;
}

export function convertFiatToCrypto(amount: number, priceUsd: number | null, fiatPerUsd: number | null) {
  assertAmount(amount);
  if (!isValidPrice(priceUsd) || !isValidPrice(fiatPerUsd)) return null;
  return amount / (priceUsd * fiatPerUsd);
}

function assertAmount(amount: number) {
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Amount must be a finite value greater than or equal to zero.");
}

function isValidPrice(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value > 0;
}
