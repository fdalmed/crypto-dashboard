import type { CoinDetail } from "@/types/market";

export type ComparisonPair = {
  firstId: string;
  secondId: string;
};

const COIN_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseComparisonPair(pair: string): ComparisonPair | null {
  const parts = pair.split("-vs-");

  if (parts.length !== 2) {
    return null;
  }

  const [firstId, secondId] = parts;

  if (!firstId || !secondId || firstId === secondId || !COIN_ID_PATTERN.test(firstId) || !COIN_ID_PATTERN.test(secondId)) {
    return null;
  }

  return { firstId, secondId };
}

export function getCanonicalComparisonPath(pair: ComparisonPair) {
  const [firstId, secondId] = [pair.firstId, pair.secondId].sort();
  return `/compare/${firstId}-vs-${secondId}`;
}

export function getAbsoluteDifference(first: number | null, second: number | null): number | null {
  if (!isValidNonNegativeNumber(first) || !isValidNonNegativeNumber(second)) {
    return null;
  }

  return Math.abs(first - second);
}

export function getHigherToLowerRatio(first: number | null, second: number | null): number | null {
  if (!isValidPositiveNumber(first) || !isValidPositiveNumber(second)) {
    return null;
  }

  return Math.max(first, second) / Math.min(first, second);
}

export function getComparisonSummary(first: CoinDetail, second: CoinDetail): string {
  const statements: string[] = [];
  const marketCapComparison = compareValues(first.marketCap, second.marketCap);
  const priceComparison = compareValues(first.currentPrice, second.currentPrice);

  if (marketCapComparison !== null) {
    statements.push(`${marketCapComparison > 0 ? first.name : second.name} currently has a larger market capitalization.`);
  }

  if (priceComparison !== null) {
    statements.push(`${priceComparison > 0 ? first.name : second.name} has a higher unit price.`);
  }

  return statements.length > 0
    ? statements.join(" ")
    : `This page compares the available market statistics for ${first.name} and ${second.name}.`;
}

function compareValues(first: number | null, second: number | null): number | null {
  if (!isValidNonNegativeNumber(first) || !isValidNonNegativeNumber(second) || first === second) {
    return null;
  }

  return first > second ? 1 : -1;
}

function isValidNonNegativeNumber(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value >= 0;
}

function isValidPositiveNumber(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value > 0;
}
