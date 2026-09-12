export function calculateMarketCapFromPrice(circulatingSupply: number, targetPrice: number) {
  assertSupply(circulatingSupply);
  assertNonNegative(targetPrice, "Target price");
  return circulatingSupply * targetPrice;
}

export function calculatePriceFromMarketCap(targetMarketCap: number, circulatingSupply: number) {
  assertNonNegative(targetMarketCap, "Target market cap");
  assertSupply(circulatingSupply);
  return targetMarketCap / circulatingSupply;
}

function assertSupply(value: number) {
  if (!Number.isFinite(value) || value <= 0) throw new Error("Circulating supply must be a finite value greater than zero.");
}

function assertNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be a finite value greater than or equal to zero.`);
}
